import { generateObject, } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic"
import { z } from "zod";
import { createHash } from "crypto";
import dotenv from "dotenv"
import { prisma } from "@repo/database";

dotenv.config();

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
const schema = z.object({
    ingredients: z.array(z.string()),
});

function generateContentHash(content: string): string {
    console.log('Generating content hash...');
    const normalizedContent = content.toLowerCase().replace(/\s+/g, ' ').trim();
    const hash = createHash('sha256').update(normalizedContent).digest('hex');
    console.log(`Generated hash: ${hash.substring(0, 8)}...`);
    return hash;
}

export async function extractIngredients(content: string, url?: string): Promise<string> {
    console.log('Starting ingredient extraction...', url ? `URL: ${url}` : 'No URL provided');
    console.log(`Content length: ${content.length} characters`);

    const contentHash = generateContentHash(content);

    console.log('Checking cache...');
    const cached = await prisma.parsedRecipe.findFirst({
        where: {
            OR: [
                { contentHash },
                { url: url ? url : undefined }
            ]
        }
    });

    if (cached) {
        console.log('Cache hit!', {
            ingredientsCount: cached.ingredients.length,
            url: cached.url,
            hashMatch: cached.contentHash === contentHash
        });

        if (cached.url === url && cached.contentHash !== contentHash) {
            console.log('URL matches but content changed, updating cache...');
            const updated = await parseAndStore(content, url);
            return JSON.stringify(updated.ingredients);
        }
        return JSON.stringify(cached.ingredients);
    }

    console.log('Cache miss, parsing new content...');
    return parseAndStore(content, url).then(result => JSON.stringify(result.ingredients));
}

async function parseAndStore(content: string, url?: string) {
    console.log('Starting AI parsing...');

    const { object } = await generateObject({
        schema,
        model: anthropic("claude-3-5-haiku-latest"),
        prompt: `Extract only the ingredients list from the following recipe content. 
      The ingredients should be in the following format:
      [
          "Ingredient 1",
          "Ingredient 2",
          "Ingredient 3",
          ...
      ]
      The ingredients are intended to be used in a shopping list, so they should only name the ingredients, not the quantities or measurements.
      Return the ingredients as a JSON array of strings.
      If no ingredients are found, return an empty array.
      Recipe content:
      ${content}`,
    });

    const { ingredients } = object;
    console.log('AI parsing complete', {
        ingredientsFound: ingredients.length,
        firstFewIngredients: ingredients.slice(0, 3)
    });

    console.log('Storing parsed recipe in database...');
    const stored = await prisma.parsedRecipe.create({
        data: {
            content,
            contentHash: generateContentHash(content),
            url,
            ingredients,
        }
    });
    console.log('Successfully stored recipe', {
        id: stored.id,
        ingredientsCount: stored.ingredients.length
    });

    return stored;
}
