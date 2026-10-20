import OpenAI from "openai";
import { openaiKey } from "./config";

const openai = new OpenAI({
  apiKey: openaiKey,
});

export const generateDailyQuestions = async (): Promise<String> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content:
            "Generating a fun and engaging daily questions for a chat conversation",
        },
      ],
      max_completion_tokens: 50,
    });
    return (
      response.choices[0].message?.content?.trim() ||
      "What's your favorite book"
    );
  } catch (e) {
    console.error("Error generating daily Questions", e);
    return "Here is the random question. Hey! What's yours nike name?";
  }
};
