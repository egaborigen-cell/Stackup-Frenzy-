
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

This project uses **Genkit** as its primary Generative AI framework. 

1. **Server-Side Intelligence**: Genkit runs on the server (Node.js) to securely handle AI prompts and API keys.
2. **Type Safety**: It uses Zod to ensure the AI's "thoughts" (like difficulty adjustments) always follow a strict schema.
3. **Firebase Integration**: Built for seamless connection with Firestore for leaderboards.

### Static Export Note ⚠️
If you use `output: 'export'` for a **Static Web Export** (e.g., for uploading a .zip to Yandex Games):
- The static files **do not** include Genkit (it is stripped out of the client bundle).
- **Server Actions will not work.** The AI Game Designer will be disabled unless you host the AI flows as a separate API.
- For the full experience, host on a platform that supports Next.js Server Actions (Vercel, Firebase App Hosting, etc.).

## Getting Started

### 1. Cloning the Repository
If you encounter permission errors, ensure you are in a writable directory:
```bash
git clone <repository-url>
cd Stackup-Frenzy-
```

### 2. Configuration (Required)
The game uses Google Gemini. You **must** provide an API key in a `.env` file:
```env
GOOGLE_GENAI_API_KEY=your_actual_key_here
```
Get a key from [Google AI Studio](https://a Studio.google.com/app/apikey).

### 3. Install & Run
```bash
npm install
npm run dev
```

## Troubleshooting

### `dyld: Symbol not found: _SecTrustCopyCertificateChain`
This means you are on an older macOS (10.14 or below). 
- **Fix**: We have removed the `genkit-cli` dependency to resolve this. Perform a clean install:
  ```bash
  rm -rf node_modules package-lock.json && npm install
  ```

### `FAILED_PRECONDITION: Please pass in the API key`
Ensure your `GOOGLE_GENAI_API_KEY` is correctly set in `.env` and restart the server.
