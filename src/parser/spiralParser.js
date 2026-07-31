/**
 * Core Spiral Rule Parser Engine & Validation Helpers
 */

import { DECLARATIONS } from '../data/declarations.js';

/**
 * Deterministic PRNG based on Mulberry32 for daily seed hashing
 */
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Simple string hash for date YYYY-MM-DD
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets daily puzzle derived from UTC date string 'YYYY-MM-DD'
 */
export function getDailyPuzzle(dateString = null) {
  if (!dateString) {
    const now = new Date();
    dateString = now.toISOString().split('T')[0];
  }
  const seed = hashString(dateString);
  const rng = mulberry32(seed);
  const index = Math.floor(rng() * DECLARATIONS.length);
  const puzzle = DECLARATIONS[index];
  
  return {
    ...puzzle,
    dateString,
    puzzleNumber: Math.floor((new Date(dateString) - new Date('2026-01-01')) / (1000 * 60 * 60 * 24)) + 1
  };
}

/**
 * Retrieves a puzzle by ID (for archive or practice mode)
 */
export function getPuzzleById(id) {
  const puzzle = DECLARATIONS.find(p => p.id === id);
  return puzzle || DECLARATIONS[0];
}

/**
 * Retrieves a random practice puzzle
 */
export function getRandomPuzzle() {
  const index = Math.floor(Math.random() * DECLARATIONS.length);
  return DECLARATIONS[index];
}

/**
 * Returns the fixed starting tile and shuffled remaining tile bank
 */
export function prepareTileBank(puzzle, dateString = null) {
  const startTile = {
    id: 'start_tile_0',
    text: puzzle.targetSentence[0],
    isStart: true,
    isTarget: true
  };

  // Remaining target tiles (excluding index 0)
  const remainingTargetTiles = puzzle.targetSentence.slice(1).map((text, idx) => ({
    id: `target_${idx + 1}`,
    text,
    isTarget: true
  }));

  const distractorTiles = puzzle.distractors.map((text, idx) => ({
    id: `distractor_${idx}`,
    text,
    isTarget: false
  }));

  const bankTiles = [...remainingTargetTiles, ...distractorTiles];

  // Seeded shuffle so daily puzzle tile pool is identical for everyone
  const seedStr = (dateString || puzzle.code) + '_tiles';
  const seed = hashString(seedStr);
  const rng = mulberry32(seed);

  for (let i = bankTiles.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bankTiles[i], bankTiles[j]] = [bankTiles[j], bankTiles[i]];
  }

  return { startTile, bankTiles };
}


/**
 * Validates a user's submitted tile sequence against target sentence.
 * Returns array of status strings: 'correct' | 'misplaced' | 'incorrect'
 */
export function validateSubmission(userSequence, targetSentence) {
  return userSequence.map((userText, idx) => {
    if (userText === targetSentence[idx]) {
      return 'correct'; // 🟩
    } else if (targetSentence.includes(userText)) {
      return 'misplaced'; // 🟨
    } else {
      return 'incorrect'; // ⬛
    }
  });
}

/**
 * Helper to check if the submission is 100% correct
 */
export function isSubmissionPerfect(userSequence, targetSentence) {
  if (userSequence.length !== targetSentence.length) return false;
  return userSequence.every((text, idx) => text === targetSentence[idx]);
}
