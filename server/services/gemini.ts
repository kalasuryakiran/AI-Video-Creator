import { GoogleGenAI } from "@google/genai";
import { type GenerateScriptRequest, type VideoScriptContent } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateVideoScript(request: GenerateScriptRequest): Promise<VideoScriptContent> {
  try {
    const prompt = `You are an expert YouTube video script writer and content strategist. Generate a complete video script package for the following topic: "${request.topic}"

Requirements:
- Video Length: ${request.videoLength}
- Content Style: ${request.contentStyle}
- Target Audience: ${request.targetAudience || "General audience"}

Create a comprehensive video script package that includes:

1. **Title**: An engaging, click-worthy YouTube title (50-60 characters)

2. **Script Structure** (timing based on ${request.videoLength}):
   - Hook (0-10 seconds): Attention-grabbing opening
   - Introduction (10-20 seconds): Personal connection and context
   - Main Content (20-90% of video): Core information broken into digestible segments
   - Call to Action (final 10-20 seconds): Engagement and subscription request

3. **Scene-by-Scene Visuals**: For each script section, provide:
   - Scene number and timing
   - Detailed visual description
   - Shot types and camera angles
   - Visual elements (graphics, text overlays, etc.)
   - Relevant tags for video production

4. **Voiceover Instructions**:
   - Voice characteristics (tone, pace, style)
   - Technical audio settings
   - ElevenLabs specific settings

5. **Background Music & Audio**:
   - Music mood and style
   - BPM and genre recommendations
   - Audio level specifications
   - Suggested track names

Respond ONLY with valid JSON in this exact structure:
{
  "title": "string",
  "script": {
    "hook": "string",
    "introduction": "string", 
    "mainContent": "string",
    "callToAction": "string"
  },
  "scenes": [
    {
      "id": 1,
      "title": "string",
      "timing": "string",
      "description": "string",
      "tags": ["string"]
    }
  ],
  "voiceover": {
    "characteristics": {
      "tone": "string",
      "pace": "string",
      "style": "string",
      "enunciation": "string"
    },
    "technical": {
      "audioFormat": "string",
      "noiseReduction": true,
      "normalization": "string",
      "pauses": "string"
    },
    "elevenLabsSettings": {
      "voiceStyle": "string",
      "stability": 0.75,
      "clarity": 0.85,
      "exaggeration": 0.6
    }
  },
  "music": {
    "mood": "string",
    "description": "string",
    "bpm": "string",
    "genre": "string",
    "audioLevels": {
      "backgroundMusic": "string",
      "voiceover": "string", 
      "soundEffects": "string",
      "ducking": true
    },
    "suggestedTracks": ["string"]
  }
}

Make the content engaging, professional, and optimized for YouTube success. Ensure all timings add up to the requested video length.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: "You are an expert YouTube content creator and script writer. You specialize in creating engaging, high-converting video scripts with detailed production guidance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            script: {
              type: "object",
              properties: {
                hook: { type: "string" },
                introduction: { type: "string" },
                mainContent: { type: "string" },
                callToAction: { type: "string" }
              },
              required: ["hook", "introduction", "mainContent", "callToAction"]
            },
            scenes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  title: { type: "string" },
                  timing: { type: "string" },
                  description: { type: "string" },
                  tags: { type: "array", items: { type: "string" } }
                },
                required: ["id", "title", "timing", "description", "tags"]
              }
            },
            voiceover: {
              type: "object",
              properties: {
                characteristics: {
                  type: "object",
                  properties: {
                    tone: { type: "string" },
                    pace: { type: "string" },
                    style: { type: "string" },
                    enunciation: { type: "string" }
                  },
                  required: ["tone", "pace", "style", "enunciation"]
                },
                technical: {
                  type: "object",
                  properties: {
                    audioFormat: { type: "string" },
                    noiseReduction: { type: "boolean" },
                    normalization: { type: "string" },
                    pauses: { type: "string" }
                  },
                  required: ["audioFormat", "noiseReduction", "normalization", "pauses"]
                },
                elevenLabsSettings: {
                  type: "object",
                  properties: {
                    voiceStyle: { type: "string" },
                    stability: { type: "number" },
                    clarity: { type: "number" },
                    exaggeration: { type: "number" }
                  },
                  required: ["voiceStyle", "stability", "clarity", "exaggeration"]
                }
              },
              required: ["characteristics", "technical", "elevenLabsSettings"]
            },
            music: {
              type: "object",
              properties: {
                mood: { type: "string" },
                description: { type: "string" },
                bpm: { type: "string" },
                genre: { type: "string" },
                audioLevels: {
                  type: "object",
                  properties: {
                    backgroundMusic: { type: "string" },
                    voiceover: { type: "string" },
                    soundEffects: { type: "string" },
                    ducking: { type: "boolean" }
                  },
                  required: ["backgroundMusic", "voiceover", "soundEffects", "ducking"]
                },
                suggestedTracks: { type: "array", items: { type: "string" } }
              },
              required: ["mood", "description", "bpm", "genre", "audioLevels", "suggestedTracks"]
            }
          },
          required: ["title", "script", "scenes", "voiceover", "music"]
        }
      },
      contents: prompt,
    });

    const content = response.text;
    if (!content) {
      throw new Error("No content generated from Gemini");
    }

    const parsedContent = JSON.parse(content) as VideoScriptContent;
    
    // Validate the structure
    if (!parsedContent.title || !parsedContent.script || !parsedContent.scenes) {
      throw new Error("Invalid content structure from Gemini");
    }

    return parsedContent;
  } catch (error) {
    console.error("Gemini generation error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Gemini API key not configured");
      }
      if (error.message.includes("quota") || error.message.includes("billing")) {
        throw new Error("Gemini API quota exceeded. Please check your billing.");
      }
      if (error.message.includes("rate limit")) {
        throw new Error("Gemini API rate limit exceeded. Please try again in a moment.");
      }
    }
    
    throw new Error("Failed to generate video script. Please try again.");
  }
}
