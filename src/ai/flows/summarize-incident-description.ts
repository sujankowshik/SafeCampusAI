'use server';

/**
 * @fileOverview A flow that uses the Gemini API to generate a concise summary of long incident descriptions.
 *
 * - summarizeIncidentDescription - A function that handles the summarization process.
 * - SummarizeIncidentDescriptionInput - The input type for the summarizeIncidentDescription function.
 * - SummarizeIncidentDescriptionOutput - The return type for the summarizeIncidentDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIncidentDescriptionInputSchema = z.object({
  description: z.string().describe('The long incident description to summarize.'),
});
export type SummarizeIncidentDescriptionInput = z.infer<typeof SummarizeIncidentDescriptionInputSchema>;

const SummarizeIncidentDescriptionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the incident description.'),
});
export type SummarizeIncidentDescriptionOutput = z.infer<typeof SummarizeIncidentDescriptionOutputSchema>;

export async function summarizeIncidentDescription(input: SummarizeIncidentDescriptionInput): Promise<SummarizeIncidentDescriptionOutput> {
  return summarizeIncidentDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIncidentDescriptionPrompt',
  input: {schema: SummarizeIncidentDescriptionInputSchema},
  output: {schema: SummarizeIncidentDescriptionOutputSchema},
  prompt: `Summarize the following incident description in 2-3 lines:\n\n{{{description}}}`, 
});

const summarizeIncidentDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeIncidentDescriptionFlow',
    inputSchema: SummarizeIncidentDescriptionInputSchema,
    outputSchema: SummarizeIncidentDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
