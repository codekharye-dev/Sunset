import { useMemo, useState } from 'react';
import {
  Search,
  X,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Rows3,
  SlidersHorizontal,
} from 'lucide-react';
import { articles, categories } from '@/lib/content';
import type { Category } from '@/lib/content';
import { useRoute, useSunset } from '@/lib/state';
import { StoryCard, EmptyState, CategoryIcon } from '@/components/common';
import { Button } from '@/components/ui/button';
export default function Discover({ topic }: { topic?: Category }) {
  const { t, lang, history, saved } = useSunset();
  const { params } = useRoute();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(topic || '');
  const [sort, setSort] = useState(params.get('sort') || 'editor');
  const [read, setRead] = useState('all');
  const [onlySaved, setOnlySaved] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [page, setPage] = useState(1);
  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(lang);
    const filtered = articles.filter(
      (a) =>
        (!category || a.category === category) &&
        (!onlySaved || saved.includes(a.id)) &&
        (read === 'all' ||
          (read === 'read' ? history[a.id]?.completed : !history[a.id]?.completed)) &&
        `${a.text[lang].title} ${a.text[lang].body.join(' ')} ${t(a.category)}`
          .toLocaleLowerCase(lang)
          .includes(q),
    );
    return sort === 'editor'
      ? filtered
      : filtered.sort((a, b) => (sort === 'short' ? a.time - b.time : b.time - a.time));
  }, [query, category, onlySaved, saved, read, history, lang, sort, t]);
  const pages = Math.max(1, Math.ceil(list.length / 6));
  const current = Math.min(page, pages);
  const change = (fn: () => void) => {
    fn();
    setPage(1);
  };
  function reset() {
    setQuery('');
    setCategory(topic || '');
    setSort('editor');
    setRead('all');
    setOnlySaved(false);
    setPage(1);
  }
  return (
    <div className="shell discover-page page-padding">
      <div className={`page-hero ${topic ? 'topic-page-hero ' + topic : ''}`}>
        <span className="eyebrow">
          {t(topic ? 'topics' : 'explore')} <span>/</span> {t('sampleEdition')}
        </span>
        <h1>{topic ? t(topic) : t('discoverTitle')}</h1>
        <p>{topic ? t('topicSub') : t('discoverSub')}</p>
        {topic && (
          <span className="category-watermark" aria-hidden="true">
            <CategoryIcon category={topic} size={180} />
          </span>
        )}
      </div>
      <div className="discover-search">
        <Search size={20} />
        <input
          aria-label={t('searchLabel')}
          placeholder={t('searchInline')}
          value={query}
          onChange={(e) => change(() => setQuery(e.target.value))}
        />
        {query && (
          <button
            className="icon-button"
            onClick={() => change(() => setQuery(''))}
            aria-label={t('clearSearch')}
          >
            <X size={17} />
          </button>
        )}
        <span className="search-shortcut">⌘ K</span>
      </div>
      <div className="filter-topics" aria-label={t('topics')}>
        <button aria-pressed={!category} onClick={() => change(() => setCategory(''))}>
          {t('allTopics')}
          <span>{articles.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => change(() => setCategory(c))}
          >
            {t(c)}
            <span>{articles.filter((a) => a.category === c).length}</span>
          </button>
        ))}
      </div>
      <div className="filter-toolbar">
        <span className="filter-result" role="status">
          {list.length} {t('totalStories')}
        </span>
        <div className="filters">
          <button
            className="filter-saved"
            aria-pressed={onlySaved}
            onClick={() => change(() => setOnlySaved(!onlySaved))}
          >
            {t('saved')}
            <span>{saved.length}</span>
          </button>
          <label>
            <span className="sr-only">{t('readFilter')}</span>
            <select
              aria-label={t('readFilter')}
              value={read}
              onChange={(e) => change(() => setRead(e.target.value))}
            >
              <option value="all">{t('allRead')}</option>
              <option value="unread">{t('unread')}</option>
              <option value="read">{t('readOnly')}</option>
            </select>
          </label>
          <label>
            <span className="sr-only">{t('sort')}</span>
            <select
              aria-label={t('sort')}
              value={sort}
              onChange={(e) => change(() => setSort(e.target.value))}
            >
              <option value="editor">{t('defaultSort')}</option>
              <option value="short">{t('shortSort')}</option>
              <option value="long">{t('longSort')}</option>
            </select>
          </label>
          <div className="view-switch">
            <button
              aria-label={t('gridView')}
              aria-pressed={layout === 'grid'}
              onClick={() => setLayout('grid')}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label={t('listView')}
              aria-pressed={layout === 'list'}
              onClick={() => setLayout('list')}
            >
              <Rows3 size={18} />
            </button>
          </div>
        </div>
      </div>
      {(query ||
        category !== (topic || '') ||
        onlySaved ||
        read !== 'all' ||
        sort !== 'editor') && (
        <button className="clear-filters" onClick={reset}>
          <X size={12} />
          {t('clear')}
        </button>
      )}
      {list.length ? (
        <>
          <div
            className={`story-grid ${layout === 'list' ? 'list-layout' : ''}`}
            id="discovery-results"
          >
            {list.slice((current - 1) * 6, current * 6).map((a, i) => (
              <StoryCard key={a.id} article={a} compact={layout === 'list'} index={i} />
            ))}
          </div>
          {pages > 1 && (
            <nav className="pagination" aria-label={t('page')}>
              <Button
                aria-label={t('previousPage')}
                disabled={current === 1}
                onClick={() => {
                  setPage(current - 1);
                  document.getElementById('discovery-results')?.scrollIntoView({ block: 'start' });
                }}
              >
                <ArrowLeft size={17} />
              </Button>
              <span className="mono">
                {String(current).padStart(2, '0')} <i>/</i> {String(pages).padStart(2, '0')}
              </span>
              <Button
                aria-label={t('nextPage')}
                disabled={current === pages}
                onClick={() => {
                  setPage(current + 1);
                  document.getElementById('discovery-results')?.scrollIntoView({ block: 'start' });
                }}
              >
                <ArrowRight size={17} />
              </Button>
            </nav>
          )}
        </>
      ) : (
        <EmptyState
          title={t('noResults')}
          description={t('empty')}
          action={
            <Button onClick={reset}>
              <SlidersHorizontal size={15} />
              {t('clear')}
            </Button>
          }
        />
      )}
    </div>
  );
}
