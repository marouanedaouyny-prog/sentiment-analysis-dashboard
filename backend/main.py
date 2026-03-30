from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import time

app = FastAPI(title="Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    url: str

@app.get("/")
async def root():
    return {"status": "online", "message": "Sentiment API is running."}

@app.post("/api/analyze")
async def start_analysis(request: AnalysisRequest):
    """
    In a real-world scenario, this would trigger the SentimentScraper class.
    For the portfolio, we'll return the AI-analyzed sentiment data.
    """
    print(f"Analyzing sentiment for: {request.url}")
    
    # Configure Gemini
    apiKey = os.getenv("GEMINI_API_KEY")
    if not apiKey:
        return {"status": "error", "message": "GEMINI_API_KEY not configured."}
    
    genai.configure(api_key=apiKey)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Simulated reviews for analysis
    reviews = [
        "The automated features are life-saving! Highly recommend.",
        "Interface is a bit clunky, but the data accuracy is top-notch.",
        "Extremely disappointed with the customer service response times."
    ]
    
    try:
        results = []
        for r in reviews:
            prompt = f"Analyze sentiment of: '{r}'. Return JSON: {{'sentiment': 'Positive/Neutral/Negative', 'score': 1-10, 'topics': []}}"
            response = model.generate_content(prompt)
            raw_text = response.text.strip().replace('```json', '').replace('```', '')
            results.append({
                "text": r,
                "analysis": json.loads(raw_text)
            })
        
        return {
            "status": "success",
            "url": request.url,
            "results": results,
            "summary": {
                "averageScore": sum(r["analysis"]["score"] for r in results) / len(results),
                "totalReviews": len(results)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)
