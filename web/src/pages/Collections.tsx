import { ArrowLeft, ArrowUpRight, ArrowRight, Clock3, Layers3 } from 'lucide-react';
import { asset } from '@/lib/content';
import { collections, collectionStories } from '@/lib/collections';
import { useSunset } from '@/lib/state';
import { EmptyState, Reveal, StoryCard } from '@/components/common';
import { Button } from '@/components/ui/button';

export default function Collections({ id }: { id?: string }) {
  const { t } = useSunset();
  const collection = collections.find((item) => item.id === id);
  if (id && !collection)
    return (
      <div className="shell page-padding">
        <EmptyState
          title={t('notFound')}
          description={t('notFoundSub')}
          action={
            <Button asChild>
              <a href="#/collections">
                {t('collections')}
                <ArrowRight size={16} />
              </a>
            </Button>
          }
        />
      </div>
    );
  if (collection) {
    const stories = collectionStories(collection.id);
    return (
      <div className="shell page-padding collection-detail">
        <a className="back-link" href="#/collections">
          <ArrowLeft size={15} />
          {t('allCollections')}
        </a>
        <section className={`collection-detail-hero collection-tone-${collection.tone}`}>
          <div>
            <span className="eyebrow">
              <Layers3 size={14} />
              {t('curatedCollection')}
            </span>
            <h1>{t(collection.title)}</h1>
            <p>{t(collection.description)}</p>
            <div className="collection-meta">
              <span>
                {stories.length} {t('totalStories')}
              </span>
              <span>
                <Clock3 size={14} />
                {stories.reduce((sum, a) => sum + a.time, 0)} {t('readTime')}
              </span>
            </div>
            <Button asChild variant="primary">
              <a href={`#/story/${stories[0].id}`}>
                {t('startCollection')}
                <ArrowUpRight size={17} />
              </a>
            </Button>
          </div>
          <img src={asset(collection.image)} alt="" width="960" height="720" />
        </section>
        <div className="collection-section-label">
          <span className="eyebrow">{t('insideCollection')}</span>
          <span className="mono">01 — {String(stories.length).padStart(2, '0')}</span>
        </div>
        <div className="story-grid">
          {stories.map((a, i) => (
            <Reveal key={a.id} delay={i * 45}>
              <StoryCard article={a} />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="shell page-padding collections-page">
      <div className="page-hero collection-page-heading">
        <span className="eyebrow">
          <span className="little-line" />
          {t('curatedCollection')}
        </span>
        <h1>
          {t('collectionsTitle')}
          <span className="heading-period">.</span>
        </h1>
        <p>{t('collectionsSub')}</p>
        <Layers3
          className="collection-heading-icon"
          size={85}
          strokeWidth={0.75}
          aria-hidden="true"
        />
      </div>
      <div className="collection-grid">
        {collections.map((collection, i) => {
          const stories = collectionStories(collection.id);
          return (
            <Reveal key={collection.id} delay={(i % 2) * 70}>
              <a
                className={`collection-card collection-tone-${collection.tone}`}
                href={`#/collections/${collection.id}`}
              >
                <div className="collection-card-art">
                  <img
                    src={asset(collection.image)}
                    alt=""
                    loading="lazy"
                    width="960"
                    height="720"
                  />
                  <span className="collection-index mono">SUNSET SELECTION / 0{i + 1}</span>
                  <span className="collection-open">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <div className="collection-card-copy">
                  <div className="collection-meta">
                    <span>
                      {stories.length} {t('totalStories')}
                    </span>
                    <span>
                      {stories.reduce((sum, a) => sum + a.time, 0)} {t('readTime')}
                    </span>
                  </div>
                  <h2>{t(collection.title)}</h2>
                  <p>{t(collection.description)}</p>
                  <span className="collection-card-link">
                    {t('openCollection')}
                    <ArrowRight size={17} />
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
      <Reveal>
        <a className="collection-bottom-note" href="#/daily">
          <span className="daily-small-sun">
            <Clock3 size={24} strokeWidth={1.4} />
          </span>
          <span>
            <strong>{t('littleTime')}</strong>
            <small>{t('littleTimeSub')}</small>
          </span>
          <ArrowUpRight size={22} />
        </a>
      </Reveal>
    </div>
  );
}
