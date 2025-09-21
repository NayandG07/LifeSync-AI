// src/ai/flows/personalized-water-intake.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized water intake suggestions based on user health profile data.
 *
 * - personalizedWaterIntake - A function that calls the personalized water intake flow.
 * - PersonalizedWaterIntakeInput - The input type for the personalizedWaterIntake function.
 * - PersonalizedWaterIntakeOutput - The return type for the personalizedWaterIntake function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWaterIntakeInputSchema = z.object({
  heightCm: z
    .number()
    .describe('The height of the user in centimeters.')
    .gt(0),
  weightKg: z
    .number()
    .describe('The weight of the user in kilograms.')
    .gt(0),
  ageYears: z
    .number()
    .describe('The age of the user in years.')
    .gt(0),
  activityLevel: z
    .enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive'])
    .describe('The activity level of the user.'),
});
export type PersonalizedWaterIntakeInput = z.infer<
  typeof PersonalizedWaterIntakeInputSchema
>;

const PersonalizedWaterIntakeOutputSchema = z.object({
  suggestedIntakeMl: z
    .number()
    .describe('The suggested daily water intake in milliliters.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested water intake.'),
});
export type PersonalizedWaterIntakeOutput = z.infer<
  typeof PersonalizedWaterIntakeOutputSchema
>;

export async function personalizedWaterIntake(
  input: PersonalizedWaterIntakeInput
): Promise<PersonalizedWaterIntakeOutput> {
  return personalizedWaterIntakeFlow(input);
}

const personalizedWaterIntakePrompt = ai.definePrompt({
  name: 'personalizedWaterIntakePrompt',
  input: {schema: PersonalizedWaterIntakeInputSchema},
  output: {schema: PersonalizedWaterIntakeOutputSchema},
  prompt: `You are a health expert providing personalized water intake suggestions.

  Based on the user's health profile, suggest a daily water intake in milliliters and explain your reasoning.

  Health Profile:
  - Height: {{heightCm}} cm
  - Weight: {{weightKg}} kg
  - Age: {{ageYears}} years
  - Activity Level: {{activityLevel}}

  Consider these factors when making your suggestion:
  - General guidelines for water intake based on weight and activity level.
  - The impact of age and activity level on hydration needs.

  Provide the suggested intake in milliliters and a brief explanation of your reasoning.
  Ensure your answer is in the correct format, according to the schema.`,
});

const personalizedWaterIntakeFlow = ai.defineFlow(
  {
    name: 'personalizedWaterIntakeFlow',
    inputSchema: PersonalizedWaterIntakeInputSchema,
    outputSchema: PersonalizedWaterIntakeOutputSchema,
  },
  async input => {
    const {output} = await personalizedWaterIntakePrompt(input);
    return output!;
  }
);
