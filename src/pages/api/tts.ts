import { NextApiRequest, NextApiResponse } from 'next';
import { apiMiddleware } from '../../lib/apiMiddleware';
import { connectDB } from '../../lib/mongodb';
import Recipe from '../../models/recipe';
import { uploadAudioToS3 } from '../../lib/awss3';
import { getTTS } from '../../lib/openai'
import { ExtendedRecipe } from '../../types';

// Simple in-memory cache for TTS audio URLs (recipeId -> { audioUrl, timestamp })
const ttsCache = new Map<string, { audioUrl: string; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function handler(req: NextApiRequest, res: NextApiResponse, session: any) {
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Missing recipeId' });
  }

  try {
    // Check cache first
    const cached = ttsCache.get(recipeId);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
      console.info('TTS cache hit for recipe:', recipeId);
      return res.status(200).json({ audio: cached.audioUrl });
    }

    // Connect to the database and fetch the recipe
    await connectDB();
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // If the recipe already has audio in database, use it
    if (recipe.audio) {
      console.info('Recipe already has audio:', recipeId);
      ttsCache.set(recipeId, { audioUrl: recipe.audio, timestamp: Date.now() });
      return res.status(200).json({ audio: recipe.audio });
    }
    
    console.info('Synthesizing text to speech for recipe:', recipeId);
    const leanRecipe = recipe.toObject() as unknown as ExtendedRecipe;
    const audioBuffer = await getTTS(leanRecipe, session.user.id);
    console.info('Uploading audio to s3...');
    // Upload the audio file to S3
    const s3Url = await uploadAudioToS3(
      audioBuffer, // Buffer from Google TTS API
      `${recipeId}.mp3`
    );

    // Update the recipe with the S3 URL (non-blocking)
    recipe.audio = s3Url;
    await recipe.save().catch(err => console.warn('Failed to save audio to recipe:', err));
    console.info('Saved generated audio to S3');

    // Cache the result
    ttsCache.set(recipeId, { audioUrl: s3Url, timestamp: Date.now() });

    // Return the audio URL
    return res.status(200).json({ audio: s3Url });
  } catch (error) {
    console.error('Error handling TTS request:', error);
    return res.status(500).json({ message: 'Error generating or uploading audio' });
  }
}

export default apiMiddleware(['POST'], handler);
