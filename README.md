
# StackUp Frenzy 🧱

StackUp Frenzy is a high-energy, hypercasual block-stacking game built with Next.js and optimized for web portals.

## Features

### 🎮 The Game
- **Isometric Stacking**: Precision-based gameplay where you stack moving blocks to build the tallest tower possible.
- **Dynamic Difficulty**: 
  - **Local Engine**: A built-in difficulty engine ensures balanced gameplay in static environments like Yandex Games or Poki.
- **Yandex Games Integration**: Fully optimized for the Yandex Games portal with leaderboard support.
- **Multilingual Support**: Available in English and Russian.

## Building for Web Portals

This project is configured for **Static Web Export**, which is required for platforms like **Yandex Games** or **Poki**.

### Static Web Export
- **Command**: `npm run build`
- **Output Folder**: `out` (This folder contains the static HTML/JS/CSS).
- **Hosting**: Upload the contents of the `out` folder to your game portal.

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

## Getting Started

### 1. Install & Run
```bash
npm install
npm run dev
```

### 2. Yandex SDK Integration
The game automatically detects the Yandex Games environment. Local development works without any additional setup.
