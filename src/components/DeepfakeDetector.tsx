import React, { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, Pause, Shield, AlertTriangle, CheckCircle2, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DetectionResult {
  isDeepfake: boolean;
  confidence: number;
  processingTime: number;
  details: {
    faceAnalysis: number;
    temporalConsistency: number;
    artifactDetection: number;
  };
}

export const DeepfakeDetector = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a video file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setProgress(0);
    
    // Create video URL for preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    toast({
      title: "Video Loaded",
      description: `Ready to analyze: ${file.name}`,
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const simulateMLProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate ML processing stages
    const stages = [
      { name: "Loading video frames", duration: 800 },
      { name: "Face detection & extraction", duration: 1200 },
      { name: "Temporal consistency analysis", duration: 1000 },
      { name: "Artifact detection", duration: 900 },
      { name: "Neural network inference", duration: 1100 },
      { name: "Final classification", duration: 600 }
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, stages[i].duration));
      setProgress(((i + 1) / stages.length) * 100);
    }

    // Simulate detection result
    const mockResult: DetectionResult = {
      isDeepfake: Math.random() > 0.6,
      confidence: 0.75 + Math.random() * 0.24,
      processingTime: 4.6,
      details: {
        faceAnalysis: 0.82 + Math.random() * 0.17,
        temporalConsistency: 0.78 + Math.random() * 0.21,
        artifactDetection: 0.73 + Math.random() * 0.26
      }
    };

    setResult(mockResult);
    setIsProcessing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Detection completed in ${mockResult.processingTime}s`,
      variant: mockResult.isDeepfake ? "destructive" : "default",
    });
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getResultBadge = () => {
    if (!result) return null;
    
    if (result.isDeepfake) {
      return (
        <Badge variant="destructive" className="text-lg px-4 py-2 shadow-glow-danger">
          <AlertTriangle className="w-5 h-5 mr-2" />
          DEEPFAKE DETECTED
        </Badge>
      );
    } else {
      return (
        <Badge className="text-lg px-4 py-2 bg-gradient-success text-success-foreground shadow-glow-success">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          AUTHENTIC VIDEO
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-primary">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Deepfake Detection Lab
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered forensic analysis to detect manipulated videos using cutting-edge neural networks
          </p>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300">
          <div
            className="p-8 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg inline-block">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
                  <p className="text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg inline-block">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upload Video for Analysis</h3>
                  <p className="text-muted-foreground">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supports: MP4, AVI, MOV, WebM
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Preview */}
          {videoUrl && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Video Preview
              </h3>
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full rounded-lg"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 left-4"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          )}

          {/* Analysis Panel */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analysis
            </h3>
            
            {!selectedFile ? (
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload a video to begin analysis</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={simulateMLProcessing}
                  disabled={isProcessing}
                  className="w-full bg-gradient-primary text-primary-foreground shadow-glow-primary hover:shadow-glow-primary/80"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start Detection
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Processing neural network inference... {Math.round(progress)}%
                    </p>
                  </div>
                )}

                {result && (
                  <div className="space-y-4 mt-6">
                    <div className="text-center">
                      {getResultBadge()}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className="text-lg font-bold">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <Progress 
                        value={result.confidence * 100} 
                        className={`h-3 ${result.isDeepfake ? 'bg-destructive/20' : 'bg-success/20'}`}
                      />
                      
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Face Analysis:</span>
                          <span>{(result.details.faceAnalysis * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temporal Consistency:</span>
                          <span>{(result.details.temporalConsistency * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Artifact Detection:</span>
                          <span>{(result.details.artifactDetection * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                        Analysis completed in {result.processingTime}s
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};