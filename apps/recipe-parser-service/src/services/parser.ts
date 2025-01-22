import { generateObject, } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic"
import { z } from "zod";

import dotenv from "dotenv"

dotenv.config();
const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
const schema = z.object({
    ingredients: z.array(z.string()),
});
export async function extractIngredients(content: string): Promise<string> {

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
    const { ingredients } = object
    console.log(ingredients)
    return JSON.stringify(ingredients)
}
