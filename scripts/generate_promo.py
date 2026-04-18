
import os
import json
import google.generativeai as genai
from PIL import Image, ImageDraw, ImageFont

# Configuration
PROJECT_NAME = "StackUp Frenzy"
PRIMARY_COLOR = (250, 124, 51)  # #FA7C33
SECONDARY_COLOR = (250, 114, 187) # #FA72BB
TEXT_COLOR = (255, 255, 255)

def setup_ai():
    api_key = os.environ.get("GOOGLE_GENAI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_GENAI_API_KEY environment variable not set.")
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

def generate_marketing_copy(model):
    print("--- Generating AI Marketing Copy ---")
    prompt = f"""
    Write promotional metadata for a hypercasual block-stacking game called '{PROJECT_NAME}'.
    The game features isometric stacking, dynamic difficulty, and high-energy gameplay.
    
    Requirements:
    1. Poki (English): Fun, catchy description focusing on 'instant play'.
    2. Yandex Games (English & Russian): Professional but exciting. Include short and long descriptions.
    
    Output the result as a raw JSON object with keys: 'poki_en', 'yandex_en', 'yandex_ru'.
    Each object should contain 'title', 'short_description', 'long_description', and 'keywords'.
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3].strip()
        return json.loads(text)
    except Exception as e:
        print(f"AI Generation failed: {e}")
        return None

def create_graphic(name, size, bg_color, text):
    print(f"--- Creating Graphic: {name} ({size[0]}x{size[1]}) ---")
    img = Image.new('RGB', size, color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Simple branding: A "block" icon and text
    margin = 40
    draw.rectangle([margin, margin, size[0]-margin, size[1]-margin], outline=SECONDARY_COLOR, width=10)
    
    # Text placement (centered)
    # Using default font since we can't guarantee custom fonts in this environment
    try:
        # Drawing a simple placeholder for the logo
        center = (size[0] // 2, size[1] // 2)
        box_size = min(size) // 4
        draw.rectangle([center[0]-box_size, center[1]-box_size, center[0]+box_size, center[1]+box_size], fill=SECONDARY_COLOR)
        draw.text((20, 20), text, fill=TEXT_COLOR)
    except Exception as e:
        print(f"Graphic text drawing failed: {e}")
        
    os.makedirs('promo_assets', exist_ok=True)
    img.save(f'promo_assets/{name}.png')

def main():
    model = setup_ai()
    if not model:
        return

    # 1. Generate Copy
    copy = generate_marketing_copy(model)
    if copy:
        with open('promo_assets/metadata.json', 'w', encoding='utf-8') as f:
            json.dump(copy, f, indent=2, ensure_ascii=False)
        print("Metadata saved to promo_assets/metadata.json")

    # 2. Generate Graphics
    # Yandex Requirements
    create_graphic("yandex_icon_512", (512, 512), PRIMARY_COLOR, PROJECT_NAME)
    create_graphic("yandex_cover_1200x630", (1200, 630), PRIMARY_COLOR, f"{PROJECT_NAME}\nPlay Now!")
    
    # Poki Requirements
    create_graphic("poki_icon_512", (512, 512), SECONDARY_COLOR, PROJECT_NAME)
    create_graphic("poki_promo_1200x630", (1200, 630), SECONDARY_COLOR, f"FREE ON POKI: {PROJECT_NAME}")

    print("\nSuccess! Check the 'promo_assets' folder for your materials.")

if __name__ == "__main__":
    main()
