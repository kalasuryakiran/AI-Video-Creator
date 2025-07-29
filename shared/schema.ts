import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videoScripts = pgTable("video_scripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(),
  videoLength: text("video_length").default("1-2 minutes"),
  contentStyle: text("content_style").default("Educational"),
  targetAudience: text("target_audience"),
  generatedContent: jsonb("generated_content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVideoScriptSchema = createInsertSchema(videoScripts).omit({
  id: true,
  createdAt: true,
});

export const generateScriptRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  videoLength: z.string().default("1-2 minutes"),
  contentStyle: z.string().default("Educational"),
  targetAudience: z.string().optional(),
});

export type InsertVideoScript = z.infer<typeof insertVideoScriptSchema>;
export type VideoScript = typeof videoScripts.$inferSelect;
export type GenerateScriptRequest = z.infer<typeof generateScriptRequestSchema>;

export interface VideoScriptContent {
  title: string;
  script: {
    hook: string;
    introduction: string;
    mainContent: string;
    callToAction: string;
  };
  scenes: Array<{
    id: number;
    title: string;
    timing: string;
    description: string;
    tags: string[];
  }>;
  voiceover: {
    characteristics: {
      tone: string;
      pace: string;
      style: string;
      enunciation: string;
    };
    technical: {
      audioFormat: string;
      noiseReduction: boolean;
      normalization: string;
      pauses: string;
    };
    elevenLabsSettings: {
      voiceStyle: string;
      stability: number;
      clarity: number;
      exaggeration: number;
    };
  };
  music: {
    mood: string;
    description: string;
    bpm: string;
    genre: string;
    audioLevels: {
      backgroundMusic: string;
      voiceover: string;
      soundEffects: string;
      ducking: boolean;
    };
    suggestedTracks: string[];
  };
}
