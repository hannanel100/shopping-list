import { generateText, } from "ai";
import { openai } from "@ai-sdk/openai";



export async function extractIngredients(content: string): Promise<string> {
    const result = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: `Extract only the ingredients list from the following recipe content. 
        Return the ingredients as a JSON array of strings.
        If no ingredients are found, return an empty array.
        Recipe content:
        ${content}`,
    });
    console.log(result.text)
    return result.text
}
