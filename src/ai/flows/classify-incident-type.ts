'use server';

/**
 * @fileOverview This file defines a Genkit flow for classifying incident types using the Gemini API.
 *
 * classifyIncident - An async function that takes an incident description and returns the classified incident type.
 * ClassifyIncidentInput - The input type for the classifyIncident function.
 * ClassifyIncidentOutput - The output type for the classifyIncident function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyIncidentInputSchema = z.object({
  description: z.string().describe('The description of the incident.'),
});
export type ClassifyIncidentInput = z.infer<typeof ClassifyIncidentInputSchema>;

const ClassifyIncidentOutputSchema = z.object({
  aiCategory: z
    .string()
    .describe(
      'The classified incident type (e.g., harassment, theft, bullying, mental health, infrastructure issue, other).'
    ),
});
export type ClassifyIncidentOutput = z.infer<typeof ClassifyIncidentOutputSchema>;

export async function classifyIncident(input: ClassifyIncidentInput): Promise<ClassifyIncidentOutput> {
  return classifyIncidentFlow(input);
}

const classifyIncidentPrompt = ai.definePrompt({
  name: 'classifyIncidentPrompt',
  input: {schema: ClassifyIncidentInputSchema},
  output: {schema: ClassifyIncidentOutputSchema},
  prompt: `You are an AI assistant specializing in classifying incident reports.
  Given the incident description, classify the incident into one of the following categories: harassment, theft, bullying, mental health, infrastructure issue, or other.
  Return ONLY the category name.

  Incident Description: {{{description}}}`,
});

const classifyIncidentFlow = ai.defineFlow(
  {
    name: 'classifyIncidentFlow',
    inputSchema: ClassifyIncidentInputSchema,
    outputSchema: ClassifyIncidentOutputSchema,
  },
  async input => {
    const {output} = await classifyIncidentPrompt(input);
    return output!;
  }
);
