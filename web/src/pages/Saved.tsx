import { useState } from 'react';
import { Bookmark, Clock3, ArrowUpRight, Trash2 } from 'lucide-react';
import { articles, asset } from '@/lib/content';
import { useSunset } from '@/lib/state';
import { EmptyState, StoryCard, SectionTitle } from '@/components/common';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
export default function Saved() {
  const { t, lang, saved, setSaved, history, savedIdeas } = useSunset();
  const [confirm, setConfirm] = useState(false);
  const list = saved.map((id) => articles.find((a) => a.id === id)!).filter(Boolean);
  const recent = Object.entries(history)
    .sort((a, b) => b[1].openedAt - a[1].openedAt)
    .map(([id, data]) => ({ article: articles.find((a) => a.id === id)!, data }))
    .filter((x) => x.article)
    .slice(0, 4);
  return (
    <div className="shell page-padding saved-page">
      <div className="page-hero">
        <span className="eyebrow">
          <Bookmark size={13} />
          {t('list')}
        </span>
        <h1 dangerouslySetInnerHTML={{ __html: t('listTitle') }} />
        <p>{t('listSub')}</p>
      </div>
      <div className="reading-stats">
        <div>
          <Bookmark size={19} />
          <strong>{saved.length.toString().padStart(2, '0')}</strong>
          <span>{t('savedUnit')}</span>
        </div>
        <div>
          <Clock3 size={19} />
          <strong>{Object.keys(history).length.toString().padStart(2, '0')}</strong>
          <span>{t('readUnit')}</span>
        </div>
        <div>
          <span className="stat-sun">☼</span>
          <strong>{list.reduce((n, a) => n + a.time, 0)}</strong>
          <span>{t('minutes')}</span>
        </div>
      </div>
      <div className="saved-layout">
        <section>
          <div className="saved-heading">
            <h2>
              {t('list')}
              <span>{saved.length}</span>
            </h2>
            {saved.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
                <Trash2 size={14} />
                {t('clearList')}
              </Button>
            )}
          </div>
          {list.length ? (
            <div className="saved-grid">
              {list.map((a) => (
                <StoryCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('emptyTitle')}
              description={t('emptySub')}
              action={
                <Button asChild variant="primary">
                  <a href="#/discover">
                    {t('explore')}
                    <ArrowUpRight size={17} />
                  </a>
                </Button>
              }
            />
          )}
        </section>
        <aside className="recent-sidebar">
          <SectionTitle title={t('recentlyRead')} />
          {recent.length ? (
            recent.map(({ article: a, data }) => (
              <a key={a.id} className="recent-story" href={`#/story/${a.id}?resume=1`}>
                <img src={asset(a.image)} alt="" />
                <div>
                  <strong>{a.text[lang].title}</strong>
                  <small>
                    {data.completed
                      ? t('read')
                      : `${Math.round(data.progress * 100)}% · ${t('continueReading')}`}
                  </small>
                  <span className="mini-progress">
                    <i style={{ width: `${data.progress * 100}%` }} />
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className="muted">{t('emptyTitle')}</p>
          )}
          <a href="#/ideas?saved=1" className="sidebar-link">
            {t('savedIdeas')} ({savedIdeas.length})<ArrowUpRight size={15} />
          </a>
          <a href="#/notebook" className="sidebar-link">
            {t('notebook')}
            <ArrowUpRight size={15} />
          </a>
          <a href="#/preferences" className="sidebar-link">
            {t('settings')}
            <ArrowUpRight size={15} />
          </a>
        </aside>
      </div>
      {confirm && (
        <ConfirmDialog
          message={t('clearConfirm')}
          onConfirm={() => setSaved([])}
          onClose={() => setConfirm(false)}
        />
      )}
    </div>
  );
}
