# Sentiment Analysis Dashboard

A powerful social media monitoring tool that uses AI to analyze brand sentiment, track mentions, and provide actionable insights from customer feedback.

![Sentiment Analysis Dashboard Demo](./demo.png)

## ✨ Features

- **Multi-Platform Monitoring:** Track mentions from Twitter, Reddit, Facebook, and reviews
- **AI Sentiment Analysis:** Automatic sentiment classification using Google Gemini AI
- **Real-Time Dashboard:** Live sentiment scores and trend visualization
- **Topic Detection:** Identify common themes in customer feedback
- **Alert System:** Get notified of negative sentiment spikes
- **FastAPI Backend:** High-performance API with validation and error handling
- **Modern Frontend:** Built with Next.js 14, Tailwind CSS, and Recharts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- Chrome/Chromium browser (for web scraping)

### Backend Setup (Python)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8007
   ```

6. Run the server:
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8007`

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 API Documentation

### GET /

Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "message": "Sentiment API is running."
}
```

### POST /api/analyze

Analyze sentiment from reviews and social media mentions.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "url": "https://twitter.com/yourbrand"
  }
  ```

**Request Schema:**
```typescript
{
  url: string;  // Required, URL to analyze
}
```

**Response:**
```json
{
  "status": "success",
  "url": "https://twitter.com/yourbrand",
  "results": [
    {
      "text": "The automated features are life-saving! Highly recommend.",
      "analysis": {
        "sentiment": "Positive",
        "score": 9,
        "topics": ["features", "automation"]
      }
    }
  ],
  "summary": {
    "averageScore": 7.5,
    "totalReviews": 3
  }
}
```

### Example with cURL

```bash
curl -X POST http://localhost:8007/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://twitter.com/yourbrand"}'
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Google Gemini API** - AI sentiment analysis
- **TextBlob/NLTK** - Natural language processing
- **Selenium** - Web scraping
- **python-dotenv** - Environment variable management

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **Recharts** - Sentiment trend visualization

## 📁 Project Structure

```
sentiment-analysis-dashboard/
├── backend/
│   ├── main.py           # FastAPI application with validation
│   ├── analyzer.py       # Sentiment analysis logic
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # Environment variables template
├── frontend/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable React components
│   └── package.json
├── LICENSE
└── README.md
```

## 🔒 Security Notes

- API key validation on startup
- CORS is restricted to specific origins in production
- Robust JSON parsing from AI responses
- Proper error handling without exposing internal details
- Rate limiting recommended for production use

## 🎯 Use Cases

- **Brand Monitoring:** Track brand sentiment across platforms
- **Product Launches:** Monitor reception of new products
- **Customer Service:** Identify unhappy customers quickly
- **Market Research:** Analyze competitor sentiment
- **PR Management:** Crisis detection and response

## 🔄 Future Enhancements

- [ ] Real social media API integrations
- [ ] Historical sentiment tracking
- [ ] Competitor comparison
- [ ] Automated response suggestions
- [ ] Multi-language support
- [ ] Custom sentiment models
- [ ] Email/Slack alerts
- [ ] Export reports (PDF/CSV)

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Google Gemini API](https://ai.google.dev/)
- UI components from [Lucide Icons](https://lucide.dev/)
