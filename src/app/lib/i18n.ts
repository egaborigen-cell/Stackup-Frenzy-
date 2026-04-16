
export const translations = {
  en: {
    gameTitle: "STACKUP FRENZY",
    startButton: "START GAME",
    tapToDrop: "Tap to drop",
    score: "Score",
    best: "BEST",
    gameOver: "GAME OVER",
    retry: "RETRY",
    viewLeaderboard: "VIEW LEADERBOARD",
    leaderboard: "Leaderboard",
    globalHallOfFame: "GLOBAL HALL OF FAME",
    points: "Points",
    rank: "Rank",
    you: "YOU",
    backToGame: "Back to Game",
    noScores: "No scores yet. Be the first!",
    aiDesigner: "AI DESIGNER",
    instructions: "Tap to drop blocks and build the ultimate tower!"
  },
  ru: {
    gameTitle: "STACKUP FRENZY",
    startButton: "ИГРАТЬ",
    tapToDrop: "Нажми, чтобы бросить",
    score: "Счет",
    best: "РЕКОРД",
    gameOver: "ИГРА ОКОНЧЕНА",
    retry: "ПОВТОРИТЬ",
    viewLeaderboard: "ТАБЛИЦА ЛИДЕРОВ",
    leaderboard: "Лидеры",
    globalHallOfFame: "ЗАЛ СЛАВЫ",
    points: "Очков",
    rank: "Ранг",
    you: "ВЫ",
    backToGame: "Назад к игре",
    noScores: "Мест пока нет. Будь первым!",
    aiDesigner: "AI ДИЗАЙНЕР",
    instructions: "Нажимай, чтобы строить самую высокую башню!"
  }
};

export type TranslationKey = keyof typeof translations['en'];
