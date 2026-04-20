
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Zap, ListOrdered, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  GameState, 
  Block, 
  createInitialState, 
  BLOCK_HEIGHT, 
  MOVE_LIMIT, 
  getBlockColor 
} from '@/app/lib/game-engine';
import { useLanguage } from '@/components/LanguageContext';
import { useYandexGames } from '@/components/YandexGamesContext';

const DESIGNER_QUOTES = [
  "Observation: Your timing is impeccable. Increasing difficulty.",
  "Analysis: Speeding up the tower to test your reflexes.",
  "Data: Perfect drops detected. Accelerating block movement.",
  "Strategic Update: Enhancing spin velocity for maximum challenge.",
  "Performance Note: You're in the zone. Let's see how you handle this speed.",
];

export default function StackUpFrenzy() {
  const { t, language, setLanguage } = useLanguage();
  const { ysdk, isInitialized } = useYandexGames();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [perfectDrops, setPerfectDrops] = useState(0);
  const [missedDrops, setMissedDrops] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [difficulty, setDifficulty] = useState({
    spinSpeedMultiplier: 1.0,
    movementSpeedMultiplier: 1.0,
  });
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('stackup-frenzy-highscore');
    if (saved) {
      const parsed = parseInt(saved, 10);
      setHighScore(parsed);
      setGameState(createInitialState(parsed));
    } else {
      setGameState(createInitialState(0));
    }
  }, []);

  useEffect(() => {
    if (isInitialized && ysdk && gameState) {
      if (ysdk.features && ysdk.features.LoadingAPI) {
        ysdk.features.LoadingAPI.ready();
      }
    }
  }, [isInitialized, ysdk, !!gameState]);

  const triggerLocalDifficultyUpdate = useCallback((state: GameState) => {
    const scoreFactor = Math.floor(state.score / 5);
    const newSpinMultiplier = Math.min(2.5, 1.0 + (scoreFactor * 0.1));
    const newMoveMultiplier = Math.min(2.0, 1.0 + (scoreFactor * 0.07));

    setDifficulty({
      spinSpeedMultiplier: newSpinMultiplier,
      movementSpeedMultiplier: newMoveMultiplier,
    });

    const quote = DESIGNER_QUOTES[scoreFactor % DESIGNER_QUOTES.length];
    setAiReasoning(quote);
    setTimeout(() => setAiReasoning(null), 4000);
  }, []);

  const saveHighScoreToYandex = useCallback((score: number) => {
    if (ysdk && ysdk.leaderboards) {
      ysdk.leaderboards.setLeaderboardScore('leaderboard', score)
        .catch((err: any) => {
          console.error('Yandex Leaderboard Error:', err);
        });
    }
  }, [ysdk]);

  const restartGame = useCallback(() => {
    const newState = createInitialState(highScore);
    setGameState(newState);
    setPerfectDrops(0);
    setMissedDrops(0);
    setStartTime(Date.now());
    setDifficulty({ spinSpeedMultiplier: 1.0, movementSpeedMultiplier: 1.0 });
    setAiReasoning(null);
  }, [highScore]);

  const handleAction = useCallback(() => {
    if (!gameState) return;

    if (!gameState.isStarted) {
      setGameState(prev => prev ? { ...prev, isStarted: true } : null);
      setStartTime(Date.now());
      return;
    }

    if (gameState.isGameOver) {
      restartGame();
      return;
    }

    const top = gameState.blocks[gameState.blocks.length - 1];
    const current = gameState.currentBlock;

    let overlapWidth = current.width;
    let overlapDepth = current.depth;
    let newX = current.x;
    let newZ = current.z;

    const diffX = Math.abs(current.x - top.x);
    const diffZ = Math.abs(current.z - top.z);

    const TOLERANCE = 10;
    let isPerfect = false;

    if (gameState.direction === 'x') {
      overlapWidth = current.width - diffX;
      if (overlapWidth <= 0) {
        setGameState(prev => {
          if (!prev) return null;
          const endState = { ...prev, isGameOver: true };
          saveHighScoreToYandex(prev.score);
          return endState;
        });
        return;
      }
      newX = (current.x + top.x) / 2;
      if (diffX < TOLERANCE) {
        isPerfect = true;
        newX = top.x;
        overlapWidth = top.width;
      }
    } else {
      overlapDepth = current.depth - diffZ;
      if (overlapDepth <= 0) {
        setGameState(prev => {
          if (!prev) return null;
          const endState = { ...prev, isGameOver: true };
          saveHighScoreToYandex(prev.score);
          return endState;
        });
        return;
      }
      newZ = (current.z + top.z) / 2;
      if (diffZ < TOLERANCE) {
        isPerfect = true;
        newZ = top.z;
        overlapDepth = top.depth;
      }
    }

    const newScore = gameState.score + 1;
    const newCombo = isPerfect ? gameState.combo + 1 : 0;
    const finalHighScore = Math.max(highScore, newScore);

    if (finalHighScore > highScore) {
      setHighScore(finalHighScore);
      localStorage.setItem('stackup-frenzy-highscore', finalHighScore.toString());
    }

    if (isPerfect) setPerfectDrops(prev => prev + 1);
    else setMissedDrops(prev => prev + 1);

    const nextDirection = gameState.direction === 'x' ? 'z' : 'x';
    const nextBlock: Block = {
      x: nextDirection === 'x' ? -MOVE_LIMIT : newX,
      z: nextDirection === 'z' ? -MOVE_LIMIT : newZ,
      width: overlapWidth,
      depth: overlapDepth,
      y: (gameState.blocks.length + 1) * BLOCK_HEIGHT,
      color: getBlockColor(gameState.blocks.length + 1),
    };

    const updatedState: GameState = {
      ...gameState,
      blocks: [...gameState.blocks, { ...current, x: newX, z: newZ, width: overlapWidth, depth: overlapDepth }],
      currentBlock: nextBlock,
      score: newScore,
      highScore: finalHighScore,
      combo: newCombo,
      direction: nextDirection,
      moveSign: 1,
    };

    setGameState(updatedState);

    if (newScore > 0 && newScore % 5 === 0) {
      triggerLocalDifficultyUpdate(updatedState);
    }
  }, [gameState, highScore, restartGame, triggerLocalDifficultyUpdate, saveHighScoreToYandex]);

  const update = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setGameState(prev => {
      if (!prev || !prev.isStarted || prev.isGameOver) return prev;

      const speed = (0.2 + (prev.score * 0.01)) * deltaTime * difficulty.movementSpeedMultiplier;
      const spinSpeed = (0.001 + (prev.score * 0.0001)) * deltaTime * difficulty.spinSpeedMultiplier;

      let nextX = prev.currentBlock.x;
      let nextZ = prev.currentBlock.z;
      let nextMoveSign = prev.moveSign;

      if (prev.direction === 'x') {
        nextX += speed * prev.moveSign;
        if (Math.abs(nextX) > MOVE_LIMIT) nextMoveSign = prev.moveSign === 1 ? -1 : 1;
      } else {
        nextZ += speed * prev.moveSign;
        if (Math.abs(nextZ) > MOVE_LIMIT) nextMoveSign = prev.moveSign === 1 ? -1 : 1;
      }

      return {
        ...prev,
        spinAngle: prev.spinAngle + spinSpeed,
        moveSign: nextMoveSign,
        currentBlock: {
          ...prev.currentBlock,
          x: nextX,
          z: nextZ,
        },
      };
    });

    requestRef.current = requestAnimationFrame(update);
  }, [difficulty]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  useEffect(() => {
    if (!canvasRef.current || !gameState) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.7;
      const cameraY = Math.max(0, (gameState.blocks.length - 5) * BLOCK_HEIGHT);
      
      const project = (x: number, y: number, z: number) => {
        const angle = gameState.spinAngle;
        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const rz = x * Math.sin(angle) + z * Math.cos(angle);
        return {
          px: centerX + rx - rz,
          py: centerY - (y - cameraY) - (rx + rz) * 0.5,
          depth: rz // Return depth for sorting
        };
      };

      const shadeColor = (col: string, amt: number) => {
        const num = parseInt(col.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amt));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
      };

      const drawBlock = (block: Block) => {
        const { x, z, width, depth, y, color } = block;
        
        // Define 8 vertices of the block
        const v = [
          project(x - width/2, y, z - depth/2), // 0: bottom-back-left
          project(x + width/2, y, z - depth/2), // 1: bottom-back-right
          project(x + width/2, y, z + depth/2), // 2: bottom-front-right
          project(x - width/2, y, z + depth/2), // 3: bottom-front-left
          project(x - width/2, y + BLOCK_HEIGHT, z - depth/2), // 4: top-back-left
          project(x + width/2, y + BLOCK_HEIGHT, z - depth/2), // 5: top-back-right
          project(x + width/2, y + BLOCK_HEIGHT, z + depth/2), // 6: top-front-right
          project(x - width/2, y + BLOCK_HEIGHT, z + depth/2), // 7: top-front-left
        ];

        // Define 6 faces and their vertex indices
        // Order: Bottom, Back, Right, Front, Left, Top
        const faces = [
          { indices: [0, 1, 2, 3], color: shadeColor(color, -60) }, // Bottom
          { indices: [0, 1, 5, 4], color: shadeColor(color, -20) }, // Back
          { indices: [1, 2, 6, 5], color: shadeColor(color, -10) }, // Right
          { indices: [2, 3, 7, 6], color: shadeColor(color, -20) }, // Front
          { indices: [3, 0, 4, 7], color: shadeColor(color, -40) }, // Left
          { indices: [4, 5, 6, 7], color: color },                 // Top
        ];

        // Painter's algorithm: Sort faces by average depth
        faces.sort((a, b) => {
          const depthA = a.indices.reduce((sum, idx) => sum + v[idx].depth, 0) / 4;
          const depthB = b.indices.reduce((sum, idx) => sum + v[idx].depth, 0) / 4;
          return depthA - depthB; // Back-to-front
        });

        faces.forEach(face => {
          ctx.beginPath();
          ctx.moveTo(v[face.indices[0]].px, v[face.indices[0]].py);
          for (let i = 1; i < face.indices.length; i++) {
            ctx.lineTo(v[face.indices[i]].px, v[face.indices[i]].py);
          }
          ctx.closePath();
          ctx.fillStyle = face.color;
          ctx.fill();
          
          // Subtle border for definition
          ctx.strokeStyle = 'rgba(0,0,0,0.05)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      };

      gameState.blocks.forEach((b, i) => {
        if (i > gameState.blocks.length - 20) {
          drawBlock(b);
        }
      });

      if (gameState.isStarted && !gameState.isGameOver) {
        drawBlock(gameState.currentBlock);
      }
    };

    draw();
    return () => window.removeEventListener('resize', resize);
  }, [gameState]);

  const showLeaderboard = () => {
    if (ysdk && ysdk.leaderboards) {
      ysdk.leaderboards.showLeaderboard();
    }
  };

  if (!gameState) return null;

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-background flex flex-col items-center justify-center game-canvas-container"
      onClick={handleAction}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute top-12 left-0 w-full px-8 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-primary font-bold text-5xl drop-shadow-sm">{gameState.score}</span>
          <div className="flex items-center gap-2 text-muted-foreground font-semibold">
            <Trophy className="w-4 h-4" />
            <span>{gameState.highScore}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {gameState.combo > 1 && (
            <div className="bg-secondary text-white px-4 py-2 rounded-full font-bold animate-bounce shadow-lg flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 fill-current" />
              COMBO X{gameState.combo}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10 rounded-full h-10 w-10 shrink-0"
              onClick={(e) => { e.stopPropagation(); setLanguage(language === 'en' ? 'ru' : 'en'); }}
            >
              <Languages className="w-4 h-4 text-primary" />
            </Button>
            {isInitialized && ysdk && ysdk.leaderboards && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10 rounded-full h-10 px-4"
                onClick={(e) => { e.stopPropagation(); showLeaderboard(); }}
              >
                <ListOrdered className="w-4 h-4 mr-2 text-primary" />
                {t('leaderboard')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {aiReasoning && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-sm z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-4 bg-primary/10 border-primary/20 backdrop-blur-md shadow-xl flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-primary/80 leading-relaxed italic">
              {t('aiDesigner')}: "{aiReasoning}"
            </p>
          </Card>
        </div>
      )}

      {!gameState.isStarted && !gameState.isGameOver && (
        <div className="absolute inset-0 z-30 bg-background/40 backdrop-blur-sm flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="text-center space-y-6">
            <div className="space-y-2 animate-float">
              <h1 className="text-5xl font-extrabold text-primary tracking-tight">STACKUP</h1>
              <h2 className="text-5xl font-extrabold text-secondary tracking-tight">FRENZY</h2>
            </div>
            <p className="text-muted-foreground font-medium max-w-[200px] mx-auto">{t('instructions')}</p>
            <Button 
              size="lg" 
              className="rounded-full px-12 py-8 text-xl font-bold shadow-2xl hover:scale-105 transition-transform bg-primary"
            >
              <Play className="w-6 h-6 mr-2 fill-current" />
              {t('startButton')}
            </Button>
          </div>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in zoom-in duration-300">
          <Card className="w-full max-sm p-8 text-center space-y-8 shadow-2xl border-none">
            <div className="space-y-2">
              <h3 className="text-muted-foreground font-bold tracking-widest uppercase text-sm">{t('gameOver')}</h3>
              <p className="text-6xl font-black text-primary">{gameState.score}</p>
            </div>

            <div className="bg-muted p-4 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-bold text-muted-foreground">{t('best')}</span>
              </div>
              <span className="text-2xl font-black">{gameState.highScore}</span>
            </div>

            <Button 
              onClick={(e) => { e.stopPropagation(); restartGame(); }}
              className="w-full rounded-full py-8 text-xl font-bold shadow-xl bg-secondary hover:bg-secondary/90"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              {t('retry')}
            </Button>
            
            {isInitialized && ysdk && ysdk.leaderboards && (
              <Button 
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); showLeaderboard(); }}
                className="w-full text-muted-foreground font-bold h-12 hover:bg-muted/50"
              >
                {t('viewLeaderboard')}
              </Button>
            )}
          </Card>
        </div>
      )}

      {gameState.isStarted && !gameState.isGameOver && gameState.score < 2 && (
        <div className="absolute bottom-24 left-0 w-full text-center animate-pulse pointer-events-none">
          <p className="text-muted-foreground font-semibold text-lg uppercase tracking-widest">{t('tapToDrop')}</p>
        </div>
      )}
    </div>
  );
}
