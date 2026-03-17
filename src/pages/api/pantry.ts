import type { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { connectDB } from '../../lib/mongodb';
import PantryItem from '../../models/pantryItem';

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ');

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
    try {
      const created = await PantryItem.create({ userId, name: normalized });
      return res.status(200).json({ item: { _id: created._id, name: created.name } });
    } catch (error) {
      // Likely duplicate (unique index)
      return res.status(200).json({ item: { name: normalized } });
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

