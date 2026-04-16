
'use server';
/**
 * @fileOverview An AI agent that generates promotional materials for the game.
 *
 * - generatePromo - A function that generates promo images or videos.
 * - PromoInput - The input type for the generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const PromoInputSchema = z.object({
  style: z.enum(['cinematic', 'cartoon', 'neon', 'retro', 'minimalist']).describe('The artistic style of the promo.'),
  materialType: z.enum(['video', 'image']).describe('Whether to generate a trailer or a banner.'),
  platform: z.string().describe('The target platform (e.g., Poki, Yandex Games).'),
});

export type PromoInput = z.infer<typeof PromoInputSchema>;

export async function generatePromo(input: PromoInput) {
  return generatePromoFlow(input);
}

const generatePromoFlow = ai.defineFlow(
  {
    name: 'generatePromoFlow',
    inputSchema: PromoInputSchema,
    outputSchema: z.object({
      url: z.string().optional(),
      type: z.enum(['video', 'image']),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    if (input.materialType === 'image') {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `High-end professional 3D marketing banner for a game called 'StackUp Frenzy'. The visual features a beautiful tower of vibrant, colorful isometric blocks stacking high into a clear sky. Professional game lighting, ${input.style} aesthetic. Designed specifically for a ${input.platform} game storefront. No UI text, just pure high-quality game art.`,
      });
      
      if (!media) return { type: 'image', error: 'Failed to generate image' };
      return { url: media.url, type: 'image' };
    } else {
      // Video generation with Veo 3.0 (includes sound)
      let { operation } = await ai.generate({
        model: googleAI.model('veo-3.0-generate-preview'),
        prompt: `A dynamic, high-energy gameplay trailer for 'StackUp Frenzy'. Show a spinning tower where colorful glowing blocks are being dropped and perfectly stacked with satisfying particle effects. Use ${input.style} lighting. The camera pans around the growing tower. Professional sound design with upbeat game music and block-stacking sound effects. Optimized for ${input.platform} promo video.`,
      });

      if (!operation) throw new Error('Expected the model to return an operation');

      // Poll for completion (video generation can take 30-60s)
      while (!operation.done) {
        operation = await ai.checkOperation(operation);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      if (operation.error) {
        return { type: 'video', error: operation.error.message };
      }

      const videoPart = operation.output?.message?.content.find((p) => !!p.media);
      if (!videoPart || !videoPart.media) {
        return { type: 'video', error: 'Failed to find the generated video content' };
      }

      // Download and convert to data URI for simple client-side handling
      const fetch = (await import('node-fetch')).default;
      const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY}`
      );
      
      if (!videoDownloadResponse.ok) {
        return { type: 'video', error: 'Failed to fetch video data' };
      }

      const buffer = await videoDownloadResponse.arrayBuffer();
      const base64Video = Buffer.from(buffer).toString('base64');
      
      return { 
        url: `data:video/mp4;base64,${base64Video}`, 
        type: 'video' 
      };
    }
  }
);
