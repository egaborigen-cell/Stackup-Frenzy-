"use client";

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon, Video, Download, Loader2, Rocket, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { generatePromo, type PromoInput } from '@/ai/flows/generate-promo-flow';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export const maxDuration = 120;

export default function PromoStudio() {
  const { t, language, setLanguage } = useLanguage();
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
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> {t('backToGame')}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            >
              <Languages className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="w-6 h-6" />
            <h1 className="text-2xl font-bold tracking-tight">{t('promoStudio')}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle>{t('generatorSettings')}</CardTitle>
              <CardDescription>{t('promoDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('platform')}</Label>
                <Select 
                  value={config.platform} 
                  onValueChange={(v) => setConfig({ ...config, platform: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poki">{t('platformPoki')}</SelectItem>
                    <SelectItem value="Yandex Games">{t('platformYandex')}</SelectItem>
                    <SelectItem value="CrazyGames">{t('platformCrazy')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('assetType')}</Label>
                <Select 
                  value={config.materialType} 
                  onValueChange={(v: any) => setConfig({ ...config, materialType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">{t('assetImage')}</SelectItem>
                    <SelectItem value="video">{t('assetVideo')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('artStyle')}</Label>
                <Select 
                  value={config.style} 
                  onValueChange={(v: any) => setConfig({ ...config, style: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">{t('styleCinematic')}</SelectItem>
                    <SelectItem value="cartoon">{t('styleCartoon')}</SelectItem>
                    <SelectItem value="neon">{t('styleNeon')}</SelectItem>
                    <SelectItem value="retro">{t('styleRetro')}</SelectItem>
                    <SelectItem value="minimalist">{t('styleMinimalist')}</SelectItem>
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
                    {config.materialType === 'video' ? t('generatingVideo') : t('renderingBanner')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('generatePromo')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 min-h-[400px] flex flex-col shadow-xl overflow-hidden border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-sm flex items-center gap-2">
                {config.materialType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                {t('livePreview')}
              </CardTitle>
            </CardHeader>
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
              {!result && !loading && (
                <div className="text-center space-y-4 opacity-40">
                  <Sparkles className="w-16 h-16 mx-auto" />
                  <p className="font-medium">{t('magicMessage')}</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center gap-4 text-primary animate-pulse">
                  <Loader2 className="w-12 h-12 animate-spin" />
                  <p className="font-bold">{t('designingPromo')}</p>
                </div>
              )}

              {result?.error && (
                <div className="text-destructive text-center p-6 border-2 border-dashed border-destructive/20 rounded-xl">
                  <p className="font-bold mb-2">{t('generationFailed')}</p>
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
      </div>
    </div>
  );
}
