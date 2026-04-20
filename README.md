
# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and optimized for web portals like Yandex Games and Poki.

## Difficulty Engine Design 🧠

The game features a **Local Difficulty Engine** designed to maintain a perfect "Flow State" by dynamically adjusting gameplay physics based on player progress.

### How it Works:
- **Milestone-Based Scaling**: Every 5 blocks placed, the engine evaluates performance.
- **Velocity (Movement Speed)**: Increases by **7%** per milestone to test reflexes.
- **Entropy (Tower Spin)**: The isometric rotation accelerates by **10%** per milestone, increasing spatial disorientation.
- **Safety Rails**: Multipliers are capped (Spin at 2.5x, Movement at 2.0x) to ensure the game remains challenging but fair.
- **Narrative Feedback**: The "AI Designer" provides real-time commentary, turning mathematical scaling into an engaging narrative experience.

## Building for Web Portals

This project is optimized for **Static Web Export**, required for platforms like **Yandex Games** or **Poki**.

### Deployment Steps:
1. **Static Build**:
   ```bash
   npm run build
   ```
2. **Output**: The production-ready files will be in the `out` folder.
3. **Portal Upload**: Zip the contents of `out` and upload to your developer console.

## Configuration ⚙️

### Google AI Integration
The game uses Google Gemini (via Genkit) for server-side analytics and marketing generation.
- Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- Add it to your `.env` file:
  ```env
  GOOGLE_GENAI_API_KEY=your_actual_key_here
  ```

## Developer Tools 🚀

### Autonomous Promo Generator
Generate all marketing materials (Icons, Covers, SEO metadata) automatically:
1. Set your `GOOGLE_GENAI_API_KEY`.
2. Run the generator:
   ```bash
   python scripts/generate_promo.py
   ```
This creates a `promo_assets` folder with everything needed for Poki and Yandex Games.

## Getting Started

1. **Install Dependencies**: `npm install`
2. **Development**: `npm run dev`
3. **Portal Preview**: `npm run build` then host the `out` directory.
