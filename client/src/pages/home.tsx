import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { generateScriptRequestSchema, type GenerateScriptRequest, type VideoScriptContent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Video, 
  Lightbulb, 
  ChevronRight, 
  WandSparkles, 
  Cog, 
  Heading,
  FileText,
  Film,
  Mic,
  Music,
  Download,
  Copy,
  Edit,
  Info,
  CheckCircle,
  PlayCircle,
  MicIcon,
  Settings,
  HelpCircle
} from "lucide-react";

export default function Home() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<VideoScriptContent | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateScriptRequest>({
    resolver: zodResolver(generateScriptRequestSchema),
    defaultValues: {
      topic: "",
      videoLength: "1-2 minutes",
      contentStyle: "Educational",
      targetAudience: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateScriptRequest) => {
      const response = await apiRequest("POST", "/api/generate-script", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Script Generated!",
        description: "Your video script has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateScriptRequest) => {
    generateMutation.mutate(data);
  };

  const copyToClipboard = async (text: string, sectionName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${sectionName} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exportJSON = () => {
    if (!generatedContent) return;
    
    const dataStr = JSON.stringify(generatedContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `video-script-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Video className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AI Video Creator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Video Script</CardTitle>
            <p className="text-gray-600">Enter a topic or short idea, and we'll generate a complete YouTube-style video script with scenes and production notes.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Topic Input */}
              <div>
                <Label htmlFor="topic" className="text-sm font-medium text-gray-700 mb-2 block">Video Topic</Label>
                <div className="relative">
                  <Input
                    id="topic"
                    placeholder="e.g., Benefits of Intermittent Fasting, How to Start a Business, Morning Routine Tips..."
                    {...form.register("topic")}
                    className="pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Lightbulb className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                {form.formState.errors.topic && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.topic.message}</p>
                )}
              </div>

              {/* Advanced Options */}
              <div className="border-t border-gray-100 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 p-0"
                >
                  <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  Advanced Options
                </Button>
                
                {showAdvanced && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Video Length</Label>
                        <Select
                          value={form.watch("videoLength")}
                          onValueChange={(value) => form.setValue("videoLength", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30-60 seconds">30-60 seconds</SelectItem>
                            <SelectItem value="1-2 minutes">1-2 minutes (Default)</SelectItem>
                            <SelectItem value="2-3 minutes">2-3 minutes</SelectItem>
                            <SelectItem value="3-5 minutes">3-5 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Content Style</Label>
                        <Select
                          value={form.watch("contentStyle")}
                          onValueChange={(value) => form.setValue("contentStyle", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Educational">Educational</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Tutorial">Tutorial</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Target Audience</Label>
                      <Input
                        placeholder="e.g., Young professionals, Fitness enthusiasts, Small business owners..."
                        {...form.register("targetAudience")}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={generateMutation.isPending}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {generateMutation.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <WandSparkles className="w-4 h-4 mr-2" />
                      <span>Generate Video Script</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {generateMutation.isPending && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
                  <Cog className="w-6 h-6 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Your Video Script</h3>
                <p className="text-gray-600 mb-6">Our AI is analyzing your topic and generating compelling content...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 animate-pulse" style={{width: '45%'}}></div>
                </div>
                <p className="text-sm text-gray-500">This usually takes 10-15 seconds</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {generatedContent && (
          <div className="space-y-6">
            {/* Title Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Heading className="w-5 h-5 text-primary mr-2" />
                    Video Title
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedContent.title, "Title")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">{generatedContent.title}</p>
                </div>
              </CardContent>
            </Card>

            {/* Script Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 text-primary mr-2" />
                    Video Script ({form.watch("videoLength")})
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(
                        `Hook: ${generatedContent.script.hook}\n\nIntroduction: ${generatedContent.script.introduction}\n\nMain Content: ${generatedContent.script.mainContent}\n\nCall to Action: ${generatedContent.script.callToAction}`,
                        "Script"
                      )}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-gray-900 mb-2">Hook (0-10 seconds):</p>
                    <p className="text-gray-700">{generatedContent.script.hook}</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <p className="font-medium text-gray-900 mb-2">Introduction (10-20 seconds):</p>
                    <p className="text-gray-700">{generatedContent.script.introduction}</p>
                  </div>
                  <div className="border-l-4 border-success pl-4">
                    <p className="font-medium text-gray-900 mb-2">Main Content (20-100 seconds):</p>
                    <p className="text-gray-700">{generatedContent.script.mainContent}</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-medium text-gray-900 mb-2">Call to Action (100-120 seconds):</p>
                    <p className="text-gray-700">{generatedContent.script.callToAction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visual Scenes Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Film className="w-5 h-5 text-primary mr-2" />
                    Scene-by-Scene Visuals
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      generatedContent.scenes.map(scene => 
                        `Scene ${scene.id}: ${scene.title} (${scene.timing})\n${scene.description}\nTags: ${scene.tags.join(', ')}`
                      ).join('\n\n'),
                      "Scenes"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedContent.scenes.map((scene) => (
                    <div key={scene.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {scene.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{scene.title} ({scene.timing})</h4>
                          <p className="text-gray-700 mb-3">{scene.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {scene.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voiceover Instructions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Mic className="w-5 h-5 text-primary mr-2" />
                    Voiceover Instructions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      JSON.stringify(generatedContent.voiceover, null, 2),
                      "Voiceover Instructions"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Voice Characteristics</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• {generatedContent.voiceover.characteristics.tone}</li>
                        <li>• {generatedContent.voiceover.characteristics.pace}</li>
                        <li>• {generatedContent.voiceover.characteristics.style}</li>
                        <li>• {generatedContent.voiceover.characteristics.enunciation}</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Technical Settings</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• {generatedContent.voiceover.technical.audioFormat}</li>
                        <li>• {generatedContent.voiceover.technical.noiseReduction ? 'Remove background noise' : 'Keep background noise'}</li>
                        <li>• {generatedContent.voiceover.technical.normalization}</li>
                        <li>• {generatedContent.voiceover.technical.pauses}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline mr-2" />
                      <strong>ElevenLabs Settings:</strong> Use "{generatedContent.voiceover.elevenLabsSettings.voiceStyle}" voice style with stability: {generatedContent.voiceover.elevenLabsSettings.stability}, clarity: {generatedContent.voiceover.elevenLabsSettings.clarity}, exaggeration: {generatedContent.voiceover.elevenLabsSettings.exaggeration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Music & Audio */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Music className="w-5 h-5 text-primary mr-2" />
                    Background Music & Audio
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(
                      JSON.stringify(generatedContent.music, null, 2),
                      "Music & Audio"
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Music Mood</h4>
                    <p className="text-gray-700 mb-3">
                      <strong>{generatedContent.music.mood}</strong> - {generatedContent.music.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {generatedContent.music.bpm}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Instrumental
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {generatedContent.music.genre}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Audio Levels</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Background music: {generatedContent.music.audioLevels.backgroundMusic}</li>
                        <li>• Voiceover: {generatedContent.music.audioLevels.voiceover}</li>
                        <li>• Sound effects: {generatedContent.music.audioLevels.soundEffects}</li>
                        <li>• {generatedContent.music.audioLevels.ducking ? 'Duck music during speech' : 'Keep consistent levels'}</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Suggested Tracks</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {generatedContent.music.suggestedTracks.map((track, index) => (
                          <li key={index}>• {track}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export & Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 text-primary mr-2" />
                    Export for AI Video Tools
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={exportJSON}>
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => copyToClipboard(
                        JSON.stringify(generatedContent, null, 2),
                        "Complete Script Package"
                      )}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Pika Labs</h4>
                      <p className="text-xs text-gray-600">Text-to-video generation</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <PlayCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">RunwayML</h4>
                      <p className="text-xs text-gray-600">AI video editing</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <MicIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">ElevenLabs</h4>
                      <p className="text-xs text-gray-600">Voice synthesis</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <Lightbulb className="w-4 h-4 inline mr-2" />
                      <strong>Pro Tip:</strong> Use the JSON export to directly integrate with your video automation workflow. Each section is properly formatted for API consumption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>© 2024 AI Video Creator Assistant. Built for content creators who want to scale their video production.</p>
        </footer>
      </div>
    </div>
  );
}
