'use server';
/**
 * @fileOverview An AI agent that dynamically adjusts game difficulty based on player performance.
 *
 * - dynamicDifficultyAdjustment - A function that handles the dynamic difficulty adjustment process.
 * - DynamicDifficultyAdjustmentInput - The input type for the dynamicDifficultyAdjustment function.
 * - DynamicDifficultyAdjustmentOutput - The return type for the dynamicDifficultyAdjustment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicDifficultyAdjustmentInputSchema = z.object({
  currentScore: z.number().describe('The player\'s current score.'),
  perfectDrops: z.number().describe('Number of perfect block drops in a row (combo).'),
  missedDrops: z.number().describe('Number of blocks that missed or fell off the tower.'),
  gameDurationSeconds: z.number().describe('How long the current game session has lasted in seconds.'),
  currentSpinSpeedMultiplier: z.number().describe('The current tower spin speed multiplier (1.0 is normal).'),
  currentBlockDropIntervalMultiplier: z.number().describe('The current block drop interval multiplier (1.0 is normal).'),
});
export type DynamicDifficultyAdjustmentInput = z.infer<typeof DynamicDifficultyAdjustmentInputSchema>;

const DynamicDifficultyAdjustmentOutputSchema = z.object({
  spinSpeedMultiplier: z.number().describe('The suggested new tower spin speed multiplier. A value > 1.0 increases speed, < 1.0 decreases speed. Keep changes subtle, e.g., between 0.9 and 1.1.'),
  blockDropIntervalMultiplier: z.number().describe('The suggested new block drop interval multiplier. A value > 1.0 makes drops slower, < 1.0 makes drops faster. Keep changes subtle, e.g., between 0.9 and 1.1.'),
  reasoning: z.string().describe('A brief explanation for the suggested adjustments.'),
});
export type DynamicDifficultyAdjustmentOutput = z.infer<typeof DynamicDifficultyAdjustmentOutputSchema>;

export async function dynamicDifficultyAdjustment(input: DynamicDifficultyAdjustmentInput): Promise<DynamicDifficultyAdjustmentOutput> {
  return dynamicDifficultyAdjustmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicDifficultyAdjustmentPrompt',
  input: {schema: DynamicDifficultyAdjustmentInputSchema},
  output: {schema: DynamicDifficultyAdjustmentOutputSchema},
  prompt: `You are an AI game designer assistant for a hypercasual block-stacking game called StackUp Frenzy. Your goal is to dynamically adjust minor gameplay parameters to keep the experience fresh and engaging for the player, without making the difficulty too easy or too hard. Make subtle adjustments based on the player's performance.

Here are the current player statistics and game parameters:
- Current Score: {{{currentScore}}}
- Perfect Drops (Combo): {{{perfectDrops}}}
- Missed Drops: {{{missedDrops}}}
- Game Duration (seconds): {{{gameDurationSeconds}}}
- Current Spin Speed Multiplier: {{{currentSpinSpeedMultiplier}}}
- Current Block Drop Interval Multiplier: {{{currentBlockDropIntervalMultiplier}}}

Analyze the player's performance. If the player is doing exceptionally well (high score, high perfect drops, low missed drops), subtly increase the challenge by increasing spin speed or decreasing block drop interval. If the player is struggling (low score, high missed drops), subtly decrease the challenge. If performance is moderate, maintain or make very minor adjustments to keep it fresh.

Ensure that adjustments are always subtle. For example, if the current multiplier is 1.0, a subtle adjustment might be 1.02 or 0.98, not 1.5 or 0.5. Aim for changes within +/- 0.1 of the current multiplier, never going below 0.5 or above 2.0 for either multiplier.

Provide the new suggested 'spinSpeedMultiplier', 'blockDropIntervalMultiplier', and a 'reasoning' for your adjustments.
`,
});

const dynamicDifficultyAdjustmentFlow = ai.defineFlow(
  {
    name: 'dynamicDifficultyAdjustmentFlow',
    inputSchema: DynamicDifficultyAdjustmentInputSchema,
    outputSchema: DynamicDifficultyAdjustmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
