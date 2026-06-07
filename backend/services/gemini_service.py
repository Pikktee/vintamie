import google.generativeai as genai
from PIL import Image
import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def analyze_item_image(image_path: str) -> dict:
    """
    Sends the image at image_path to the Gemini API to analyze it
    and returns a dictionary with title, description, category, condition, and price.
    """
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY is not set. Returning mock data.")
        return get_mock_analysis()

    try:
        # Load image
        img = Image.open(image_path)

        # Initialize Gemini model (using gemini-1.5-flash as it is fast and supports image understanding)
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = (
            "Du bist Vintamie, eine visionäre Verkaufs-Assistentin für Second-Hand-Plattformen wie Vinted und Kleinanzeigen.\n"
            "Analysiere das hochgeladene Foto eines Artikels und gib eine strukturierte JSON-Antwort mit folgenden Feldern auf Deutsch zurück:\n"
            "- 'title': Ein aussagekräftiger Titel (max. 80 Zeichen), optimiert für Vinted/Kleinanzeigen.\n"
            "- 'description': Eine freundliche, ehrliche und ansprechende Verkaufsbeschreibung. Nenne wichtige Details (wie Schnitt, Muster) und füge am Ende 3-4 relevante Hashtags hinzu.\n"
            "- 'category': Eine passende Hauptkategorie auf Deutsch (z.B. 'Damenbekleidung', 'Herrenbekleidung', 'Kinder', 'Haus & Garten', 'Elektronik', 'Bücher & Medien', 'Sonstiges').\n"
            "- 'condition': Eine Einschätzung des Zustands. Wähle exakt einen dieser Werte: 'Neu', 'Sehr gut', 'Gut', 'Zufriedenstellend'.\n"
            "- 'price': Ein realistischer, geschätzter Verkaufspreis in Euro als ganze Zahl (Integer), basierend auf dem typischen Second-Hand-Markt.\n\n"
            "Gib ausschließlich das JSON-Objekt zurück. Verwende kein Markdown-Formatting wie ```json."
        )

        generation_config = {
            "response_mime_type": "application/json",
        }

        response = model.generate_content(
            [img, prompt],
            generation_config=generation_config
        )

        # Parse the JSON response
        data = json.loads(response.text)
        
        # Validate keys and types
        validated_data = {
            "title": str(data.get("title", "Unbekannter Artikel")),
            "description": str(data.get("description", "Keine Beschreibung verfügbar.")),
            "category": str(data.get("category", "Sonstiges")),
            "condition": str(data.get("condition", "Gut")),
            "price": float(data.get("price", 10.0))
        }
        
        return validated_data

    except Exception as e:
        print(f"Error calling Gemini API: {e}. Returning mock fallback data.")
        return get_mock_analysis()

def get_mock_analysis() -> dict:
    """
    Fallback mock data if the API key is missing or calls fail.
    """
    return {
        "title": "Schwarzes Vintage T-Shirt",
        "description": "Sehr schönes schwarzes Vintage T-Shirt in gutem Zustand. Angenehmer Stoff, lässiger Schnitt. Perfekt für den Sommer!\n\n#vintage #tshirt #schwarz #retro",
        "category": "Damenbekleidung",
        "condition": "Sehr gut",
        "price": 15.0
    }
