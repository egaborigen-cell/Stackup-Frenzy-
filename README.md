# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and powered by Google's latest Generative AI models via Genkit.

## Features

### 🎮 The Game
- **Isometric Stacking**: Precision-based gameplay where you stack moving blocks to build the tallest tower possible.
- **Dynamic Difficulty**: An AI Game Designer agent monitors your performance in real-time and subtly adjusts game parameters (spin speed, drop intervals) to keep you in the "flow state".
- **Combo System**: Land perfect stacks to trigger high-score multipliers and visual effects.

### 🚀 AI Promo Studio
Generate professional marketing assets for platforms like **Yandex Games** and **Poki** directly from the app:
- **Marketing Banners**: Uses Gemini to design a custom HTML/Tailwind layout, which is then captured as a pixel-perfect PNG using **Puppeteer**.
- **Cinematic Trailers**: Leverages **Veo 3.0** to generate high-quality gameplay videos with synchronized audio design.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI SDK**: [Genkit](https://github.com/firebase/genkit)
- **AI Models**: Gemini 2.5 Flash, Veo 3.0 (Video)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database/Auth**: Firebase Firestore & Firebase Auth
- **Automation**: Puppeteer (for banner rendering)

## Getting Started

### Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the Genkit UI to inspect AI flows:
   ```bash
   npm run genkit:dev
   ```

### Deployment
This app is designed to be hosted on **Firebase App Hosting**. 
Note: Video generation (Veo) requires a longer timeout (configured in `src/app/promo/page.tsx` as `maxDuration = 120`).

## Environment Variables
Ensure the following are set in your environment:
- `GOOGLE_GENAI_API_KEY`: For Genkit AI features.
