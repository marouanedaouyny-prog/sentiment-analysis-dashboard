# Sentiment Analysis Dashboard

An AI-powered tool that scrapes customer reviews from product pages and uses Gemini AI to visualize customer feedback sentiment, top topics, and weekly trends.

## Features
- **Review Scraper:** Automated extraction of reviews from major platforms (mocked).
- **AI Sentiment Analysis:** Uses Gemini AI to categorize reviews as Positive, Neutral, or Negative.
- **Topic Extraction:** Automatically identifies key keywords and topics mentioned in feedback.
- **Visual Analytics:** Interactive pie and line charts for sentiment breakdown and trend analysis.
- **Strategy Insights:** AI-generated business strategy suggestions based on sentiment shifts.

## Setup

### Backend (Python)
1. Go to `backend/`
2. Install dependencies: `pip install fastapi uvicorn google-generativeai pydantic python-dotenv`
3. Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.
4. Run the server: `python main.py` (Runs on port 8007)

### Scraper (Python - Standalone)
1. Go to `scraper/`
2. Install dependencies: `pip install selenium google-generativeai python-dotenv`
3. Run `python sentiment_engine.py` (Requires Chrome and ChromeDriver)

### Dashboard (Next.js)
1. Go to `dashboard/`
2. Run `npm install`
3. Run `npm run dev`

## Tech Stack
- **Backend:** Python, FastAPI, Gemini 1.5 Flash
- **Scraper:** Python, Selenium
- **Frontend:** Next.js, Tailwind CSS, Lucide React, Recharts
