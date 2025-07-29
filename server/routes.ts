import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateScriptRequestSchema, type VideoScriptContent } from "@shared/schema";
import { generateVideoScript } from "./services/gemini";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate video script endpoint
  app.post("/api/generate-script", async (req, res) => {
    try {
      const data = generateScriptRequestSchema.parse(req.body);
      
      // Generate script using OpenAI
      const generatedContent = await generateVideoScript(data);
      
      // Save to storage
      const videoScript = await storage.createVideoScript({
        topic: data.topic,
        videoLength: data.videoLength,
        contentStyle: data.contentStyle,
        targetAudience: data.targetAudience,
        generatedContent,
      });

      res.json({
        id: videoScript.id,
        content: generatedContent,
      });
    } catch (error) {
      console.error("Error generating script:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      
      if (error instanceof Error && error.message.includes("API key")) {
        return res.status(401).json({ 
          message: "Gemini API key not configured. Please check your environment variables." 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to generate video script. Please try again." 
      });
    }
  });

  // Get video script by ID
  app.get("/api/video-scripts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const script = await storage.getVideoScript(id);
      
      if (!script) {
        return res.status(404).json({ message: "Video script not found" });
      }
      
      res.json(script);
    } catch (error) {
      console.error("Error fetching script:", error);
      res.status(500).json({ message: "Failed to fetch video script" });
    }
  });

  // Get recent video scripts
  app.get("/api/video-scripts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const scripts = await storage.getRecentVideoScripts(limit);
      res.json(scripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      res.status(500).json({ message: "Failed to fetch video scripts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
