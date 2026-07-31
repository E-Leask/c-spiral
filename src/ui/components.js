/**
 * UI Component Renderers & Interactions for C-Spiral
 */

export function renderCodeDisplay(puzzle, codeDisplayEl) {
  codeDisplayEl.innerHTML = '';
  
  const code = puzzle.code;
  const sequence = puzzle.spiralSequence;

  // Build tokenized code string
  let lastIdx = 0;
  const fragments = [];

  // Sort spiral sequence by starting character position in code
  const sortedSeq = [...sequence].sort((a, b) => a.range[0] - b.range[0]);

  sortedSeq.forEach((step, idx) => {
    const [start, end] = step.range;
    if (start > lastIdx) {
      fragments.push(document.createTextNode(code.slice(lastIdx, start)));
    }

    const isStartToken = step.type === 'identifier';
    const span = document.createElement('span');
    span.className = `code-token token-${step.type} ${isStartToken ? 'token-start-identifier' : ''}`;
    span.id = `token-span-${idx}`;
    span.setAttribute('data-step', idx);
    
    if (isStartToken) {
      span.innerHTML = `${code.slice(start, end)} <span class="start-indicator">🌀 START</span>`;
    } else {
      span.textContent = code.slice(start, end);
    }
    
    fragments.push(span);

    lastIdx = end;
  });

  if (lastIdx < code.length) {
    fragments.push(document.createTextNode(code.slice(lastIdx)));
  }

  fragments.forEach(frag => codeDisplayEl.appendChild(frag));
}

export function drawSpiralPath(puzzle, svgEl, wrapperEl) {
  svgEl.innerHTML = '';

  const spans = wrapperEl.querySelectorAll('.code-token');
  if (spans.length < 2) return;

  const wrapperRect = wrapperEl.getBoundingClientRect();
  const points = [];

  spans.forEach(span => {
    const rect = span.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - wrapperRect.left;
    const y = rect.top + rect.height / 2 - wrapperRect.top;
    points.push({ x, y });
  });

  if (points.length < 2) return;

  // Construct SVG cubic bezier curve connecting spiral steps
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const controlY = i % 2 === 0 ? p1.y - 30 : p1.y + 30;

    d += ` C ${p1.x + dx / 2} ${controlY}, ${p2.x - dx / 2} ${controlY}, ${p2.x} ${p2.y}`;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('class', 'spiral-path');

  svgEl.appendChild(path);
}

/**
 * Simplifies tile label for the available bank by hiding connectors (a, an, of, to, returning)
 */
export function getShortTileLabel(text) {
  if (!text) return '';
  let label = text.trim();
  
  // Strip leading articles "a ", "an "
  label = label.replace(/^(a|an)\s+/i, '');

  // Strip trailing connectors " of", " to", " returning"
  label = label.replace(/\s+(of|to|returning)$/i, '');

  return label;
}

export function renderTileBank(tileBank, selectedTiles, tileBankEl, onTileClick) {
  tileBankEl.innerHTML = '';

  tileBank.forEach(tile => {
    const isSelected = selectedTiles.some(t => t.id === tile.id);
    if (!isSelected) {
      const tileEl = document.createElement('button');
      tileEl.className = 'phrase-tile tile-in-bank';
      tileEl.textContent = getShortTileLabel(tile.text);
      tileEl.setAttribute('title', `Full phrase: "${tile.text}"`);
      tileEl.addEventListener('click', () => onTileClick(tile));
      tileBankEl.appendChild(tileEl);
    }
  });
}


export function renderTargetTrack(puzzle, selectedTiles, targetTrackEl, onSlotClick) {
  targetTrackEl.innerHTML = '';
  
  const slotCount = puzzle.targetSentence.length;

  for (let i = 0; i < slotCount; i++) {
    const tile = selectedTiles[i];
    const slotEl = document.createElement('button');
    
    if (tile && tile.isStart) {
      slotEl.className = 'phrase-tile start-tile in-target';
      slotEl.innerHTML = `<span class="start-pin-badge">START 🌀</span> ${tile.text}`;
      slotEl.setAttribute('title', 'Given starting variable tile');
      slotEl.style.cursor = 'default';
    } else if (tile) {
      slotEl.className = 'phrase-tile in-target';
      slotEl.textContent = tile.text;
      slotEl.addEventListener('click', () => onSlotClick(tile));
    } else {
      slotEl.className = 'phrase-tile empty-slot';
      slotEl.textContent = `Slot #${i + 1}`;
      slotEl.style.opacity = '0.4';
      slotEl.style.borderStyle = 'dashed';
    }

    targetTrackEl.appendChild(slotEl);
  }
}


export function renderAttemptsLog(guesses, attemptsLogEl) {
  attemptsLogEl.innerHTML = '';

  guesses.forEach((guess, idx) => {
    const row = document.createElement('div');
    row.className = 'attempt-row';

    guess.tiles.forEach((text, tileIdx) => {
      const status = guess.feedback[tileIdx];
      const tile = document.createElement('div');
      tile.className = `attempt-tile ${status}`;
      tile.textContent = text;
      row.appendChild(tile);
    });

    attemptsLogEl.appendChild(row);
  });
}

export function renderHistogram(distribution, containerEl) {
  containerEl.innerHTML = '';
  const maxVal = Math.max(...Object.values(distribution), 1);

  for (let attempt = 1; attempt <= 4; attempt++) {
    const count = distribution[attempt] || 0;
    const pct = Math.max(Math.round((count / maxVal) * 100), 10);

    const row = document.createElement('div');
    row.className = 'histogram-row';
    row.innerHTML = `
      <span style="font-family:var(--font-mono); font-weight:700;">${attempt}</span>
      <div class="histogram-bar-bg">
        <div class="histogram-bar-fill" style="width: ${count > 0 ? pct : 0}%;">${count}</div>
      </div>
    `;
    containerEl.appendChild(row);
  }
}
