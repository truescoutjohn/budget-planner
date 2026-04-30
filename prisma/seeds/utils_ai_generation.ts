import { z } from "zod";
import model from "../../src/utils/gemini";

export default async function generateItemsByAI<T>(
  count: number,
  schema: z.ZodType<T>,
  prompt: (count: number) => string,
) {
  const promptText = prompt(count);
  const result = await model.generateContent(promptText);
  const response = JSON.parse(result.response.text());

  return z.array(schema).parse(response);
}
