
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

## Troubleshooting

### `npm error code 1` / `esbuild` error
If you encounter an error related to `esbuild` or `dyld: Symbol not found`:
- We have removed `genkit-cli` from the project dependencies to resolve this. 
- The AI features (Dynamic Difficulty) will still work in the application as they run as Server Actions.
- If you need to use the Genkit Developer UI, we recommend running it in a modern environment (macOS 10.15+ or Linux) or installing `genkit-cli` globally: `npm install -g genkit`.

### Clean Reinstall
If you still see errors, try clearing local artifacts:
```bash
rm -rf node_modules package-lock.json && npm install
```

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

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI SDK**: [Genkit](https://github.com/firebase/genkit)
- **Database/Auth**: Firebase Firestore & Firebase Auth
- **Portals**: Yandex Games SDK
