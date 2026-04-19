
# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and powered by Google's latest Generative AI models via Genkit.

## Features

### 🎮 The Game
- **Isometric Stacking**: Precision-based gameplay where you stack moving blocks to build the tallest tower possible.
- **Dynamic Difficulty**: 
  - **Cloud Mode**: An AI Game Designer agent monitors performance and adjusts game parameters via Genkit Server Actions.
  - **Portal Mode**: A local difficulty engine ensures balanced gameplay in static environments like Yandex Games.
- **Global Leaderboard**: Compete with players worldwide via Firebase Firestore.
- **Multilingual Support**: Available in English and Russian.
- **Yandex Games Integration**: Fully optimized for the Yandex Games portal with leaderboard support.

## Building and Output Locations

Next.js has two build modes. The output location depends on which one you use:

### 1. Standard Production Build (SSR/Node.js)
This mode supports the full AI Game Designer features.
- **Setup**: Open `next.config.ts` and ensure `output: 'export'` is **NOT** set.
- **Command**: `npm run build`
- **Output Folder**: `.next`
- **Hosting**: Requires a Node.js environment (Vercel, Firebase App Hosting, etc.).

### 2. Static Web Export (for Portals)
Required for **Yandex Games** or **Poki**.
- **Setup**: Open `next.config.ts` and ensure `output: 'export'` is set.
- **Command**: `npm run build`
- **Output Folder**: `out` (This folder will only be created if `output: 'export'` is set).
- **Limitation**: The Genkit AI Designer is disabled in this mode because Static Export does not support Server Actions. The game automatically switches to a high-quality local difficulty engine.

## Developer Tools

### 🚀 Autonomous Promo Generator
We've included a Python script to help you generate all necessary marketing materials.

**Prerequisites:**
- Python 3.8+
- A Google AI API Key (set as `GOOGLE_GENAI_API_KEY`)

**Usage:**
1. Install dependencies:
   ```bash
   pip install -r scripts/requirements.txt
   ```
2. Run the generator:
   ```bash
   python scripts/generate_promo.py
   ```
This will create a `promo_assets` folder containing marketing materials.

## Troubleshooting

### `Server Actions are not supported with static export`
This occurs if you try to use `output: 'export'` while the frontend directly imports a file with `'use server'`. 
- **Fix**: The project has been refactored to use a Local Difficulty Engine when building for static portals. Ensure you do not import Genkit flows directly into client components if you intend to use static export.

### `dyld: Symbol not found: _SecTrustCopyCertificateChain`
Occurs on older macOS versions. 
- **Fix**: Perform a clean install: `rm -rf node_modules package-lock.json && npm install`.

## Getting Started

### 1. Configuration
The game uses Google Gemini for AI. Provide an API key in a `.env` file for Cloud Mode:
```env
GOOGLE_GENAI_API_KEY=your_actual_key_here
```

### 2. Install & Run
```bash
npm install
npm run dev
```
