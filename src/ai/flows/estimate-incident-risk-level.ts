'use server';

/**
 * @fileOverview Estimates the risk level of a safety incident using the Gemini API.
 *
 * - estimateIncidentRiskLevel - A function that estimates the risk level of a safety incident.
 * - EstimateIncidentRiskLevelInput - The input type for the estimateIncidentRiskLevel function.
 * - EstimateIncidentRiskLevelOutput - The return type for the estimateIncidentRiskLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateIncidentRiskLevelInputSchema = z.object({
  title: z.string().describe('The title of the incident.'),
  description: z.string().describe('The description of the incident.'),
});
export type EstimateIncidentRiskLevelInput = z.infer<
  typeof EstimateIncidentRiskLevelInputSchema
>;

const EstimateIncidentRiskLevelOutputSchema = z.object({
  aiRiskLevel: z
    .enum(['Low', 'Medium', 'High', 'Critical'])
    .describe('The estimated risk level of the incident.'),
});
export type EstimateIncidentRiskLevelOutput = z.infer<
  typeof EstimateIncidentRiskLevelOutputSchema
>;

export async function estimateIncidentRiskLevel(
  input: EstimateIncidentRiskLevelInput
): Promise<EstimateIncidentRiskLevelOutput> {
  return estimateIncidentRiskLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateIncidentRiskLevelPrompt',
  input: {schema: EstimateIncidentRiskLevelInputSchema},
  output: {schema: EstimateIncidentRiskLevelOutputSchema},
  prompt: `You are an AI assistant that estimates the risk level of safety incidents.

  Based on the title and description of the incident, determine the risk level.

  The risk levels are: Low, Medium, High, Critical.

  Title: {{{title}}}
  Description: {{{description}}}

  Risk Level:`,
});

const estimateIncidentRiskLevelFlow = ai.defineFlow(
  {
    name: 'estimateIncidentRiskLevelFlow',
    inputSchema: EstimateIncidentRiskLevelInputSchema,
    outputSchema: EstimateIncidentRiskLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
