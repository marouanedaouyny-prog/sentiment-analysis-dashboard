import os
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class SentimentScraper:
    """A professional engine for scraping reviews and analyzing sentiment with AI."""
    def __init__(self, headless=True):
        self.options = Options()
        if headless: self.options.add_argument("--headless")
        self.options.add_argument("--window-size=1920,1080")
        self.driver = webdriver.Chrome(options=self.options)
        
        # Initialize Gemini
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def analyze_sentiment(self, text):
        """Analyze text sentiment and extract topics using Gemini AI."""
        prompt = f"""
        Analyze the sentiment of this customer review:
        ---
        Review: "{text}"
        ---
        Return a JSON object with:
        1. "sentiment": "Positive", "Neutral", or "Negative"
        2. "score": A value from 1 to 10 (10 being most positive)
        3. "topics": List of top 3 keywords (e.g., "customer service", "pricing", "quality")
        """
        try:
            response = self.model.generate_content(prompt)
            # Simple clean up in case of markdown wrapping
            raw_text = response.text.strip().replace('```json', '').replace('```', '')
            return json.loads(raw_text)
        except Exception as e:
            return {"sentiment": "Neutral", "score": 5, "topics": ["Unknown"], "error": str(e)}

    def scrape_and_analyze(self, url):
        """Mock logic for scraping and analyzing reviews from a product page."""
        print(f"Scraping Reviews: {url}")
        self.driver.get(url)
        
        # Generic logic for demo
        try:
            time.sleep(2)
            mock_reviews = [
                "The product quality is amazing! Best purchase of the year.",
                "Terrible customer support, waited 3 days for a reply.",
                "It's okay for the price, but the shipping was slow.",
            ]
            
            results = []
            for review in mock_reviews:
                analysis = self.analyze_sentiment(review)
                results.append({
                    "text": review,
                    **analysis
                })
            return results
        except Exception as e:
            return {"error": str(e)}

    def close(self):
        self.driver.quit()

if __name__ == "__main__":
    scraper = SentimentScraper()
    # Using a placeholder URL
    data = scraper.scrape_and_analyze("https://www.trustpilot.com/review/example.com")
    print(json.dumps(data, indent=2))
    scraper.close()
