// src/ai/flows/lifesync-chatbot.ts
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for user questions
const LifeSyncChatbotInputSchema = z.object({
  question: z.string().describe('The user\'s question about LifeSync AI.'),
});
export type LifeSyncChatbotInput = z.infer<typeof LifeSyncChatbotInputSchema>;

// Output schema for the chatbot's answer
const LifeSyncChatbotOutputSchema = z.object({
  answer: z.string().describe('The AI chatbot\'s response to the user\'s question about LifeSync AI.'),
});
export type LifeSyncChatbotOutput = z.infer<typeof LifeSyncChatbotOutputSchema>;

// Define the prompt for the AI
const prompt = ai.definePrompt({
  name: 'lifesyncChatbotPrompt',
  input: { schema: LifeSyncChatbotInputSchema },
  output: { schema: LifeSyncChatbotOutputSchema },
  prompt: `
You are a knowledgeable AI assistant specialized in LifeSync AI, a personal health companion app.  
Answer user questions clearly, concisely, and accurately based solely on LifeSync's features and services.  
Do NOT refer to external doctors, databases, or medical advice beyond the LifeSync app capabilities.  

User Question: {{{question}}}
`,
});

// Define the chatbot flow
export const lifesyncChatbotFlow = ai.defineFlow({
  name: 'lifesyncChatbotFlow',
  inputSchema: LifeSyncChatbotInputSchema,
  outputSchema: LifeSyncChatbotOutputSchema,
}, async (input) => {
  const { output } = await prompt(input);
  return output!;
});

// Export the main function
export async function lifesyncChatbot(input: LifeSyncChatbotInput): Promise<LifeSyncChatbotOutput> {
  return lifesyncChatbotFlow(input);
}
