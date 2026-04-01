from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
import google.generativeai as genai
import os
import json
import time
import re

app = FastAPI(title="Sentiment Analysis API")

# Restrict CORS to specific origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# Validate API key on startup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required. Please set it in your .env file.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class AnalysisRequest(BaseModel):
    url: str = Field(..., description="URL to analyze for sentiment")

@app.get("/")
async def root():
    return {"status": "online", "message": "Sentiment API is running."}

@app.post("/api/analyze")
async def start_analysis(request: AnalysisRequest):
    """
    Analyze sentiment from reviews and social media mentions.
    Note: This is a demo implementation. For production, integrate with actual scraping services.
    """
    try:
        print(f"Analyzing sentiment for: {request.url}")

        # Simulated reviews for analysis
        reviews = [
            "The automated features are life-saving! Highly recommend.",
            "Interface is a bit clunky, but the data accuracy is top-notch.",
            "Extremely disappointed with the customer service response times."
        ]

        results = []
        for r in reviews:
            prompt = f"Analyze sentiment of: '{r}'. Return JSON: {{'sentiment': 'Positive/Neutral/Negative', 'score': 1-10, 'topics': []}}"
            response = model.generate_content(prompt)
            # Robust JSON extraction from AI response
            raw_text = response.text.strip()
            json_match = re.search(r'\{[^}]+\}', raw_text, re.DOTALL)
            if json_match:
                raw_text = json_match.group()
            raw_text = raw_text.replace('```json', '').replace('```', '').strip()
            
            try:
                analysis_data = json.loads(raw_text)
            except json.JSONDecodeError:
                analysis_data = {"sentiment": "Neutral", "score": 5, "topics": []}
            
            results.append({
                "text": r,
                "analysis": analysis_data
            })

        return {
            "status": "success",
            "url": request.url,
            "results": results,
            "summary": {
                "averageScore": sum(r["analysis"].get("score", 5) for r in results) / len(results),
                "totalReviews": len(results)
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze sentiment: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
