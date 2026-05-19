import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Recommendations logic with retry mechanism
  app.post("/api/recommendations", async (req, res) => {
    const { preferences, history } = req.body;
    
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;

    const fallbacks = [
      { name: "Avocado Toast", description: "Smashed avocado, radish, and red pepper flakes on sourdough.", cuisine: "Healthy", price: 12.50, emoji: "🥑" },
      { name: "Spicy Ramen", description: "Rich miso broth with pork belly and marinated soft-boiled egg.", cuisine: "Asian", price: 16.00, emoji: "🍜" },
      { name: "Truffle Fries", description: "Crispy fries tossed in white truffle oil and parmesan cheese.", cuisine: "Sides", price: 8.50, emoji: "🍟" }
    ];

    while (retryCount < maxRetries) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Based on the following food preferences: ${preferences} and order history: ${history}, recommend 3 specific dishes from a diverse menu (Burgers, Italian, Asian, Healthy). Return in JSON format.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  emoji: { type: Type.STRING }
                },
                required: ["name", "description", "cuisine", "price", "emoji"]
              }
            }
          }
        });
        
        return res.json(JSON.parse(response.text));
      } catch (error: any) {
        lastError = error;
        
        // Check for Quota Exceeded specifically (not just rate limit)
        const isQuotaExceeded = error.message?.includes("Quota exceeded") || 
                                error.message?.includes("quotaId");
        
        const isRetryable = (error.message?.includes("429") || error.message?.includes("503") || 
                            error.status === 429 || error.status === 503) && !isQuotaExceeded;
        
        if (isRetryable && retryCount < maxRetries - 1) {
          const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
          console.log(`Gemini rate limit hit, retrying ${retryCount + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
          continue;
        }
        
        // If it's a quota error, don't even bother retrying if we know it's the daily one
        if (isQuotaExceeded) {
          console.warn("Gemini Quota Exceeded. Using premium fallbacks.");
          return res.json(fallbacks);
        }
        
        break;
      }
    }

    if (lastError) {
      console.error("Gemini failed after retries or non-retryable error:", lastError.message || lastError);
    }
    res.json(fallbacks);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
