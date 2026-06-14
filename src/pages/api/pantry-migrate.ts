import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { connectDB } from '../../lib/mongodb';
import PantryItem from '../../models/pantryItem';
import { validateIngredient } from '../../lib/openai';

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
  const userId = session?.user?.id as string | undefined;
  if (!userId) return res.status(401).json({ error: 'You must be logged in.' });

  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get all pantry items for this user
    const allItems = await PantryItem.find({ userId }).lean();
    
    if (!allItems.length) {
      return res.status(200).json({ message: 'No pantry items to migrate', migrated: 0, duplicatesRemoved: 0 });
    }

    // Map to track which items to keep (by comparison key)
    const seenKeys = new Map<string, string>(); // key -> normalizedName
    const toDelete: string[] = [];
    const toKeep: { _id: string; name: string }[] = [];

    for (const item of allItems) {
      const normalizedName = normalizeName(item.name);
      const comparisonKey = getComparisonKey(normalizedName);

      if (seenKeys.has(comparisonKey)) {
        // Duplicate found, mark for deletion
        toDelete.push(item._id.toString());
        continue;
      }

      // Heuristic: short or ambiguous names may be truncated (eg: "chocol", "sal", "bu")
      const looksSuspicious = normalizedName.length <= 6;

      if (looksSuspicious) {
        if (process.env.OPENAI_API_KEY) {
          try {
            const validation = await validateIngredient(normalizedName, userId);
            if (validation) {
              const parsed = JSON.parse(validation) as { isValid?: boolean };
              if (parsed?.isValid === false) {
                toDelete.push(item._id.toString());
                continue;
              }
            }
          } catch (e) {
            // If OpenAI validation fails, fall back to conservative deletion for very short tokens
            if (normalizedName.length <= 3) {
              toDelete.push(item._id.toString());
              continue;
            }
          }
        } else {
          // No OpenAI key — be conservative and remove very short tokens
          if (normalizedName.length <= 3) {
            toDelete.push(item._id.toString());
            continue;
          }
        }
      }

      // First occurrence, update if needed
      seenKeys.set(comparisonKey, normalizedName);
      if (item.name !== normalizedName) {
        await PantryItem.updateOne({ _id: item._id }, { name: normalizedName });
      }
      toKeep.push({ _id: item._id.toString(), name: normalizedName });
    }

    // Delete duplicates
    if (toDelete.length > 0) {
      await PantryItem.deleteMany({ _id: { $in: toDelete } });
    }

    return res.status(200).json({
      message: 'Pantry migration completed',
      migrated: toKeep.length,
      duplicatesRemoved: toDelete.length,
      items: toKeep,
    });
  } catch (error) {
    console.error('Pantry migration error:', error);
    return res.status(500).json({ error: 'Pantry migration failed' });
  }
}

export default apiMiddleware(['POST'], handler);
