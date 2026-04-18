
# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and powered by Google's latest Generative AI models via Genkit.

## Features

### 🎮 The Game
- **Isometric Stacking**: Precision-based gameplay where you stack moving blocks to build the tallest tower possible.
- **Dynamic Difficulty**: An AI Game Designer agent monitors your performance in real-time and subtly adjusts game parameters.
- **Global Leaderboard**: Compete with players worldwide via Firebase Firestore.
- **Multilingual Support**: Available in English and Russian.
- **Yandex Games Integration**: Fully optimized for the Yandex Games portal.

## Tech Stack Choice: Why Genkit?

This project uses **Genkit** as its primary Generative AI framework. While alternatives like the Vercel AI SDK or LangChain exist, Genkit was chosen for several key reasons:

1. **Firebase Integration**: Genkit is built by the Firebase team, ensuring smooth integration with our Firestore leaderboards and Authentication.
2. **Type Safety**: It uses Zod to ensure the AI's "thoughts" (like difficulty adjustments) always follow a strict schema, preventing game-breaking logic.
3. **Optimized for Gemini**: It provides the most direct and efficient path to using Google's Gemini 2.5 Flash models.
4. **Lightweight Core**: After refactoring, we use only the library core, avoiding complex system dependencies like `esbuild` that can cause issues on older hardware.

## Getting Started

### 1. Cloning the Repository
If you encounter the error `fatal: could not create work tree dir...`, ensure you are in a writable directory:

```bash
git clone <repository-url>
cd Stackup-Frenzy-
```

### 2. Configuration (Required)
The game uses Google Gemini for dynamic difficulty. You **must** provide an API key.

#### Method A: Using a .env file (Recommended for Local Dev)
1. Create a `.env` file in the root directory.
2. Get an API key from [Google AI Studio](https://astudio.google.com/app/apikey).
3. Add it to your `.env`:
   ```env
   GOOGLE_GENAI_API_KEY=your_actual_key_here
   ```

#### Method B: System Environment Variables
Useful for temporary sessions:
```bash
export GOOGLE_GENAI_API_KEY=your_actual_key_here
npm run dev
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
This means the `GOOGLE_GENAI_API_KEY` is missing. Ensure the key is correctly set in your `.env` or system environment and restart the dev server.

### `dyld: Symbol not found: _SecTrustCopyCertificateChain`
This usually means you are on an older macOS (10.14 or below). 
- **Fix**: We have removed the `genkit-cli` dependency to resolve this. Ensure you perform a clean install:
  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```
