import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ExternalLink,
  NotebookPen,
  Search,
} from 'lucide-react';
import { ideas, ideaImage, ideaThemes } from '@/lib/ideas';
import type { IdeaTheme } from '@/lib/ideas';
import { articles } from '@/lib/content';
import { useRoute, useSunset } from '@/lib/state';
import { Button } from '@/components/ui/button';
import { EmptyState, Reveal, SectionTitle, StoryCard } from '@/components/common';
import { InspirationReel } from '@/components/inspiration';

export default function Ideas({ id }: { id?: string }) {
  const { t, lang, savedIdeas, toggleIdea } = useSunset();
  const { params } = useRoute();
  const [theme, setTheme] = useState<IdeaTheme | 'all'>('all');
  const [savedOnly, setSavedOnly] = useState(params.get('saved') === '1');
  const [query, setQuery] = useState('');
  const idea = ideas.find((item) => item.id === id);
  if (id && !idea)
    return (
      <div className="shell page-padding">
        <EmptyState
          title={t('notFound')}
          description={t('notFoundSub')}
          action={
            <Button asChild>
              <a href="#/ideas">
                {t('ideasLibrary')}
                <ArrowRight size={16} />
              </a>
            </Button>
          }
        />
      </div>
    );
  if (idea) {
    const copy = idea.text[lang];
    return (
      <div className="shell page-padding thinker-page">
        <a className="back-link" href="#/ideas">
          <ArrowLeft size={15} />
          {t('ideasLibrary')}
        </a>
        <section
          className="thinker-hero"
          style={{ '--idea-color': idea.color } as React.CSSProperties}
        >
          <div className="thinker-poster">
            <img
              src={ideaImage(idea.id)}
              alt={`${idea.author} — ${t('authorCard')}`}
              width="480"
              height="480"
            />
            <span className="mono">{idea.years}</span>
          </div>
          <div className="thinker-intro">
            <span className="eyebrow">{t(`ideaTheme_${idea.theme}`)} / SUNSET PERSPECTIVES</span>
            <h1>{copy.title}</h1>
            <div className="thinker-author">
              <strong>{idea.author}</strong>
              <span>{copy.role}</span>
            </div>
            <p>{copy.intro}</p>
            <div className="thinker-buttons">
              <Button variant="primary" asChild>
                <a href={`#/notebook?idea=${idea.id}`}>
                  <NotebookPen size={16} />
                  {t('reflectOnIdea')}
                </a>
              </Button>
              <Button
                aria-pressed={savedIdeas.includes(idea.id)}
                onClick={() => toggleIdea(idea.id)}
              >
                {savedIdeas.includes(idea.id) ? <Check size={16} /> : <Bookmark size={16} />}
                {t(savedIdeas.includes(idea.id) ? 'removeIdea' : 'saveIdea')}
              </Button>
            </div>
          </div>
        </section>
        <div className="thinker-reading">
          <aside className="thinker-aside">
            <span className="eyebrow">{t('inspirationEyebrow')}</span>
            <span className="thinker-aside-number">
              0{ideas.indexOf(idea) + 1}
              <span>/05</span>
            </span>
            <p>{t('editorialPerspectiveNote')}</p>
          </aside>
          <article className="thinker-body">
            <figure className="sourced-quote">
              <blockquote>{copy.quote}</blockquote>
              <figcaption>
                {idea.author}
                <span>{t(lang === 'en' ? 'originalExcerpt' : 'translatedExcerpt')}</span>
              </figcaption>
              <a href={idea.source.url} target="_blank" rel="noreferrer">
                {idea.source.title}
                <ExternalLink size={13} />
              </a>
            </figure>
            {lang !== 'en' && (
              <details className="quote-original">
                <summary>{t('readOriginal')}</summary>
                <p lang="en">{idea.source.original}</p>
              </details>
            )}
            <h2>{t('sunsetPerspective')}</h2>
            <p>{copy.perspective}</p>
            <div className="practice-card">
              <span className="eyebrow">{t('oneSmallStep')}</span>
              <h2>{t('tryToday')}</h2>
              <p>{copy.practice}</p>
            </div>
            <div className="reflection-question">
              <NotebookPen size={23} strokeWidth={1.3} />
              <h2>{copy.question}</h2>
              <a href={`#/notebook?idea=${idea.id}`}>
                {t('writeYourAnswer')}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        </div>
        <section className="section thinker-related">
          <SectionTitle eyebrow={t('keepCurious')} title={t('relatedPerspectives')} />
          <div className="story-grid">
            {idea.related
              .map((id) => articles.find((a) => a.id === id))
              .filter((a) => !!a)
              .map((a) => (
                <StoryCard key={a.id} article={a} />
              ))}
          </div>
        </section>
        <NotebookInvite />
      </div>
    );
  }
  const filtered = ideas.filter(
    (item) =>
      (theme === 'all' || item.theme === theme) &&
      (!savedOnly || savedIdeas.includes(item.id)) &&
      `${item.author} ${item.text[lang].quote} ${item.text[lang].title}`
        .toLocaleLowerCase(lang)
        .includes(query.trim().toLocaleLowerCase(lang)),
  );
  return (
    <div className="shell page-padding ideas-page">
      <div className="page-hero">
        <span className="eyebrow">SUNSET PERSPECTIVES / VOL. 01</span>
        <h1>
          {t('ideasTitle')}
          <span className="heading-period">.</span>
        </h1>
        <p>{t('ideasSub')}</p>
      </div>
      <InspirationReel />
      <section className="section idea-library" aria-label={t('ideasLibrary')}>
        <SectionTitle eyebrow={t('fiveVoices')} title={t('ideasLibrary')} />
        <div className="ideas-tools">
          <label className="ideas-search">
            <Search size={17} />
            <span className="sr-only">{t('searchIdeas')}</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchIdeas')}
            />
          </label>
          <button
            className="ideas-saved-filter"
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((value) => !value)}
          >
            <Bookmark size={15} />
            {t('savedIdeas')}
            <span>{savedIdeas.length}</span>
          </button>
        </div>
        <div className="idea-filters" aria-label={t('ideaThemes')}>
          {(['all', ...ideaThemes] as const).map((item) => (
            <button key={item} aria-pressed={theme === item} onClick={() => setTheme(item)}>
              {t(item === 'all' ? 'allIdeas' : `ideaTheme_${item}`)}
            </button>
          ))}
        </div>
        {filtered.length ? (
          <div className="idea-card-grid">
            {filtered.map((idea, i) => (
              <Reveal key={idea.id} delay={(i % 3) * 45}>
                <article
                  className="idea-card"
                  style={{ '--idea-color': idea.color } as React.CSSProperties}
                >
                  <div className="idea-card-top">
                    <a className="idea-card-author" href={`#/ideas/${idea.id}`}>
                      <img src={ideaImage(idea.id)} alt="" width="60" height="60" loading="lazy" />
                      <span>
                        <strong>{idea.author}</strong>
                        <small>{t(`ideaTheme_${idea.theme}`)}</small>
                      </span>
                    </a>
                    <button
                      className="idea-bookmark"
                      aria-pressed={savedIdeas.includes(idea.id)}
                      aria-label={`${t(savedIdeas.includes(idea.id) ? 'removeIdea' : 'saveIdea')}: ${idea.author}`}
                      onClick={() => toggleIdea(idea.id)}
                    >
                      <Bookmark
                        size={17}
                        fill={savedIdeas.includes(idea.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                  <blockquote>{idea.text[lang].quote}</blockquote>
                  <span className="idea-translation">
                    {t(lang === 'en' ? 'originalExcerpt' : 'translatedExcerpt')}
                  </span>
                  <a className="idea-card-link" href={`#/ideas/${idea.id}`}>
                    {t('behindIdea')}
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('noIdeas')}
            description={t('noIdeasSub')}
            action={
              <Button
                onClick={() => {
                  setTheme('all');
                  setSavedOnly(false);
                  setQuery('');
                }}
              >
                {t('resetIdeaFilters')}
              </Button>
            }
          />
        )}
      </section>
      <NotebookInvite />
    </div>
  );
}

export function NotebookInvite() {
  const { t } = useSunset();
  return (
    <a className="notebook-invite" href="#/notebook">
      <span className="notebook-invite-icon">
        <NotebookPen size={34} strokeWidth={1.1} />
      </span>
      <div>
        <span className="eyebrow">{t('ideaToAction')}</span>
        <h2>{t('notebookInvite')}</h2>
        <p>{t('notebookInviteSub')}</p>
      </div>
      <ArrowUpRight size={28} strokeWidth={1.2} />
    </a>
  );
}
