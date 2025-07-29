import { type VideoScript, type InsertVideoScript } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getVideoScript(id: string): Promise<VideoScript | undefined>;
  createVideoScript(script: InsertVideoScript): Promise<VideoScript>;
  getRecentVideoScripts(limit?: number): Promise<VideoScript[]>;
}

export class MemStorage implements IStorage {
  private videoScripts: Map<string, VideoScript>;

  constructor() {
    this.videoScripts = new Map();
  }

  async getVideoScript(id: string): Promise<VideoScript | undefined> {
    return this.videoScripts.get(id);
  }

  async createVideoScript(insertScript: InsertVideoScript): Promise<VideoScript> {
    const id = randomUUID();
    const script: VideoScript = { 
      ...insertScript,
      videoLength: insertScript.videoLength || "1-2 minutes",
      contentStyle: insertScript.contentStyle || "Educational",
      targetAudience: insertScript.targetAudience || null,
      generatedContent: insertScript.generatedContent || null,
      id,
      createdAt: new Date()
    };
    this.videoScripts.set(id, script);
    return script;
  }

  async getRecentVideoScripts(limit: number = 10): Promise<VideoScript[]> {
    return Array.from(this.videoScripts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
