import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../../lib/apiMiddleware';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../models/user';
import PantryItem from '../../../models/pantryItem';
import { validateIngredient } from '../../../lib/openai';

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ');
const singularizeWord = (word: string) => {
  if (word.endsWith("'s")) return word.slice(0, -2);
  if (word.endsWith('ies') && word.length > 3) return `${word.slice(0, -3)}y`;
  if (/[^aeiou]ses$/.test(word)) return word;
  if (word.endsWith('es') && !/(ses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
};
const getComparisonKey = (name: string) => {
  const cleaned = normalizeName(name).toLowerCase();
  const words = cleaned.split(' ').filter(Boolean);
  if (!words.length) return '';
  const last = singularizeWord(words[words.length - 1]);
  return [...words.slice(0, -1), last].join(' ');
};

async function handler(req: NextApiRequest, res: NextApiResponse, session: any) {
  // Simple admin guard using a secret header
  const secret = req.headers['x-admin-migrate-secret'] as string | undefined;
  if (!process.env.ADMIN_MIGRATE_SECRET || secret !== process.env.ADMIN_MIGRATE_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await connectDB();

  try {
    const users = await User.find().select('_id').lean();
    let migratedCount = 0;
    let duplicatesRemovedTotal = 0;

    for (const u of users) {
      const userId = (u as any)._id.toString();
      const rawItems = await PantryItem.find({ userId }).select('name').lean();
      if (!rawItems.length) continue;

      const keepByKey = new Map<string, string>();
      let duplicatesRemoved = 0;

      for (const it of rawItems) {
        const normalized = normalizeName(it.name);
        const key = getComparisonKey(normalized) || normalized.toLowerCase();

        if (keepByKey.has(key)) {
          await PantryItem.deleteOne({ _id: (it as any)._id }).exec();
          duplicatesRemoved += 1;
          continue;
        }

        // Heuristic for suspicious/truncated tokens
        const looksSuspicious = normalized.length <= 6;
        if (looksSuspicious) {
          if (process.env.OPENAI_API_KEY) {
            try {
              const validation = await validateIngredient(normalized, userId);
              if (validation) {
                const parsed = JSON.parse(validation) as { isValid?: boolean };
                if (parsed?.isValid === false) {
                  await PantryItem.deleteOne({ _id: (it as any)._id }).exec();
                  duplicatesRemoved += 1;
                  continue;
                }
              }
            } catch (e) {
              if (normalized.length <= 3) {
                await PantryItem.deleteOne({ _id: (it as any)._id }).exec();
                duplicatesRemoved += 1;
                continue;
              }
            }
          } else {
            if (normalized.length <= 3) {
              await PantryItem.deleteOne({ _id: (it as any)._id }).exec();
              duplicatesRemoved += 1;
              continue;
            }
          }
        }

        // Keep and normalize
        keepByKey.set(key, (it as any)._id.toString());
        if (it.name !== normalized) {
          await PantryItem.updateOne({ _id: (it as any)._id }, { name: normalized }).exec();
        }
      }

      duplicatesRemovedTotal += duplicatesRemoved;
      migratedCount += keepByKey.size;

      try {
        await User.updateOne({ _id: userId }, { pantryMigratedAt: new Date() }).exec();
      } catch (e) {
        // ignore per-user update failures
      }
    }

    return res.status(200).json({ message: 'Migration completed', migratedCount, duplicatesRemovedTotal });
  } catch (error) {
    console.error('Admin migration failed:', error);
    return res.status(500).json({ error: 'Migration failed' });
  }
}

export default apiMiddleware(['POST'], handler);
