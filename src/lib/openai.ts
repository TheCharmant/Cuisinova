import OpenAI from 'openai';
import { Ingredient, DietaryPreference, RecipeCategory, Recipe, ExtendedRecipe } from '../types/index';
import aiGenerated from '../models/aigenerated';
import { connectDB } from '../lib/mongodb';
import { ImagesResponse } from 'openai/resources';
import recipeModel from '../models/recipe';
import { z } from 'zod';
import {
    getRecipeGenerationPrompt,
    getImageGenerationPrompt,
    getIngredientValidationPrompt,
    getRecipeNarrationPrompt,
    getRecipeTaggingPrompt,
    getChatAssistantSystemPrompt
} from './prompts';

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Save OpenAI responses in the database for logging/tracking
type SaveOpenaiResponsesType = {
    userId: string;
    prompt: string;
    response: any;
    model?: string;
};
const saveOpenaiResponses = async ({ userId, prompt, response, model }: SaveOpenaiResponsesType) => {
    try {
        await connectDB();
        const { _id } = await aiGenerated.create({
            userId,
            prompt,
            response,
            model,
        } as any);
        return _id;
    } catch (error) {
        console.error('Failed to save response to db:', error);
        return null;
    }
};

type ResponseType = {
    recipes: string | null;
    openaiPromptId: string;
};

const RecipeGenerationSchema = z.array(
    z.object({
        name: z.string().min(1),
        ingredients: z.array(
            z.object({
                name: z.string().min(1),
                quantity: z.string().nullable().optional(),
            })
        ).min(1),
        instructions: z.array(z.string().min(1)).min(1),
        dietaryPreference: z.array(z.string()).optional(),
        additionalInformation: z.object({
            tips: z.string().optional().default(''),
            variations: z.string().optional().default(''),
            servingSuggestions: z.string().optional().default(''),
            nutritionalInformation: z.string().optional().default(''),
        }).optional().default({
            tips: '',
            variations: '',
            servingSuggestions: '',
            nutritionalInformation: '',
        }),
    })
).min(1);

const extractJsonArray = (text: string): string | null => {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
};

// Generate recipes by sending a chat completion request to OpenAI using ingredients, categories, and dietary preferences
export const generateRecipe = async (ingredients: Ingredient[], categories: RecipeCategory[], dietaryPreferences: DietaryPreference[], userId: string): Promise<ResponseType> => {
    try {
        // API request limit check removed
        await connectDB();
        // const totalGeneratedCount = await aiGenerated.countDocuments({ userId }).exec();
        // const apiRequestLimit = Number(process.env.API_REQUEST_LIMIT || 50);
        
        // if (totalGeneratedCount >= apiRequestLimit) {
        //     throw new Error(`You have reached your limit of ${apiRequestLimit} AI-generated recipes.`);
        // }
        
        const prompt = getRecipeGenerationPrompt(ingredients, categories, dietaryPreferences);
        const model = 'gpt-3.5-turbo';
        const response = await openai.chat.completions.create({
            model,
            messages: [{
                role: 'user',
                content: prompt,
            }],
            max_tokens: 1500,
        });
        const _id = await saveOpenaiResponses({ userId, prompt, response, model });
        const recipesContent = response.choices[0].message?.content ?? null;

        const tryParseAndValidate = (raw: string) => {
            const extracted = extractJsonArray(raw) ?? raw;
            const parsed = JSON.parse(extracted);
            const validated = RecipeGenerationSchema.parse(parsed);
            const updatedRecipes = validated.map((recipeLike: any) => ({
                ...recipeLike,
                dietaryPreference: dietaryPreferences.length > 0 ? dietaryPreferences : [],
                categories: categories.length > 0 ? categories : [],
            }));
            return JSON.stringify(updatedRecipes);
        };

        if (recipesContent) {
            try {
                return { recipes: tryParseAndValidate(recipesContent), openaiPromptId: _id || 'null-prompt-id' };
            } catch (error) {
                console.error('Failed to parse/validate AI response. Retrying with JSON repair...', error);
            }

            // One retry: ask model to output ONLY valid JSON array
            const repairPrompt = `Fix the following so it becomes a strictly valid JSON array of recipes (no markdown, no commentary). Output JSON only.\n\n${recipesContent}`;
            const repaired = await openai.chat.completions.create({
                model,
                messages: [{ role: 'user', content: repairPrompt }],
                max_tokens: 1500,
            });
            const repairedContent = repaired.choices[0].message?.content ?? null;
            if (repairedContent) {
                try {
                    return { recipes: tryParseAndValidate(repairedContent), openaiPromptId: _id || 'null-prompt-id' };
                } catch (error) {
                    console.error('Failed to parse/validate repaired AI response:', error);
                }
            }
        }

        return { recipes: recipesContent, openaiPromptId: _id || 'null-prompt-id' };
    } catch (error) {
        console.error('Failed to generate recipe:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate recipe');
    }
};

// Generate an image using OpenAI by sending an image generation prompt to OpenAI
const generateImage = async (prompt: string, model: string): Promise<ImagesResponse> => {
    try {
        console.log('Generating image with model:', model, 'prompt length:', prompt.length);
        const response = await openai.images.generate({
            model,
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'url',
        });
        console.log('Image generation successful, response data:', response.data?.[0]?.url ? 'URL present' : 'No URL');
        return response;
    } catch (error) {
        console.error('OpenAI image generation error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw new Error(error instanceof Error ? error.message : 'Failed to generate image');
    }
};

// Generate images for an array of recipes and return image links paired with recipe names
export const generateImages = async (recipes: Recipe[], userId: string) => {
    try {
        // API request limit check removed
        await connectDB();
        // const totalGeneratedCount = await aiGenerated.countDocuments({ userId }).exec();
        // const apiRequestLimit = Number(process.env.API_REQUEST_LIMIT || 50);
        
        // if (totalGeneratedCount >= apiRequestLimit) {
        //     throw new Error(`You have reached your limit of ${apiRequestLimit} AI-generated recipes.`);
        // }
        
        const model = 'gpt-image';
        const imageResults = await Promise.allSettled(
            recipes.map((recipe) =>
                generateImage(getImageGenerationPrompt(recipe.name, recipe.ingredients), model)
            )
        );

        const settledResponses = imageResults.map((result, idx) => {
            const recipeName = recipes[idx].name;

            if (result.status !== 'fulfilled') {
                console.error(`Image generation failed for recipe: ${recipeName}`, result.reason);
                return {
                    imgLink: '/logo.svg',
                    name: recipeName,
                };
            }

            const imageResponse = result.value;
            const imageData = imageResponse?.data?.[0];
            const url = imageData?.url ?? (imageData?.b64_json ? `data:image/png;base64,${imageData.b64_json}` : undefined);

            if (!url) {
                console.error(`Image generation returned no image URL for recipe: ${recipeName}`, imageResponse);
                return {
                    imgLink: '/logo.svg',
                    name: recipeName,
                };
            }

            return {
                imgLink: url,
                name: recipeName,
            };
        });

        await saveOpenaiResponses({
            userId,
            prompt: `Image generation for recipe names ${recipes.map(r => r.name).join(' ,')} (note: not exact prompt)`,
            response: settledResponses,
            model
        });

        return settledResponses;
    } catch (error) {
        console.error('Error generating image:', error);
        // Return fallback images instead of throwing an error
        return recipes.map((recipe) => ({
            imgLink: '/logo.svg',
            name: recipe.name,
        }));
    }
};

// Validate an ingredient name by sending a prompt to OpenAI and returning its response
export const validateIngredient = async (ingredientName: string, userId: string): Promise<string | null> => {
    try {
        const prompt = getIngredientValidationPrompt(ingredientName);
        const model = 'gpt-3.5-turbo';
        const response = await openai.chat.completions.create({
            model,
            messages: [{
                role: 'user',
                content: prompt,
            }],
            max_tokens: 800,
        });
        await saveOpenaiResponses({ userId, prompt, response, model });
        return response.choices[0].message?.content;
    } catch (error) {
        console.error('Failed to validate ingredient:', error);
        throw new Error('Failed to validate ingredient');
    }
};

// Retrieve narrated text for a recipe by sending a narration prompt to OpenAI
const getRecipeNarration = async (recipe: ExtendedRecipe, userId: string): Promise<string | null> => {
    try {
        const prompt = getRecipeNarrationPrompt(recipe);
        console.info('Getting recipe narration text from OpenAI...');
        const model = 'gpt-3.5-turbo';
        const response = await openai.chat.completions.create({
            model,
            messages: [{
                role: 'user',
                content: prompt,
            }],
            max_tokens: 1500,
        });
        const _id = await saveOpenaiResponses({ userId, prompt, response, model });
        return response.choices[0].message?.content;
    } catch (error) {
        console.error('Failed to generate recipe narration:', error);
        throw new Error('Failed to generate recipe narration');
    }
};

// Convert narrated text to speech (TTS) using OpenAI audio API and return an audio buffer
export const getTTS = async (recipe: ExtendedRecipe, userId: string): Promise<Buffer> => {
    try {
        // API request limit check removed
        await connectDB();
        // const totalGeneratedCount = await aiGenerated.countDocuments({ userId }).exec();
        // const apiRequestLimit = Number(process.env.API_REQUEST_LIMIT || 100);
        
        // if (totalGeneratedCount >= apiRequestLimit) {
        //     throw new Error(`You have reached your limit of ${apiRequestLimit} AI-generated content.`);
        // }
        
        const text = await getRecipeNarration(recipe, userId);
        if (!text) throw new Error('Unable to get text for recipe narration');
        // Randomly select a voice type from available options
        type voiceTypes = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
        const voiceChoices: voiceTypes[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
        const voice = voiceChoices[Math.floor(Math.random() * voiceChoices.length)];
        console.info('Getting recipe narration audio from OpenAI...');
        const model = 'tts-1';
        const mp3 = await openai.audio.speech.create({
            model,
            voice,
            input: text,
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await saveOpenaiResponses({ userId, prompt: text, response: mp3, model });
        return buffer;
    } catch (error) {
        console.error('Failed to generate tts:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate audio narration');
    }
};

// Generate tags for a recipe by sending a tagging prompt to OpenAI and updating the recipe document in the database
export const generateRecipeTags = async (recipe: ExtendedRecipe, userId: string): Promise<undefined> => {
    try {
        // API request limit check removed
        await connectDB();
        // const totalGeneratedCount = await aiGenerated.countDocuments({ userId }).exec();
        // const apiRequestLimit = Number(process.env.API_REQUEST_LIMIT || 50);
        
        // if (totalGeneratedCount >= apiRequestLimit) {
        //     console.warn(`User ${userId} has reached their limit of ${apiRequestLimit} AI-generated content.`);
        //     return; // Silently return without generating tags
        // }
        
        const prompt = getRecipeTaggingPrompt(recipe);
        const model = 'gpt-3.5-turbo';
        const response = await openai.chat.completions.create({
            model,
            messages: [{
                role: 'user',
                content: prompt,
            }],
            max_tokens: 1500,
        });
        await saveOpenaiResponses({ userId, prompt, response, model });
        const [tagsObject] = response.choices;
        const rawTags = tagsObject.message?.content?.trim();
        let tagsArray: string[] = [];
        if (rawTags) {
            try {
                tagsArray = JSON.parse(rawTags);
                if (!Array.isArray(tagsArray) || tagsArray.some(tag => typeof tag !== 'string')) {
                    console.error('Invalid JSON structure: Expected an array of strings.');
                    // Set default tags instead of throwing an error
                    tagsArray = ['recipe', recipe.name.toLowerCase(), ...recipe.ingredients.map(i => i.name.toLowerCase())];
                }
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                console.error('Received malformed JSON:', rawTags);
                // Set default tags instead of throwing an error
                tagsArray = ['recipe', recipe.name.toLowerCase(), ...recipe.ingredients.map(i => i.name.toLowerCase())];
            }
        }
        if (tagsArray.length) {
            const tags = tagsArray.map((tag: string) => ({ tag: tag.toLowerCase() }));
            const update = { $set: { tags } };
            console.info(`Adding tags -> ${tagsArray} for new recipe -> ${recipe.name} from OpenAI api`);
            await recipeModel.findByIdAndUpdate(recipe._id, update);
        }
        return;
    } catch (error) {
        console.error('Failed to generate tags for the recipe:', error);
        // Don't throw an error, just log it and continue
        return;
    }
};

// Generate a chat response by sending a message to OpenAI and returning the assistant's reply
export const generateChatResponse = async (
    message: string,
    recipe: ExtendedRecipe,
    history: any[],
    userId: string
): Promise<{ reply: string; totalTokens: number; reachedLimit?: boolean }> => {
    try {
        // API request limit check removed
        await connectDB();
        // const totalGeneratedCount = await aiGenerated.countDocuments({ userId }).exec();
        // const apiRequestLimit = Number(process.env.API_REQUEST_LIMIT || 50);
        
        // if (totalGeneratedCount >= apiRequestLimit) {
        //     return { 
        //         reply: `You have reached your limit of ${apiRequestLimit} AI-generated content. Please try again later.`, 
        //         totalTokens: 0,
        //         reachedLimit: true
        //     };
        // }
        
        const model = 'gpt-3.5-turbo';
        const messages = [
            { role: 'system', content: getChatAssistantSystemPrompt(recipe) },
            ...history,
            { role: 'user', content: message },
        ];

        const response = await openai.chat.completions.create({
            model,
            messages,
            max_tokens: 1000,
        });

        const reply = response.choices?.[0]?.message?.content ?? 'Sorry, I had trouble responding.';
        const totalTokens = response.usage?.total_tokens ?? 0;

        // Save to DB only on first message
        if (history.length === 1) {
            await saveOpenaiResponses({
                userId,
                prompt: `Chat session started for recipe: ${recipe.name}, first message: ${message}`,
                response,
                model,
            });
        }

        return { reply, totalTokens };
    } catch (error) {
        console.error('Failed to generate chat response:', error);
        return { reply: 'Sorry, I had trouble responding.', totalTokens: 0 };
    }
};
