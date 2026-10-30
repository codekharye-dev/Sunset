import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Check,
  Copy,
  Focus,
  Minus,
  Plus,
  Share2,
  ArrowRight,
  Clock3,
} from 'lucide-react';
import { articles, asset, dateLabel } from '@/lib/content';
import { useRoute, useSunset } from '@/lib/state';
import { StoryCard, SectionTitle, EmptyState } from '@/components/common';
import { Button } from '@/components/ui/button';
export default function Story({ id }: { id: string }) {
  const a = articles.find((x) => x.id === id);
  const { t, lang, saved, toggleSave, size, setSize, history, recordReading, notify, reduced } =
    useSunset();
  const { params } = useRoute();
  const content = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const [focus, setFocus] = useState(false);
  const [share, setShare] = useState('');
  const [copied, setCopied] = useState(false);
  const latest = useRef(history[id]?.progress || 0);
  useEffect(() => {
    if (!a) return;
    let timer: ReturnType<typeof setTimeout>;
    let frame = 0;
    let ready = true;
    recordReading(a.id, history[a.id]?.progress || 0);
    const update = () => {
      if (!content.current || !ready) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = content.current!.getBoundingClientRect();
        const top = rect.top + scrollY;
        const p = Math.max(
          0,
          Math.min(1, (scrollY + innerHeight - top) / (rect.height + innerHeight * 0.15)),
        );
        setPercent(p);
        latest.current = p;
        clearTimeout(timer);
        timer = setTimeout(() => recordReading(a.id, p, p >= 0.98), 450);
      });
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    if (params.get('resume') === '1' && latest.current > 0) {
      const resume = setTimeout(() => {
        if (content.current) {
          const top = content.current.getBoundingClientRect().top + scrollY;
          scrollTo({
            top: Math.max(
              0,
              top +
                latest.current * (content.current.offsetHeight + innerHeight * 0.15) -
                innerHeight,
            ),
            behavior: 'instant',
          });
          update();
        }
      }, 120);
      return () => {
        ready = false;
        clearTimeout(resume);
        clearTimeout(timer);
        cancelAnimationFrame(frame);
        removeEventListener('scroll', update);
        removeEventListener('resize', update);
        recordReading(a.id, latest.current, latest.current >= 0.98);
      };
    }
    return () => {
      ready = false;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
      recordReading(a.id, latest.current, latest.current >= 0.98);
    };
  }, [id, recordReading]);
  useEffect(() => {
    document.documentElement.dataset.focus = String(focus);
    return () => {
      delete document.documentElement.dataset.focus;
    };
  }, [focus]);
  if (!a)
    return (
      <div className="shell page-padding">
        <EmptyState
          title={t('notFound')}
          description={t('notFoundSub')}
          action={
            <Button asChild>
              <a href="#/discover">
                {t('explore')}
                <ArrowUpRight size={17} />
              </a>
            </Button>
          }
        />
      </div>
    );
  const text = a.text[lang],
    isSaved = saved.includes(a.id);
  const related = articles
    .filter((x) => x.id !== id)
    .sort((x, y) => Number(y.category === a.category) - Number(x.category === a.category))
    .slice(0, 3);
  async function copy() {
    const url = new URL(location.href);
    url.hash = `/story/${a!.id}`;
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
      notify(t('copied'));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setShare(url.href);
    }
  }
  const sectionKeys = ['section1', 'section2', 'section3'];
  return (
    <article className={`article-page ${focus ? 'focus-mode' : ''}`}>
      <div
        className="reader-progress"
        style={{ width: `${percent * 100}%` }}
        role="progressbar"
        aria-label={t('progressLabel')}
        aria-valuenow={Math.round(percent * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <header className="article-hero shell">
        <div className="breadcrumbs">
          <a href="#/discover">
            <ArrowLeft size={14} />
            {t('explore')}
          </a>
          <span>/</span>
          <a href={`#/topic/${a.category}`}>{t(a.category)}</a>
          <span>/</span>
          <span>{t('sample')}</span>
        </div>
        <div className="article-kicker">
          <span className={`category-tag ${a.category}`}>{t(a.category)}</span>
          <span className="sample-text">{t('sample')}</span>
          <span className="eyebrow">{t('readingRoom')}</span>
        </div>
        <h1>{text.title}</h1>
        <p className="article-deck">{text.excerpt}</p>
        <div className="article-byline">
          <span className="avatar">S</span>
          <span>
            <strong>{t('author')}</strong>
            <small>{dateLabel(a.date, lang)}</small>
          </span>
          <span className="byline-time">
            <Clock3 size={15} />
            {a.time} {t('readTime')}
          </span>
          <button
            className={`article-bookmark icon-button ${isSaved ? 'active' : ''}`}
            aria-label={t(isSaved ? 'unsave' : 'save')}
            aria-pressed={isSaved}
            onClick={() => {
              toggleSave(id);
              notify(t(isSaved ? 'removedToast' : 'savedToast'));
            }}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="article-cover">
          <img
            src={asset(a.image)}
            alt={`${text.title} — ${t('sample')}`}
            width="960"
            height="720"
          />
          <span className="mono">{t('sample')} / SUNSET</span>
        </div>
      </header>
      <div className="reader-bar">
        <div className="reader-bar-inner shell">
          <span className="reader-bar-title">{text.title}</span>
          <div className="reader-actions">
            <button
              className={focus ? 'active' : ''}
              onClick={() => setFocus(!focus)}
              aria-pressed={focus}
            >
              <Focus size={16} />
              <span>{t(focus ? 'exitFocus' : 'focus')}</span>
            </button>
            <div className="reader-font">
              <button
                aria-label={t('fontSmaller')}
                onClick={() => setSize(Math.max(16, size - 1))}
                disabled={size <= 16}
              >
                <Minus size={14} />
              </button>
              <span>Aa</span>
              <button
                aria-label={t('fontLarger')}
                onClick={() => setSize(Math.min(25, size + 1))}
                disabled={size >= 25}
              >
                <Plus size={14} />
              </button>
            </div>
            <button aria-label={t('share')} onClick={copy}>
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              <span>{t(copied ? 'copiedShort' : 'share')}</span>
            </button>
            <span className="reader-percentage mono">{Math.round(percent * 100)}%</span>
          </div>
        </div>
      </div>
      <div className="article-reading shell">
        <aside className="article-toc">
          <span className="eyebrow">{t('contents')}</span>
          {sectionKeys.map((key, i) => (
            <button
              key={key}
              onClick={() =>
                document
                  .getElementById(`story-section-${i}`)
                  ?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
              }
            >
              <span>0{i + 1}</span>
              {t(key)}
            </button>
          ))}
          <div className="toc-note">
            <span>✳</span>
            <p>{t('note')}</p>
          </div>
        </aside>
        <div className="reading-content" ref={content} style={{ fontSize: `${size}px` }}>
          {share && (
            <div className="share-fallback">
              <label htmlFor="share-url">{t('copyFailed')}</label>
              <input id="share-url" readOnly value={share} onFocus={(e) => e.target.select()} />
              <button aria-label={t('close')} onClick={() => setShare('')}>
                ×
              </button>
            </div>
          )}
          <p className="article-lead">{text.body[0]}</p>
          {sectionKeys.map((key, i) => (
            <section key={key} id={`story-section-${i}`} className="story-paragraph">
              <span className="chapter-label mono">0{i + 1} — SUNSET</span>
              <h2>{t(key)}</h2>
              <p>{text.body[i + 1]}</p>
              {i === 0 && (
                <blockquote>
                  <span>“</span>
                  {text.excerpt}
                </blockquote>
              )}
            </section>
          ))}
          <div className="reading-end">
            <span className="reading-end-sun">☼</span>
            <p>{t('note')}</p>
            <Button
              onClick={() => {
                latest.current = 1;
                setPercent(1);
                recordReading(id, 1, true);
                notify(t('read'));
              }}
            >
              <Check size={16} />
              {t(history[id]?.completed ? 'read' : 'markRead')}
            </Button>
          </div>
          <div className="article-bottom-actions">
            <Button
              onClick={() => {
                toggleSave(id);
                notify(t(isSaved ? 'removedToast' : 'savedToast'));
              }}
              aria-pressed={isSaved}
            >
              <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
              {t(isSaved ? 'unsave' : 'save')}
            </Button>
            <Button onClick={copy}>
              <Copy size={16} />
              {t('share')}
            </Button>
          </div>
        </div>
      </div>
      <section className="shell section related-section">
        <SectionTitle
          title={t('related')}
          description={t('relatedSub')}
          action={
            <Button asChild variant="ghost">
              <a href="#/discover">
                {t('viewAll')}
                <ArrowRight size={16} />
              </a>
            </Button>
          }
        />
        <div className="story-grid">
          {related.map((a) => (
            <StoryCard key={a.id} article={a} />
          ))}
        </div>
      </section>
    </article>
  );
}
