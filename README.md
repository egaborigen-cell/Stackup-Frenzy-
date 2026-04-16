
# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and powered by Google's latest Generative AI models via Genkit.

## Features

### 🎮 The Game
- **Isometric Stacking**: Precision-based gameplay where you stack moving blocks to build the tallest tower possible.
- **Dynamic Difficulty**: An AI Game Designer agent monitors your performance in real-time and subtly adjusts game parameters (spin speed, drop intervals) to keep you in the "flow state".
- **Combo System**: Land perfect stacks to trigger high-score multipliers and visual effects.
- **Global Leaderboard**: Compete with players worldwide. Scores are saved automatically to Firebase Firestore.
- **Multilingual Support**: Available in English and Russian.
- **Yandex Games Integration**: Fully optimized for the Yandex Games portal.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI SDK**: [Genkit](https://github.com/firebase/genkit)
- **AI Models**: Gemini 2.5 Flash
- **Styling**: Tailwind CSS + ShadCN UI
- **Database/Auth**: Firebase Firestore & Firebase Auth

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
This app can be deployed to any modern hosting provider (Vercel, Netlify, etc.). 
