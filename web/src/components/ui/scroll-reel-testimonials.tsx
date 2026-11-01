import * as React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScrollReelTestimonial {
  quote: string;
  author: string;
  image: string;
  alt?: string;
  role?: string;
  source?: { title: string; url: string };
  href?: string;
  saved?: boolean;
}
export interface ScrollReelTestimonialsProps {
  testimonials: ScrollReelTestimonial[];
  charStaggerMs?: number;
  className?: string;
  reducedMotion?: boolean;
  onSave?: (index: number) => void;
  labels: {
    region: string;
    previous: string;
    next: string;
    read: string;
    save: string;
    saved: string;
    translation: string;
  };
}

// The supplied reel's geometry: a featured card every three cells.
const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);
const EXIT_MS = 200;
const SLIDE_MS = 700;

function Cell({ seed = 0 }: { seed?: number }) {
  return (
    <div className={`reel-cell reel-cell-${seed % 3}`}>
      <span />
      <i />
    </div>
  );
}

function Chars({ text, stagger }: { text: string; stagger: number }) {
  let index = 0;
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="reel-word">
            {Array.from(word).map((char, ci) => (
              <span
                key={ci}
                className="scroll-reel-char"
                style={{ animationDelay: `${index++ * stagger}ms` }}
              >
                {char}
              </span>
            ))}
          </span>{' '}
        </React.Fragment>
      ))}
    </>
  );
}

export function ScrollReelTestimonials({
  testimonials,
  charStaggerMs = 4,
  className,
  reducedMotion = false,
  onSave,
  labels,
}: ScrollReelTestimonialsProps) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const locked = React.useRef(false);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const count = testimonials.length;

  React.useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      timers.current.forEach(clearTimeout);
    };
  }, []);
  React.useEffect(() => {
    if (reducedMotion) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setDisplayIndex(index);
      setExiting(false);
      setBusy(false);
      locked.current = false;
    }
  }, [reducedMotion, index]);

  const paginate = (direction: number) => {
    const next = index + direction;
    if (locked.current || next < 0 || next >= count) return;
    setIndex(next);
    if (reducedMotion) {
      setDisplayIndex(next);
      return;
    }
    locked.current = true;
    setBusy(true);
    setExiting(true);
    timers.current.forEach(clearTimeout);
    timers.current = [
      setTimeout(() => {
        setDisplayIndex(next);
        setExiting(false);
      }, EXIT_MS),
      setTimeout(() => {
        locked.current = false;
        setBusy(false);
      }, SLIDE_MS),
    ];
  };
  const middleItems = React.useMemo(() => {
    const items: Array<number | null> = [null, null, null];
    testimonials.forEach((_, i) => {
      items.push(i);
      if (i < count - 1) items.push(null, null);
    });
    items.push(null, null, null);
    return items;
  }, [testimonials, count]);
  const current = testimonials[displayIndex] ?? testimonials[0];
  if (!current) return null;
  const y = ((count - 1) / 2 - index) * STEP;
  const colStyle = (offset: number): React.CSSProperties => ({
    transform: `translateY(${offset}px)`,
    transition:
      mounted && !reducedMotion ? `transform ${SLIDE_MS}ms cubic-bezier(.65,0,.35,1)` : 'none',
  });

  return (
    <div
      className={cn('scroll-reel', reducedMotion && 'reel-reduced', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          paginate(e.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div className="reel-visual" aria-hidden="true">
        <div className="reel-columns">
          <div className="reel-column reel-side" style={colStyle(-y)}>
            {Array.from({ length: 4 + 2 * count }, (_, i) => (
              <Cell key={i} seed={i} />
            ))}
          </div>
          <div className="reel-column" style={colStyle(y)}>
            {middleItems.map((item, i) =>
              item === null ? (
                <Cell key={i} seed={i} />
              ) : (
                <div className="reel-featured" key={i}>
                  <img
                    src={testimonials[item].image}
                    alt=""
                    width={CELL}
                    height={CELL}
                    loading="lazy"
                  />
                </div>
              ),
            )}
          </div>
          <div className="reel-column reel-side" style={colStyle(-y)}>
            {Array.from({ length: 4 + 2 * count }, (_, i) => (
              <Cell key={i} seed={i + 1} />
            ))}
          </div>
        </div>
        <span className="reel-visual-label mono">SUNSET / PERSPECTIVES</span>
      </div>
      <div className="reel-copy">
        <div className="reel-topline">
          <Quote size={27} strokeWidth={1.2} aria-hidden="true" />
          <span className="mono">
            {String(displayIndex + 1).padStart(2, '0')}{' '}
            <span>/ {String(count).padStart(2, '0')}</span>
          </span>
        </div>
        <div
          className={cn('reel-text', exiting && 'scroll-reel-exit')}
          key={displayIndex}
          aria-live="polite"
          aria-atomic="true"
        >
          <blockquote>
            <span className="sr-only">{current.quote}</span>
            <span aria-hidden="true">
              {reducedMotion ? (
                current.quote
              ) : (
                <Chars text={current.quote} stagger={Math.max(0, Math.min(charStaggerMs, 8))} />
              )}
            </span>
          </blockquote>
          <div className="reel-byline">
            <strong>{current.author}</strong>
            <span>{current.role}</span>
          </div>
          {current.source && (
            <a className="reel-source" href={current.source.url} target="_blank" rel="noreferrer">
              {current.source.title}
              <ExternalLink size={11} />
              <span>{labels.translation}</span>
            </a>
          )}
        </div>
        <div className="reel-controls">
          <div className="reel-pagination">
            <button
              onClick={() => paginate(-1)}
              disabled={index === 0 || busy}
              aria-label={labels.previous}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={() => paginate(1)}
              disabled={index === count - 1 || busy}
              aria-label={labels.next}
            >
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="reel-actions">
            {onSave && (
              <button
                className="reel-save"
                aria-pressed={!!current.saved}
                aria-label={current.saved ? labels.saved : labels.save}
                onClick={() => onSave(displayIndex)}
              >
                {current.saved ? <Check size={17} /> : <Bookmark size={17} />}
              </button>
            )}
            {current.href && (
              <a href={current.href}>
                {labels.read}
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ScrollReelTestimonials;
