export interface Block {
  x: number;
  z: number;
  width: number;
  depth: number;
  y: number;
  color: string;
}

export interface GameState {
  blocks: Block[];
  currentBlock: Block;
  score: number;
  highScore: number;
  combo: number;
  isGameOver: boolean;
  isStarted: boolean;
  spinAngle: number;
  direction: 'x' | 'z';
  moveSign: 1 | -1;
  lastDifficultyUpdateScore: number;
}

export const INITIAL_BLOCK_SIZE = 160;
export const BLOCK_HEIGHT = 40;
export const INITIAL_Y = 0;
export const MOVE_LIMIT = 300;

export const COLORS = [
  '#FA7C33', // Primary Orange
  '#FA72BB', // Accent Pink
  '#FF9F67',
  '#FF85B3',
  '#FFC18E',
  '#FFA1D4',
];

export function getBlockColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export function createInitialState(highScore: number = 0): GameState {
  const baseBlock: Block = {
    x: 0,
    z: 0,
    width: INITIAL_BLOCK_SIZE,
    depth: INITIAL_BLOCK_SIZE,
    y: INITIAL_Y,
    color: '#DDD',
  };

  return {
    blocks: [baseBlock],
    currentBlock: {
      x: 0,
      z: 0,
      width: INITIAL_BLOCK_SIZE,
      depth: INITIAL_BLOCK_SIZE,
      y: INITIAL_Y + BLOCK_HEIGHT,
      color: getBlockColor(1),
    },
    score: 0,
    highScore,
    combo: 0,
    isGameOver: false,
    isStarted: false,
    spinAngle: 0,
    direction: 'x',
    moveSign: 1,
    lastDifficultyUpdateScore: 0,
  };
}
