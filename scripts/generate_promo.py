
import os
import json
from PIL import Image, ImageDraw, ImageFont
import google.generativeai as genai

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY")
GAME_NAME = "StackUp Frenzy"
GAME_DESCRIPTION = "A high-energy, hypercasual isometric block-stacking game."

# Setup Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_marketing_text(platform="Yandex Games"):
    """Generates SEO-optimized titles and descriptions."""
    prompt = f"""
    Generate professional marketing materials for a game called '{GAME_NAME}'.
    Context: {GAME_DESCRIPTION}
    Target Platform: {platform}
    
    Provide:
    1. Short Title (max 30 chars)
    2. Long Title (max 100 chars)
    3. Short Description (max 140 chars)
    4. Full Description (engaging, highlights features)
    5. List of 10 SEO Keywords
    
    Format the output as JSON.
    """
    response = model.generate_content(prompt)
    return response.text

def create_banner(width, height, output_name, text, primary_color="#FA7C33"):
    """Creates a basic marketing banner with text."""
    # Create background
    img = Image.new('RGB', (width, height), color=primary_color)
    draw = ImageDraw.Draw(img)
    
    # Draw simple "blocks" representating the game
    for i in range(5):
        y = height - (i * 40) - 100
        draw.rectangle([width//2 - 100, y, width//2 + 100, y + 35], outline="white", width=2)

    # Add text (using default font as placeholder)
    try:
        # Note: In a real environment, you'd specify a .ttf file path
        # font = ImageFont.truetype("arial.ttf", 60)
        draw.text((width//2 - 200, 50), text, fill="white")
    except:
        draw.text((width//2 - 100, 50), text, fill="white")

    img.save(f"promo_assets/{output_name}")
    print(f"Generated: {output_name}")

def main():
    if not os.path.exists('promo_assets'):
        os.makedirs('promo_assets')

    print(f"--- Generating materials for {GAME_NAME} ---")
    
    # 1. Generate Metadata
    try:
        yandex_meta = generate_marketing_text("Yandex Games")
        with open("promo_assets/yandex_metadata.json", "w") as f:
            f.write(yandex_meta)
        print("Metadata generated in promo_assets/yandex_metadata.json")
    except Exception as e:
        print(f"AI Text Generation failed: {e}")

    # 2. Generate Graphics (Banners)
    create_banner(1200, 630, "poki_banner.png", "STACKUP FRENZY - PLAY NOW")
    create_banner(512, 512, "yandex_icon.png", "SF")
    create_banner(960, 600, "yandex_cover.png", "STACKUP FRENZY")

    print("\nNext steps:")
    print("1. Use the JSON metadata for your store listings.")
    print("2. Video generation is best done via Veo 3.0 or dedicated AI video APIs.")
    print("3. Check 'promo_assets' folder for generated images.")

if __name__ == "__main__":
    main()
