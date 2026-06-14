import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { validateIngredient } from '../../lib/openai';
import { connectDB } from '../../lib/mongodb';
import PantryItem from '../../models/pantryItem';

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

const isLikelyValidPantryItem = (name: string) => {
  const normalized = normalizeName(name);
  if (normalized.length < 3) return false;
  if (!/[a-zA-Z]/.test(normalized)) return false;
  if (/\d/.test(normalized)) return false;
  if (!/[aeiouy]/i.test(normalized)) return false;
  if (/\b(breakfast|lunch|dinner|meal|food|ingredient|recipe|stuff|anything|nothing)\b/i.test(normalized)) return false;
  return true;
};

const findDuplicateItem = (items: { name: string }[], name: string) => {
  const key = getComparisonKey(name);
  return items.find((item) => {
    const itemKey = getComparisonKey(item.name);
    return itemKey === key || item.name.toLowerCase() === name.toLowerCase();
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse, session: any) {
  const userId = session?.user?.id as string | undefined;
  if (!userId) return res.status(401).json({ error: 'You must be logged in.' });

  await connectDB();

  if (req.method === 'GET') {
    const items = await PantryItem.find({ userId })
      .select('name')
      .sort({ name: 1 })
      .lean();
    return res.status(200).json({ items });
  }

  if (req.method === 'POST') {
    const { name } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Missing pantry item name' });
    }

    const normalized = normalizeName(name);
    if (!isLikelyValidPantryItem(normalized)) {
      return res.status(400).json({ error: 'Invalid pantry item name' });
    }

    const existingItems = await PantryItem.find({ userId }).select('name').lean();
    const duplicate = findDuplicateItem(existingItems, normalized);
    if (duplicate) {
      return res.status(200).json({ item: duplicate, message: 'Duplicate pantry item' });
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const validationResponse = await validateIngredient(normalized, userId);
        if (validationResponse) {
          const parsedValidation = JSON.parse(validationResponse) as { isValid?: boolean; possibleVariations?: string[] };
          if (!parsedValidation?.isValid) {
            return res.status(400).json({
              error: 'Invalid pantry item name',
              suggested: Array.isArray(parsedValidation.possibleVariations) ? parsedValidation.possibleVariations : [],
            });
          }
        }
      } catch (error) {
        console.warn('Pantry validation service unavailable. Using local validation only.', error);
      }
    }

    try {
      const created = await PantryItem.create({ userId, name: normalized });
      return res.status(200).json({ item: { _id: created._id, name: created.name } });
    } catch (error) {
      const duplicateItem = findDuplicateItem(existingItems, normalized);
      return res.status(200).json({ item: duplicateItem ? duplicateItem : { name: normalized } });
    }
  }

  if (req.method === 'DELETE') {
    const { name } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Missing pantry item name' });
    }
    const normalized = normalizeName(name);
    await PantryItem.deleteOne({ userId, name: normalized });
    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default apiMiddleware(['GET', 'POST', 'DELETE'], handler);

