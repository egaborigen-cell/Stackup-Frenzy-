
# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and powered by Google's latest Generative AI models via Genkit.

## Features

### 🎮 The Game
- **Isometric Stacking**: Precision-based gameplay where you stack moving blocks to build the tallest tower possible.
- **Dynamic Difficulty**: An AI Game Designer agent monitors your performance in real-time and subtly adjusts game parameters.
- **Global Leaderboard**: Compete with players worldwide via Firebase Firestore.
- **Multilingual Support**: Available in English and Russian.
- **Yandex Games Integration**: Fully optimized for the Yandex Games portal.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Run Genkit (AI Services)**:
   ```bash
   npm run genkit:dev
   ```

## Troubleshooting

### `npm error code 1` / `esbuild` error
If you encounter an error related to `node_modules/esbuild` during installation:
1. Delete your local modules and lockfile: `rm -rf node_modules package-lock.json`
2. Run `npm install` again.
This forces `esbuild` to download the correct binary for your specific OS architecture (e.g., Apple Silicon vs Intel).

### `dyld: Symbol not found: _SecTrustCopyCertificateChain`
This error occurs when the `esbuild` binary is incompatible with your version of macOS (usually macOS 10.14 or older).
- **Fix 1**: Update your macOS to 10.15 (Catalina) or newer.
- **Fix 2**: If you are on a modern macOS, run:
  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```
  This clears any incorrect binaries that might have been cached or pulled from a different environment.

## Promo Generation (Python Utility)

We provide a Python utility to help you create store assets for Poki and Yandex Games.

### Usage
1. Ensure you have Python installed.
2. Install dependencies:
   ```bash
   pip install -r scripts/requirements.txt
   ```
3. Set your API Key:
   ```bash
   export GEMINI_API_KEY=your_key_here
   ```
4. Run the script:
   ```bash
   python scripts/generate_promo.py
   ```

This will generate SEO metadata and basic banners in the `promo_assets/` directory.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI SDK**: [Genkit](https://github.com/firebase/genkit)
- **Database/Auth**: Firebase Firestore & Firebase Auth
- **Portals**: Yandex Games SDK
