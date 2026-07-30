/**
 * Main Application Orchestrator for C-Spiral
 */

import { DailyEngine } from './game/dailyEngine.js';
import { 
  renderCodeDisplay, 
  drawSpiralPath, 
  renderTileBank, 
  renderTargetTrack, 
  renderAttemptsLog,
  renderHistogram 
} from './ui/components.js';

class CSpiralApp {
  constructor() {
    this.engine = new DailyEngine();
    this.selectedTiles = [];

    this.cacheDOM();
    this.bindEvents();
    this.initGame();
  }

  cacheDOM() {
    this.codeDisplayEl = document.getElementById('code-display');
    this.codeWrapperEl = document.getElementById('code-wrapper');
    this.spiralSvgEl = document.getElementById('spiral-svg');
    this.puzzleBadgeEl = document.getElementById('puzzle-badge');
    this.promptIdentifierEl = document.getElementById('prompt-identifier');
    this.codeDifficultyEl = document.getElementById('code-difficulty');

    this.attemptsLogEl = document.getElementById('attempts-log');
    this.targetTrackEl = document.getElementById('target-track');
    this.tileBankEl = document.getElementById('tile-bank');

    this.btnSubmit = document.getElementById('btn-submit');
    this.btnClear = document.getElementById('btn-clear');
    this.btnHelp = document.getElementById('btn-help');
    this.btnStats = document.getElementById('btn-stats');
    this.btnShare = document.getElementById('btn-share');
    this.attemptsCountEl = document.getElementById('attempts-count');

    this.modalHelp = document.getElementById('modal-help');
    this.modalStats = document.getElementById('modal-stats');
    this.shareToast = document.getElementById('share-toast');

    this.timerValEl = document.getElementById('countdown-timer');
  }

  bindEvents() {
    this.btnSubmit.addEventListener('click', () => this.handleSubmission());
    this.btnClear.addEventListener('click', () => this.clearSelection());

    this.btnHelp.addEventListener('click', () => this.openModal('modal-help'));
    this.btnStats.addEventListener('click', () => this.openStatsModal());
    this.btnShare.addEventListener('click', () => this.handleShare());

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        this.closeModal(modalId);
      });
    });

    window.addEventListener('resize', () => {
      if (this.engine.state.isCompleted) {
        drawSpiralPath(this.engine.puzzle, this.spiralSvgEl, this.codeWrapperEl);
      }
    });

    this.startMidnightTimer();
  }

  initGame() {
    const puzzle = this.engine.puzzle;
    
    this.puzzleBadgeEl.textContent = `Daily Puzzle #${puzzle.puzzleNumber}`;
    this.promptIdentifierEl.textContent = puzzle.identifier;
    this.codeDifficultyEl.textContent = puzzle.difficulty.toUpperCase();

    renderCodeDisplay(puzzle, this.codeDisplayEl);
    this.renderUI();

    if (this.engine.state.isCompleted) {
      this.finishGameUI();
    }
  }

  renderUI() {
    const puzzle = this.engine.puzzle;
    const attemptsLeft = 4 - this.engine.state.guesses.length;

    renderTargetTrack(
      puzzle, 
      this.selectedTiles, 
      this.targetTrackEl, 
      (tile) => this.removeSelectedTile(tile)
    );

    renderTileBank(
      this.engine.tileBank, 
      this.selectedTiles, 
      this.tileBankEl, 
      (tile) => this.addTileToTrack(tile)
    );

    renderAttemptsLog(this.engine.state.guesses, this.attemptsLogEl);

    this.attemptsCountEl.textContent = attemptsLeft;
    this.btnSubmit.disabled = this.selectedTiles.length !== puzzle.targetSentence.length || this.engine.state.isCompleted;
  }

  addTileToTrack(tile) {
    if (this.engine.state.isCompleted) return;
    if (this.selectedTiles.length < this.engine.puzzle.targetSentence.length) {
      this.selectedTiles.push(tile);
      this.renderUI();
    }
  }

  removeSelectedTile(tile) {
    if (this.engine.state.isCompleted) return;
    this.selectedTiles = this.selectedTiles.filter(t => t.id !== tile.id);
    this.renderUI();
  }

  clearSelection() {
    if (this.engine.state.isCompleted) return;
    this.selectedTiles = [];
    this.renderUI();
  }

  handleSubmission() {
    if (this.selectedTiles.length !== this.engine.puzzle.targetSentence.length) return;

    const res = this.engine.submitAttempt(this.selectedTiles);
    
    if (res.isCompleted) {
      this.finishGameUI();
      setTimeout(() => this.openStatsModal(), 800);
    } else {
      this.selectedTiles = [];
      this.renderUI();
    }
  }

  finishGameUI() {
    this.btnSubmit.disabled = true;
    this.btnClear.disabled = true;

    // Reveal glowing SVG spiral path animation over code
    setTimeout(() => {
      drawSpiralPath(this.engine.puzzle, this.spiralSvgEl, this.codeWrapperEl);
    }, 300);

    this.renderUI();
  }

  openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
  }

  openStatsModal() {
    const s = this.engine.state;
    document.getElementById('stat-played').textContent = s.gamesPlayed;
    
    const winPct = s.gamesPlayed > 0 ? Math.round((s.gamesWon / s.gamesPlayed) * 100) : 0;
    document.getElementById('stat-winrate').textContent = `${winPct}%`;
    document.getElementById('stat-streak').textContent = s.streakCurrent;
    document.getElementById('stat-maxstreak').textContent = s.streakMax;

    renderHistogram(s.guessDistribution, document.getElementById('guess-histogram'));

    const bannerEl = document.getElementById('game-result-banner');
    if (s.isCompleted) {
      bannerEl.classList.remove('hidden');
      document.getElementById('result-emoji').textContent = s.isWon ? '🎉' : '🌀';
      document.getElementById('result-text').textContent = s.isWon ? 'DECLARATION MASTERED!' : 'KEEP SPIRALING!';
      document.getElementById('target-solution-display').textContent = `Solution: ${this.engine.puzzle.targetSentence.join(' ')}`;
    } else {
      bannerEl.classList.add('hidden');
    }

    this.openModal('modal-stats');
  }

  async handleShare() {
    const shareText = this.engine.getShareText();
    try {
      await navigator.clipboard.writeText(shareText);
      this.shareToast.classList.remove('hidden');
      setTimeout(() => this.shareToast.classList.add('hidden'), 2500);
    } catch (e) {
      alert(shareText);
    }
  }

  startMidnightTimer() {
    const updateTimer = () => {
      const now = new Date();
      const nextMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      ));
      
      const diffMs = nextMidnight - now;
      const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
      const mins = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const secs = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');

      this.timerValEl.textContent = `${hours}:${mins}:${secs}`;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CSpiralApp();
});
