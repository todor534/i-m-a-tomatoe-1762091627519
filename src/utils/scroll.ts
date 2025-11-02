/* Utilities for smooth scrolling between sections */

export type HistoryMode = 'push' | 'replace' | false;

export interface ScrollOptions {
  offset?: number;
  smooth?: boolean;
  focus?: boolean;
  updateHistory?: HistoryMode;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function prefersReducedMotion(): boolean {
  if (!isBrowser()) return true;
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getNumberFromCSSVar(name: string): number | null {
  if (!isBrowser()) return null;
  const root = document.documentElement;
  const inline = root.style.getPropertyValue(name)?.trim();
  const computed = getComputedStyle(root).getPropertyValue(name)?.trim();
  const candidate = inline || computed;
  if (!candidate) return null;
  const parsed = parseFloat(candidate);
  return Number.isFinite(parsed) ? parsed : null;
}

function detectStickyHeaderHeight(): number {
  if (!isBrowser()) return 0;
  const selectors = [
    '[data-sticky]',
    '[data-fixed]',
    '#site-header',
    '.site-header',
    'header[role="banner"]',
    'header'
  ];

  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) continue;
    const cs = getComputedStyle(el);
    const isSticky = cs.position === 'sticky' || cs.position === 'fixed' || el.hasAttribute('data-sticky') || el.hasAttribute('data-fixed');
    if (isSticky) {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) return rect.height;
    }
  }
  return 0;
}

function resolveOffset(explicit?: number): number {
  if (!isBrowser()) return explicit ?? 0;
  if (typeof explicit === 'number') return explicit;
  // Allow either --scroll-offset or --header-height CSS vars to define offset
  const fromScrollOffset = getNumberFromCSSVar('--scroll-offset');
  if (fromScrollOffset !== null) return fromScrollOffset;
  const fromHeaderHeight = getNumberFromCSSVar('--header-height');
  if (fromHeaderHeight !== null) return fromHeaderHeight;
  // Fallback: detect sticky header height
  return detectStickyHeaderHeight();
}

function getTarget(target: string | Element | null): Element | null {
  if (!isBrowser() || !target) return null;
  if (typeof target !== 'string') return target;
  const id = target.startsWith('#') ? target.slice(1) : target;
  if (!id) return null;
  // Prefer ID, then name attribute (legacy anchor)
  return document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`);
}

function focusElement(el: Element) {
  if (!(el instanceof HTMLElement)) return;
  const wasTabIndexSet = el.hasAttribute('tabindex');
  const prevTabIndex = el.getAttribute('tabindex');
  if (!el.matches('a, button, input, textarea, select, details,[tabindex]')) {
    el.setAttribute('tabindex', '-1');
  }
  try {
    el.focus({ preventScroll: true });
  } catch {
    // ignore
  }
  if (!wasTabIndexSet) {
    // Clean up the temporary tabindex after a tick
    setTimeout(() => {
      if (el.getAttribute('tabindex') === '-1') {
        el.removeAttribute('tabindex');
      } else if (prevTabIndex !== null) {
        el.setAttribute('tabindex', prevTabIndex);
      }
    }, 0);
  }
}

export function scrollToTop(options: Omit<ScrollOptions, 'updateHistory' | 'focus'> = {}): void {
  if (!isBrowser()) return;
  const smooth = options.smooth !== false && !prefersReducedMotion();
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

export function scrollToElement(target: Element, opts: ScrollOptions = {}): void {
  if (!isBrowser() || !target) return;
  const offset = resolveOffset(opts.offset);
  const reduce = prefersReducedMotion();
  const smooth = opts.smooth !== false && !reduce;

  const rect = target.getBoundingClientRect();
  const absoluteTop = window.pageYOffset + rect.top;
  const top = Math.max(absoluteTop - offset, 0);

  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });

  const applyFocus = opts.focus !== false;

  const afterScroll = () => {
    if (applyFocus) focusElement(target);
  };

  if (smooth) {
    // Give the browser time to complete smooth scroll
    const distance = Math.abs(window.pageYOffset - top);
    const duration = Math.min(800, Math.max(250, Math.round(distance / 3))); // heuristic
    window.setTimeout(afterScroll, duration);
  } else {
    afterScroll();
  }
}

export function scrollToId(id: string, opts: ScrollOptions = {}): void {
  const target = getTarget(id);
  if (!target) return;
  scrollToElement(target, opts);

  const historyMode = opts.updateHistory ?? 'replace';
  if (historyMode && isBrowser()) {
    const hash = '#' + (id.startsWith('#') ? id.slice(1) : id);
    try {
      if (historyMode === 'push') {
        history.pushState(null, '', hash);
      } else if (historyMode === 'replace') {
        history.replaceState(null, '', hash);
      }
    } catch {
      // ignore history errors
    }
  }
}

export function scrollToHash(hash?: string, opts: ScrollOptions = {}): void {
  if (!isBrowser()) return;
  const h = (hash ?? window.location.hash ?? '').trim();
  if (!h) return;
  const id = h.startsWith('#') ? h.slice(1) : h;
  if (!id) return;
  scrollToId(id, { ...opts, updateHistory: false });
}

export interface AnchorBindingOptions extends ScrollOptions {
  selector?: string;
  exclude?: string;
}

/**
 * Attach smooth scrolling to in-page anchor links.
 * Returns a cleanup function to remove the listener.
 */
export function enableSmoothScrollForAnchors(options: AnchorBindingOptions = {}): () => void {
  if (!isBrowser()) return () => {};
  const selector = options.selector ?? 'a[href^="#"]';
  const exclude = options.exclude ?? '[data-no-scroll]';

  const handler = (e: Event) => {
    const target = e.target as Element | null;
    if (!target) return;
    const link = target.closest<HTMLAnchorElement>(selector);
    if (!link) return;
    if (exclude && link.matches(exclude)) return;

    const href = link.getAttribute('href') || '';
    const url = new URL(href, window.location.href);
    const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search;

    if (!isSamePage) return; // allow default navigation for external/other page anchors

    const hash = url.hash || '';
    if (!hash) return;

    // Allow #top shorthand
    if (hash === '#' || hash.toLowerCase() === '#top') {
      e.preventDefault();
      const updateHistory = options.updateHistory ?? 'push';
      scrollToTop({ smooth: options.smooth });
      if (updateHistory) {
        try {
          if (updateHistory === 'push') history.pushState(null, '', '#');
          else history.replaceState(null, '', '#');
        } catch {
          // ignore
        }
      }
      return;
    }

    const id = hash.slice(1);
    const targetEl = getTarget(id);
    if (!targetEl) return; // allow default if no target

    e.preventDefault();
    const updateHistory = options.updateHistory ?? 'push';
    scrollToElement(targetEl, {
      offset: options.offset,
      smooth: options.smooth,
      focus: options.focus,
      updateHistory
    });
    if (updateHistory) {
      try {
        if (updateHistory === 'push') history.pushState(null, '', '#' + id);
        else history.replaceState(null, '', '#' + id);
      } catch {
        // ignore
      }
    }
  };

  document.addEventListener('click', handler, { passive: false });
  return () => {
    document.removeEventListener('click', handler as EventListener);
  };
}

/**
 * Scroll to the current location hash on load (useful when the app hydrates).
 */
export function scrollToCurrentHash(options: ScrollOptions = {}): void {
  if (!isBrowser()) return;
  if (!window.location.hash) return;
  // Delay to ensure layout is ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToHash(window.location.hash, options);
    });
  });
}