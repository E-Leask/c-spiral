/**
 * Daily Game State Engine & LocalStorage Manager
 */

import { getDailyPuzzle, prepareTileBank, validateSubmission, isSubmissionPerfect } from '../parser/spiralParser.js';

const STORAGE_KEY = 'c_spiral_state_v1';
const MAX_ATTEMPTS = 4;

export class DailyEngine {
  constructor(dateString = null) {
    this.dateString = dateString || new Date().toISOString().split('T')[0];
    this.puzzle = getDailyPuzzle(this.dateString);
    const { startTile, bankTiles } = prepareTileBank(this.puzzle, this.dateString);
    this.startTile = startTile;
    this.tileBank = bankTiles;
    this.state = this.loadState();
  }


  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultState();
      const parsed = JSON.parse(raw);
      
      // If new day, retain statistics but reset daily play state
      if (parsed.lastPlayedDate !== this.dateString) {
        return {
          ...parsed,
          lastPlayedDate: this.dateString,
          guesses: [],
          isCompleted: false,
          isWon: false
        };
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to read localStorage state:', e);
      return this.getDefaultState();
    }
  }

  getDefaultState() {
    return {
      lastPlayedDate: this.dateString,
      guesses: [], // Array of { tiles: string[], feedback: string[] }
      isCompleted: false,
      isWon: false,
      streakCurrent: 0,
      streakMax: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0 }
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  submitAttempt(selectedTiles) {
    if (this.state.isCompleted) {
      return { error: 'Game is already completed for today.' };
    }
    if (this.state.guesses.length >= MAX_ATTEMPTS) {
      return { error: 'Maximum attempts reached.' };
    }

    const tileTexts = selectedTiles.map(t => t.text);
    const feedback = validateSubmission(tileTexts, this.puzzle.targetSentence);
    const isWon = isSubmissionPerfect(tileTexts, this.puzzle.targetSentence);
    
    const attemptRecord = {
      tiles: tileTexts,
      feedback
    };

    this.state.guesses.push(attemptRecord);

    const attemptsCount = this.state.guesses.length;

    if (isWon) {
      this.state.isCompleted = true;
      this.state.isWon = true;
      this.state.gamesPlayed += 1;
      this.state.gamesWon += 1;
      this.state.streakCurrent += 1;
      if (this.state.streakCurrent > this.state.streakMax) {
        this.state.streakMax = this.state.streakCurrent;
      }
      this.state.guessDistribution[attemptsCount] = (this.state.guessDistribution[attemptsCount] || 0) + 1;
    } else if (attemptsCount >= MAX_ATTEMPTS) {
      this.state.isCompleted = true;
      this.state.isWon = false;
      this.state.gamesPlayed += 1;
      this.state.streakCurrent = 0; // Streak breaks on loss
    }

    this.saveState();

    return {
      feedback,
      isWon,
      isCompleted: this.state.isCompleted,
      attemptsLeft: MAX_ATTEMPTS - attemptsCount
    };
  }

  getShareText() {
    const puzzleNum = this.puzzle.puzzleNumber;
    const attempts = this.state.isWon ? this.state.guesses.length : 'X';
    let text = `C-Spiral #${puzzleNum} 🌀 ${attempts}/${MAX_ATTEMPTS}\n\n`;

    const emojiMap = {
      correct: '🟩',
      misplaced: '🟨',
      incorrect: '⬛'
    };

    this.state.guesses.forEach(g => {
      text += g.feedback.map(f => emojiMap[f] || '⬛').join('') + '\n';
    });

    text += '\nhttps://c-spiral.dev';
    return text;
  }
}
