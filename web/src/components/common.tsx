import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Cpu,
  UsersRound,
  Palette,
  MoveUpRight,
  Globe2,
} from 'lucide-react';
import { asset, dateLabel } from '@/lib/content';
import type { Article, Category } from '@/lib/content';
import { useSunset } from '@/lib/state';
import { Button } from './ui/button';
export function Logo() {
  return (
    <a className="brand" href="#/" aria-label="Sunset">
      <span className="brand-sun" />
      Sunset<span className="brand-dot">.</span>
    </a>
  );
}
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>
          {title}
          <Sparkles size={23} />
        </h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function StoryCard({
  article,
  compact = false,
  index = 0,
}: {
  article: Article;
  compact?: boolean;
  index?: number;
}) {
  const { lang, t, saved, toggleSave, history, notify } = useSunset();
  const isSaved = saved.includes(article.id);
  const read = history[article.id];
  return (
    <article
      className={`story-card ${compact ? 'compact' : ''}`}
      style={{ '--i': index } as React.CSSProperties}
    >
      <a
        className="story-cover"
        href={`#/story/${article.id}`}
        aria-label={article.text[lang].title}
      >
        <img
          src={asset(article.image)}
          alt={`${article.text[lang].title} — ${t('sample')}`}
          loading="lazy"
          width="960"
          height="720"
        />
        <span className="sample-tag">{t('sample')}</span>
        <span className="cover-arrow">
          <ArrowUpRight size={17} />
        </span>
        {read && read.progress > 0 && (
          <span className="cover-progress" style={{ width: `${read.progress * 100}%` }} />
        )}
      </a>
      <button
        className={`save-button ${isSaved ? 'saved' : ''}`}
        aria-pressed={isSaved}
        aria-label={`${t(isSaved ? 'unsave' : 'save')}: ${article.text[lang].title}`}
        onClick={() => {
          toggleSave(article.id);
          notify(t(isSaved ? 'removedToast' : 'savedToast'));
        }}
      >
        <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
      </button>
      <div className="story-info">
        <div className="story-tags">
          <a className={`category-tag ${article.category}`} href={`#/topic/${article.category}`}>
            {t(article.category)}
          </a>
          {read?.completed && (
            <span className="read-tag">
              <Check size={11} />
              {t('read')}
            </span>
          )}
        </div>
        <h3>
          <a href={`#/story/${article.id}`}>{article.text[lang].title}</a>
        </h3>
        {compact && <p className="card-excerpt">{article.text[lang].excerpt}</p>}
        <div className="story-meta">
          <span>{dateLabel(article.date, lang)}</span>
          <span>
            {article.time} {t('readTime')}
          </span>
        </div>
      </div>
    </article>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-sun">
        <Sun size={44} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function ThemeSwitch() {
  const { theme, setTheme, t } = useSunset();
  return (
    <div className="theme-switch" role="group" aria-label={t('appearance')}>
      <button
        aria-label={t('light')}
        aria-pressed={theme === 'light'}
        onClick={() => setTheme('light')}
      >
        <Sun size={16} />
      </button>
      <button
        aria-label={t('dark')}
        aria-pressed={theme === 'dark'}
        onClick={() => setTheme('dark')}
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
export function LanguageSwitch() {
  const { lang, setLang } = useSunset();
  return (
    <div className="language-switch" role="group" aria-label={lang === 'en' ? 'Language' : 'Dil'}>
      {(['az', 'en', 'tr'] as const).map((l) => (
        <button
          key={l}
          lang={l}
          aria-label={{ az: 'Azərbaycanca', en: 'English', tr: 'Türkçe' }[l]}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
export function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="ghost">
      <a href={href}>
        {children}
        <ArrowUpRight size={17} />
      </a>
    </Button>
  );
}
export function NextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="next-link" href={href}>
      {children}
      <ArrowRight size={17} />
    </a>
  );
}

export function CategoryIcon({ category, size = 32 }: { category: Category; size?: number }) {
  const Icon = {
    tech: Cpu,
    society: UsersRound,
    culture: Palette,
    sport: MoveUpRight,
    world: Globe2,
  }[category];
  return <Icon size={size} strokeWidth={1.3} aria-hidden="true" />;
}
