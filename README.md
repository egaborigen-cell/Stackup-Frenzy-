
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

### 1. Cloning the Repository
If you encounter the error `fatal: could not create work tree dir...`, it usually means you are trying to clone into a directory that doesn't exist or where you lack write permissions. Try cloning directly into your current folder:

```bash
git clone <repository-url>
cd Stackup-Frenzy-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

## Troubleshooting

### `npm error code 1` / `esbuild` error
If you encounter an error related to `esbuild` (e.g., `dyld: Symbol not found: _SecTrustCopyCertificateChain`):
- This often happens on older macOS versions (10.14 and below).
- **Fix**: We have removed `genkit-cli` from the project dependencies to minimize these binary issues.
- **Clean Reinstall**: Run this command to force a fresh, architecture-specific build:
  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```

### Git: `could not create work tree dir`
- Ensure you are not inside a protected system folder.
- Check that the destination folder name doesn't contain illegal characters for your OS.
- Run `pwd` to check your current path and ensure it's a location you can write to (like `/Users/yourname/Projects`).

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
