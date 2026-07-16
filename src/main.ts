import { prepareWithSegments, layoutNextLine, layoutWithLines, type LayoutCursor } from '@chenglou/pretext';
import {
  formatAwardsCanvas,
  formatHeroText,
  formatProjectsCanvas,
  subject,
  type FocusTag,
  type SkillGroup,
  type Subject,
} from './content';

window.addEventListener('error', (e) => {
  console.error('Uncaught runtime error:', e.error);
});

const INK = '#111111';
const PAPER = '#f4f1ea';
const YELLOW = '#ffe14d';
const CYAN = '#5ce1e6';
const MUTED = '#3a3a3a';

// Derived canvas strings from Subject content (single source)
const heroText = formatHeroText(subject);
const projectCanvasTexts = formatProjectsCanvas(subject.projects);
const awardsCanvasText = formatAwardsCanvas(subject.awards, subject.credentials);

// 1. Mouse interactions
let mouseX = -1000;
let mouseY = -1000;
let lastMouseX = -1000;
let lastMouseY = -1000;
let isResized = true;

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
};
window.addEventListener('mousemove', handleMouseMove);
const markResized = () => {
  isResized = true;
};
window.addEventListener('resize', markResized);
window.visualViewport?.addEventListener('resize', markResized);
window.visualViewport?.addEventListener('scroll', markResized);

// --- DOM hydrate from Subject content ---

const hydrateChrome = (s: Subject) => {
  document.title = `${s.displayName} | ${s.roleLine.replace(/。$/, '')}`;

  const logo = document.querySelector('.logo');
  if (logo) {
    logo.textContent = `${s.displayName}.`;
  }

  const footerMark = document.querySelector('.footer-mark');
  if (footerMark) {
    footerMark.textContent = s.displayName.toUpperCase();
  }

  const footerRole = document.querySelector('.footer-role');
  if (footerRole) {
    // Role Line from Subject; strip trailing period for chrome density.
    footerRole.textContent = s.roleLine.replace(/。$/, '');
  }
};

const hydrateAbout = (s: Subject) => {
  const nameTitle = document.querySelector('.name-title');
  if (nameTitle) {
    nameTitle.textContent = s.displayName;
  }

  const badgeRow = document.getElementById('about-focus-tags');
  if (badgeRow) {
    badgeRow.replaceChildren(
      ...s.focusTags.map((tag: FocusTag) => {
        const span = document.createElement('span');
        span.className = `badge badge--${tag.variant}`;
        span.textContent = tag.label;
        return span;
      })
    );
  }

  const opening = document.getElementById('about-opening-copy');
  if (opening) {
    // Full Opening Copy; collapse hard line-breaks from hero pre-wrap into readable prose.
    opening.textContent = s.openingCopy.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  }
};

const hydrateSkills = (groups: SkillGroup[]) => {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.replaceChildren(
    ...groups.map((group) => {
      const article = document.createElement('article');
      article.className = `nb-card skill-card skill-card--${group.variant}`;

      const h3 = document.createElement('h3');
      h3.textContent = group.title;
      article.appendChild(h3);

      const ul = document.createElement('ul');
      for (const point of group.points) {
        const li = document.createElement('li');
        // Skill points may include trusted <strong> markers from repo-authored content.
        li.innerHTML = point.text;
        ul.appendChild(li);
      }
      article.appendChild(ul);

      return article;
    })
  );
};

const hydrateSubjectDom = (s: Subject) => {
  hydrateChrome(s);
  hydrateAbout(s);
  hydrateSkills(s.skillGroups);
};

hydrateSubjectDom(subject);

// --- Hero Canvas setup ---
const canvasHero = document.getElementById('pretext-hero') as HTMLCanvasElement;
const ctxHero = canvasHero.getContext('2d')!;
let heroPrepared: any;
let heroFontSizePx = 40;
let heroLineHeight = 58;
let heroContainerWidth = 0;
let heroStartX = 0;
let heroStartY = 0;
let heroContentHeight = 0;

const getViewportSize = () => {
  const vv = window.visualViewport;
  return {
    w: Math.round(vv?.width ?? window.innerWidth),
    h: Math.round(vv?.height ?? window.innerHeight),
  };
};

const getNavBottom = () => {
  const nav = document.querySelector('.nav') as HTMLElement | null;
  if (!nav) return 72;
  return Math.ceil(nav.getBoundingClientRect().bottom);
};

const getHeroMetrics = (w: number) => {
  const isMobile = w < 768;
  const isNarrow = w < 400;
  const fontSize = isNarrow ? 20 : isMobile ? 22 : 40;
  const lineHeight = Math.round(fontSize * (isMobile ? 1.55 : 1.45));
  const sidePad = isMobile ? Math.max(16, Math.round(w * 0.05)) : Math.round(w * 0.075);
  const containerWidth = Math.min(w - sidePad * 2, 1100);
  return { isMobile, fontSize, lineHeight, containerWidth, sidePad };
};

const measureHeroHeight = (prepared: any, width: number, lineHeight: number) => {
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let lines = 0;
  while (true) {
    const line = layoutNextLine(prepared, cursor, width);
    if (!line) break;
    cursor = line.end;
    lines += 1;
    if (lines > 80) break;
  }
  return lines * lineHeight;
};

const prepareHeroFit = (w: number, availableH: number) => {
  const base = getHeroMetrics(w);
  let fontSize = base.fontSize;
  const minFont = base.isMobile ? 15 : 28;

  while (fontSize >= minFont) {
    const lineHeight = Math.round(fontSize * (base.isMobile ? 1.5 : 1.45));
    const prepared = prepareWithSegments(
      heroText,
      `700 ${fontSize}px "Space Grotesk", system-ui, sans-serif`,
      { whiteSpace: 'pre-wrap' }
    );
    const height = measureHeroHeight(prepared, base.containerWidth, lineHeight);
    if (height <= availableH || fontSize === minFont) {
      return {
        ...base,
        fontSize,
        lineHeight,
        prepared,
        contentHeight: height,
      };
    }
    fontSize -= 1;
  }

  const lineHeight = Math.round(minFont * 1.5);
  const prepared = prepareWithSegments(
    heroText,
    `700 ${minFont}px "Space Grotesk", system-ui, sans-serif`,
    { whiteSpace: 'pre-wrap' }
  );
  return {
    ...base,
    fontSize: minFont,
    lineHeight,
    prepared,
    contentHeight: measureHeroHeight(prepared, base.containerWidth, lineHeight),
  };
};

const renderHeroDynamic = () => {
  const { w, h } = getViewportSize();
  const baseMetrics = getHeroMetrics(w);
  heroContainerWidth = baseMetrics.containerWidth;
  heroStartX = (w - baseMetrics.containerWidth) / 2;

  const navBottom = getNavBottom();
  const stampReserve = baseMetrics.isMobile ? 52 : 72;
  const topPad = navBottom + (baseMetrics.isMobile ? 10 : 20);
  const bottomPad = stampReserve + (baseMetrics.isMobile ? 10 : 20);
  const available = Math.max(h - topPad - bottomPad, 120);

  if (isResized || !heroPrepared) {
    canvasHero.width = w * window.devicePixelRatio;
    canvasHero.height = h * window.devicePixelRatio;
    canvasHero.style.width = `${w}px`;
    canvasHero.style.height = `${h}px`;
    ctxHero.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    const fit = prepareHeroFit(w, available);
    heroPrepared = fit.prepared;
    heroFontSizePx = fit.fontSize;
    heroLineHeight = fit.lineHeight;
    heroContentHeight = fit.contentHeight;
  }

  const metrics = {
    isMobile: baseMetrics.isMobile,
    fontSize: heroFontSizePx,
    lineHeight: heroLineHeight,
  };
  const centeredY = topPad + (available - heroContentHeight) / 2;
  heroStartY = heroContentHeight > available ? topPad : Math.max(topPad, centeredY);

  ctxHero.clearRect(0, 0, w, h);
  ctxHero.textAlign = 'left';
  ctxHero.textBaseline = 'top';

  const AVOID_RADIUS = metrics.isMobile ? 0 : 80;
  const fontStr = `700 ${heroFontSizePx}px "Space Grotesk", system-ui, sans-serif`;
  const shadowOffset = metrics.isMobile ? 2 : 3;
  const clipBottom = h - bottomPad + heroLineHeight * 0.35;

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let currentY = heroStartY;

  while (true) {
    if (currentY > clipBottom) break;

    const centerLineY = currentY + heroLineHeight / 2;
    const dy = Math.abs(centerLineY - mouseY);

    let spans: { x: number; w: number }[] = [{ x: heroStartX, w: heroContainerWidth }];

    if (AVOID_RADIUS > 0 && dy < AVOID_RADIUS) {
      const dx = Math.sqrt(AVOID_RADIUS * AVOID_RADIUS - dy * dy);
      const cutoutLeft = mouseX - dx;
      const cutoutRight = mouseX + dx;

      spans = [];
      if (cutoutLeft > heroStartX) {
        const leftFragWidth = cutoutLeft - heroStartX;
        if (leftFragWidth > 60) {
          spans.push({ x: heroStartX, w: leftFragWidth });
        }
      }
      if (cutoutRight < heroStartX + heroContainerWidth) {
        const rightFragWidth = heroStartX + heroContainerWidth - cutoutRight;
        if (rightFragWidth > 60) {
          spans.push({ x: cutoutRight, w: rightFragWidth });
        }
      }
    }

    let exhausted = false;
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      const line = layoutNextLine(heroPrepared, cursor, span.w);
      if (!line) {
        exhausted = true;
        break;
      }

      cursor = line.end;
      ctxHero.font = fontStr;

      ctxHero.fillStyle = YELLOW;
      ctxHero.fillText(line.text, span.x + shadowOffset, currentY + shadowOffset);

      ctxHero.fillStyle = INK;
      ctxHero.fillText(line.text, span.x, currentY);
    }

    if (exhausted) break;
    currentY += heroLineHeight;
  }
};

const drawHardCard = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string
) => {
  // Offset shadow block
  ctx.fillStyle = INK;
  ctx.fillRect(x + 5, y + 5, w, h);

  // Face
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);

  // Thick border
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
};

const renderSections = () => {
  try {
    const cvsProj = document.getElementById('pretext-projects') as HTMLCanvasElement;
    if (!cvsProj) return;
    const ctxProj = cvsProj.getContext('2d')!;

    const parent = cvsProj.parentElement!;
    const shellPad = 8; // matches .nb-canvas-shell padding
    const containerW = Math.max(
      Math.floor(parent.clientWidth - shellPad * 2) || getViewportSize().w - 40,
      200
    );
    const { w } = getViewportSize();
    const isMobile = w < 768;
    const isNarrow = w < 400;
    const bodySize = isNarrow ? 14 : isMobile ? 15 : 17.5;
    const titleSize = isNarrow ? 15 : isMobile ? 16 : 19;
    const projFontStr = `500 ${bodySize}px "Space Grotesk", system-ui, sans-serif`;
    const titleFontStr = `700 ${titleSize}px "Space Grotesk", system-ui, sans-serif`;
    const marginW = isNarrow ? 14 : isMobile ? 16 : 28;
    const cardW = Math.max(containerW - 4, 180);
    const textW = Math.max(cardW - marginW * 2, 140);
    const projLineH = isNarrow ? 22 : isMobile ? 24 : 30;
    const cardPadY = isMobile ? 18 : 22;
    const cardGap = isMobile ? 16 : 22;

    const preparedProjects = projectCanvasTexts.map((p) =>
      prepareWithSegments(p, projFontStr, { whiteSpace: 'pre-wrap' })
    );
    const layouts = preparedProjects.map((p) => layoutWithLines(p, textW, projLineH));

    const cardFills = [PAPER, '#fff8d6', '#ffe4ef'];
    const requiredHeight =
      layouts.reduce((acc, l) => acc + l.height + cardPadY * 2 + cardGap, 0) + 8;

    cvsProj.width = containerW * window.devicePixelRatio;
    cvsProj.height = requiredHeight * window.devicePixelRatio;
    cvsProj.style.width = `${containerW}px`;
    cvsProj.style.height = `${requiredHeight}px`;
    ctxProj.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    ctxProj.clearRect(0, 0, containerW, requiredHeight);

    let currentY = 4;
    layouts.forEach((layout, index) => {
      const cardHeight = layout.height + cardPadY * 2;
      const fill = cardFills[index % cardFills.length];

      drawHardCard(ctxProj, 2, currentY, cardW - 4, cardHeight, fill);

      ctxProj.textAlign = 'left';
      ctxProj.textBaseline = 'top';

      for (let i = 0; i < layout.lines.length; i++) {
        const lineTxt = layout.lines[i].text;
        const yPos = currentY + cardPadY + i * projLineH;

        if (lineTxt.includes('【')) {
          ctxProj.fillStyle = INK;
          ctxProj.font = titleFontStr;
        } else {
          ctxProj.fillStyle = MUTED;
          ctxProj.font = projFontStr;
        }
        ctxProj.fillText(lineTxt, marginW, yPos);
      }
      currentY += cardHeight + cardGap;
    });

    const cvsAwd = document.getElementById('pretext-awards') as HTMLCanvasElement;
    if (!cvsAwd) return;
    const ctxAwd = cvsAwd.getContext('2d')!;

    // Measure Awards shell independently (do not reuse Projects parent metrics).
    const awdParent = cvsAwd.parentElement!;
    const awdShellPad = isMobile ? 6 : 8;
    const awdContainerW = Math.max(
      Math.floor(awdParent.clientWidth - awdShellPad * 2) || getViewportSize().w - 40,
      200
    );
    const awdMarginW = isNarrow ? 12 : isMobile ? 14 : 28;
    const awdCardW = Math.max(awdContainerW - 4, 180);
    const awdTextW = Math.max(awdCardW - awdMarginW * 2, 120);

    const awdBody = isNarrow ? 13 : isMobile ? 14 : 18;
    const awdTitle = isNarrow ? 14 : isMobile ? 15 : 19;
    // Extra line height on mobile so wrapped Chinese lines do not collide.
    const awdLineH = isNarrow ? 24 : isMobile ? 26 : 34;
    const awdFontStr = `500 ${awdBody}px "Space Grotesk", system-ui, sans-serif`;
    const awdTitleFont = `700 ${awdTitle}px "Space Grotesk", system-ui, sans-serif`;
    const preparedAwards = prepareWithSegments(awardsCanvasText, awdFontStr, {
      whiteSpace: 'pre-wrap',
    });
    const awdLayout = layoutWithLines(preparedAwards, awdTextW, awdLineH);

    // Only section headers use title weight — never match "奖" inside award rows
    // (e.g. 全国一等奖), which previously forced title font onto body lines and
    // caused overflow / overlap on narrow viewports.
    const isAwardsHeaderLine = (lineText: string) => {
      const t = lineText.trim();
      if (!t || /^-+$/.test(t)) return false;
      return (
        t.includes('荣誉墙') ||
        t.includes('赛事奖励') ||
        t.includes('权威凭证') ||
        t.startsWith('🏆') ||
        t.startsWith('🥇') ||
        t.startsWith('📙')
      );
    };

    const awdPadY = isMobile ? 18 : 28;
    const awdHeight = awdLayout.height + awdPadY * 2 + 8;
    cvsAwd.width = awdContainerW * window.devicePixelRatio;
    cvsAwd.height = awdHeight * window.devicePixelRatio;
    cvsAwd.style.width = `${awdContainerW}px`;
    cvsAwd.style.height = `${awdHeight}px`;
    ctxAwd.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    ctxAwd.clearRect(0, 0, awdContainerW, awdHeight);

    drawHardCard(ctxAwd, 2, 4, awdCardW - 4, awdHeight - 10, CYAN);

    ctxAwd.textBaseline = 'top';

    for (let i = 0; i < awdLayout.lines.length; i++) {
      const lineText = awdLayout.lines[i].text;
      if (isAwardsHeaderLine(lineText)) {
        ctxAwd.fillStyle = INK;
        ctxAwd.font = awdTitleFont;
      } else {
        ctxAwd.fillStyle = MUTED;
        ctxAwd.font = awdFontStr;
      }
      ctxAwd.fillText(lineText, awdMarginW, awdPadY + i * awdLineH);
    }
  } catch (err) {
    console.error('Sections render error:', err);
  }
};

const gameLoop = () => {
  if (isResized || lastMouseX !== mouseX || lastMouseY !== mouseY) {
    renderHeroDynamic();
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    if (isResized) {
      renderSections();
      isResized = false;
    }
  }
  requestAnimationFrame(gameLoop);
};

window.addEventListener(
  'scroll',
  () => {
    const scrollY = window.scrollY;
    const { h } = getViewportSize();
    const fadePoint = h * 0.75;
    const opacity = Math.max(0, 1 - scrollY / fadePoint);
    if (canvasHero) {
      canvasHero.style.opacity = String(opacity);
      canvasHero.style.visibility = opacity <= 0.02 ? 'hidden' : 'visible';
    }
    document.querySelectorAll('.fade-in').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < h * 0.9) {
        el.classList.add('visible');
      }
    });
  },
  { passive: true }
);

setTimeout(() => {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      isResized = true;
      requestAnimationFrame(gameLoop);
    });
  } else {
    isResized = true;
    requestAnimationFrame(gameLoop);
  }
  window.dispatchEvent(new Event('scroll'));
}, 100);
