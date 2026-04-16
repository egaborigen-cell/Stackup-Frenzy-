
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
import puppeteer from 'puppeteer';

const PromoInputSchema = z.object({
  style: z.enum(['cinematic', 'cartoon', 'neon', 'retro', 'minimalist']).describe('The artistic style of the promo.'),
  materialType: z.enum(['video', 'image']).describe('Whether to generate a trailer or a banner.'),
  platform: z.string().describe('The target platform (e.g., Poki, Yandex Games).'),
});

export type PromoInput = z.infer<typeof PromoInputSchema>;

export async function generatePromo(input: PromoInput) {
  return generatePromoFlow(input);
}

const bannerHtmlPrompt = ai.definePrompt({
  name: 'bannerHtmlPrompt',
  input: { schema: PromoInputSchema },
  output: { schema: z.object({ html: z.string() }) },
  prompt: `You are a world-class game marketing designer. Generate a high-fidelity, professional marketing banner for the game 'StackUp Frenzy' using HTML and Tailwind CSS.
  
  Game Theme: A hypercasual tower-stacking game where colorful blocks are dropped onto a spinning tower.
  Style: {{style}}
  Target Platform: {{platform}}
  Dimensions: 1200x630 (Standard Marketing Size)
  
  Guidelines:
  1. Use Tailwind CSS via the CDN: <script src="https://cdn.tailwindcss.com"></script>.
  2. Use Google Fonts (Poppins is the primary game font).
  3. Include the game title 'STACKUP FRENZY' in a bold, eye-catching way.
  4. Create a visual representation of the tower using CSS/SVG or styled div elements.
  5. Use a color palette consistent with the {{style}} aesthetic.
  6. Add a "PLAY NOW ON {{platform}}" call-to-action button.
  7. Ensure the design is clean, professional, and looks like a real App Store / Yandex Games banner.
  8. Return only the full HTML code.`,
});

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
    try {
      if (input.materialType === 'image') {
        // Step 1: Generate the layout with Gemini
        const { output } = await bannerHtmlPrompt(input);
        
        // Step 2: Render with Puppeteer
        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        
        try {
          const page = await browser.newPage();
          await page.setViewport({ width: 1200, height: 630 });
          await page.setContent(output!.html, { waitUntil: 'networkidle0' });
          
          const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' });
          return { 
            url: `data:image/png;base64,${screenshot}`, 
            type: 'image' 
          };
        } finally {
          await browser.close();
        }
      } else {
        // Video generation with Veo 3.0 (remains unchanged as it's the specific tool for video)
        const safetySettings: any = [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        ];

        let { operation } = await ai.generate({
          model: googleAI.model('veo-3.0-generate-preview'),
          prompt: `A dynamic, high-energy gameplay trailer for 'StackUp Frenzy'. Show a spinning tower where colorful glowing blocks are being dropped and perfectly stacked with satisfying particle effects. Use ${input.style} lighting. The camera pans around the growing tower. Professional sound design with upbeat game music and block-stacking sound effects. Optimized for ${input.platform} promo video.`,
          config: { safetySettings },
        });

        if (!operation) throw new Error('Expected the model to return an operation');

        let attempts = 0;
        const maxAttempts = 24; 
        while (!operation.done && attempts < maxAttempts) {
          operation = await ai.checkOperation(operation);
          if (!operation.done) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            attempts++;
          }
        }

        if (attempts >= maxAttempts) {
          return { type: 'video', error: 'Video generation timed out.' };
        }

        if (operation.error) {
          return { type: 'video', error: operation.error.message };
        }

        const videoPart = operation.output?.message?.content.find((p) => !!p.media);
        if (!videoPart || !videoPart.media) {
          return { type: 'video', error: 'Failed to find video content' };
        }

        const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
        const videoDownloadResponse = await fetch(`${videoPart.media.url}&key=${apiKey}`);
        
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
    } catch (err: any) {
      return { 
        type: input.materialType, 
        error: err.message || 'An error occurred during generation' 
      };
    }
  }
);
