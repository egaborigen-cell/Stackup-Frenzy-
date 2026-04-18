
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
If you encounter the error `fatal: could not create work tree dir...`, ensure you are in a writable directory:

```bash
git clone <repository-url>
cd Stackup-Frenzy-
```

### 2. Configuration (Required)
The game uses Google Gemini for dynamic difficulty. You **must** provide an API key.
1. Create a `.env` file in the root directory (if it doesn't exist).
2. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Add it to your `.env`:
   ```env
   GOOGLE_GENAI_API_KEY=your_actual_key_here
   ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

## Troubleshooting

### `FAILED_PRECONDITION: Please pass in the API key`
This means the `GOOGLE_GENAI_API_KEY` is missing from your `.env` file or environment. Ensure the key is correctly set and that you have restarted the dev server after adding it.

### `npm error code 1` / `esbuild` error
If you encounter an error related to `esbuild` (e.g., `dyld: Symbol not found: _SecTrustCopyCertificateChain`):
- This often happens on older macOS versions (10.14 and below).
- **Fix**: Run this command to force a fresh, architecture-specific build:
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
   export GOOGLE_GENAI_API_KEY=your_key_here
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
