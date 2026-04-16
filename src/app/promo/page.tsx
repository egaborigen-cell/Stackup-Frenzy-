"use client";

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon, Video, Download, Loader2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { generatePromo, type PromoInput } from '@/ai/flows/generate-promo-flow';
import Link from 'next/link';

export const maxDuration = 120; // Allow 2 minutes for video generation

export default function PromoStudio() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url?: string; type: 'video' | 'image'; error?: string } | null>(null);
  const [config, setConfig] = useState<PromoInput>({
    style: 'cinematic',
    materialType: 'image',
    platform: 'Poki',
  });

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await generatePromo(config);
      setResult(res);
    } catch (e: any) {
      setResult({ type: config.materialType, error: e.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  }

  function downloadResult() {
    if (!result?.url) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `stackup-promo-${config.style}-${Date.now()}.${result.type === 'image' ? 'png' : 'mp4'}`;
    link.click();
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Game
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="w-6 h-6" />
            <h1 className="text-2xl font-bold tracking-tight">Promo Studio</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle>Generator Settings</CardTitle>
              <CardDescription>AI-powered marketing assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select 
                  value={config.platform} 
                  onValueChange={(v) => setConfig({ ...config, platform: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poki">Poki</SelectItem>
                    <SelectItem value="Yandex Games">Yandex Games</SelectItem>
                    <SelectItem value="CrazyGames">CrazyGames</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asset Type</Label>
                <Select 
                  value={config.materialType} 
                  onValueChange={(v: any) => setConfig({ ...config, materialType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Marketing Banner (Puppeteer)</SelectItem>
                    <SelectItem value="video">Cinematic Trailer (Veo 3.0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Art Style</Label>
                <Select 
                  value={config.style} 
                  onValueChange={(v: any) => setConfig({ ...config, style: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic 3D</SelectItem>
                    <SelectItem value="cartoon">Cartoon / Fun</SelectItem>
                    <SelectItem value="neon">Neon Cyberpunk</SelectItem>
                    <SelectItem value="retro">Retro Arcade</SelectItem>
                    <SelectItem value="minimalist">Clean Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate} 
                className="w-full py-6 font-bold text-lg rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {config.materialType === 'video' ? 'Generating Video (60s)...' : 'Capturing Viewport...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Promo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 min-h-[400px] flex flex-col shadow-xl overflow-hidden border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-sm flex items-center gap-2">
                {config.materialType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                Live Preview
              </CardTitle>
            </CardHeader>
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
              {!result && !loading && (
                <div className="text-center space-y-4 opacity-40">
                  <Sparkles className="w-16 h-16 mx-auto" />
                  <p className="font-medium">Configure and click Generate to see magic</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center gap-4 text-primary animate-pulse">
                  <Loader2 className="w-12 h-12 animate-spin" />
                  <p className="font-bold">Gemini is designing your promo...</p>
                </div>
              )}

              {result?.error && (
                <div className="text-destructive text-center p-6 border-2 border-dashed border-destructive/20 rounded-xl">
                  <p className="font-bold mb-2">Generation Failed</p>
                  <p className="text-sm opacity-80">{result.error}</p>
                </div>
              )}

              {result?.url && !loading && (
                <div className="relative w-full h-full flex items-center justify-center animate-scale-in">
                  {result.type === 'image' ? (
                    <img 
                      src={result.url} 
                      alt="Promo Banner" 
                      className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
                    />
                  ) : (
                    <video 
                      src={result.url} 
                      controls 
                      autoPlay 
                      loop 
                      className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                  )}
                  
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute top-4 right-4 rounded-full shadow-lg"
                    onClick={downloadResult}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Screenshot Rendering
            </h4>
            <p className="text-xs text-muted-foreground">
              Using Puppeteer ensures pixel-perfect marketing banners at 1200x630 resolution.
            </p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
            <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
              <Video className="w-4 h-4" /> Cinematic Veo
            </h4>
            <p className="text-xs text-muted-foreground">
              Veo 3.0 generates realistic gameplay trailers with synchronized audio design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}