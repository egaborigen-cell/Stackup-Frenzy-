"use client";

import React from 'react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Trophy, X, Medal, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/LanguageContext';

interface LeaderboardProps {
  onClose: () => void;
  currentUserId?: string;
}

export default function Leaderboard({ onClose, currentUserId }: LeaderboardProps) {
  const { t } = useLanguage();
  const db = useFirestore();
  
  const leaderboardQuery = useMemoFirebase(() => 
    query(
      collection(db, 'playerProfiles'),
      orderBy('highScore', 'desc'),
      limit(10)
    ), [db]
  );

  const { data: players, isLoading } = useCollection(leaderboardQuery);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 fill-current" />
            <CardTitle className="text-xl font-bold tracking-tight uppercase">{t('globalHallOfFame')}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/20 text-white rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : players && players.length > 0 ? (
            <div className="divide-y">
              {players.map((player, index) => {
                const isMe = player.id === currentUserId;
                const isTop3 = index < 3;
                
                return (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-4 transition-colors ${isMe ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center font-black text-lg text-muted-foreground">
                        {isTop3 ? (
                          <Medal className={`w-6 h-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-amber-600'}`} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${isMe ? 'text-primary' : ''}`}>
                            {player.username || `Player ${player.id.slice(0, 4)}`}
                            {isMe && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 rounded uppercase font-black">{t('you')}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                            {t('rank')} {index + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-foreground">{player.highScore}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('points')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <p className="font-medium italic">{t('noScores')}</p>
            </div>
          )}
        </CardContent>
        <div className="p-4 bg-muted/30 border-t text-center">
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase italic">
            Powered by StackUp Frenzy AI Analytics
          </p>
        </div>
      </Card>
    </div>
  );
}
