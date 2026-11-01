import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  ArrowDown,
  Clock3,
  Asterisk,
  Layers3,
  Sunrise,
} from 'lucide-react';
import { articles, asset, categories, dateLabel } from '@/lib/content';
import { useSunset } from '@/lib/state';
import { TiltedGridHero } from '@/components/ui/tilted-grid-hero';
import { Button } from '@/components/ui/button';
import { ActionLink, Reveal, SectionTitle, StoryCard, CategoryIcon } from '@/components/common';
import { Newsletter } from '@/components/layout';
const images = articles.slice(0, 7).map((a) => ({ src: asset(a.image) }));
export default function Home() {
  const { t, lang, motion, setMotion, reduced, systemReduced, history } = useSunset();
  const featured = articles[0];
  const recent = articles.find((a) => history[a.id]?.progress > 0 && !history[a.id]?.completed);
  return (
    <>
      <section className="home-hero shell">
        <div className="hero-topline">
          <span className="eyebrow">
            <span className="little-line" />
            {t('heroTop')}
          </span>
          <span className="mono hero-edition">
            {t('edition')} <span>—</span> 30.10.2026
          </span>
        </div>
        <div className="hero-copy">
          <div>
            <h1 dangerouslySetInnerHTML={{ __html: t('heroNew') }} />
            <div className="hero-actions">
              <Button asChild variant="primary">
                <a href="#/discover">
                  {t('browse')}
                  <ArrowUpRight size={18} />
                </a>
              </Button>
              <Button asChild>
                <a href="#/about">
                  {t('learnMore')}
                  <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          </div>
          <div className="hero-side">
            <div className="mini-sunset" aria-hidden="true">
              <span />
              <i />
              <Sparkles />
            </div>
            <p>{t('heroSub')}</p>
            <span className="mono">
              <i className="tiny-dot" />
              {articles.length} {t('totalStories')}
            </span>
          </div>
        </div>
      </section>
      <section className="ribbon-section" aria-label={t('featured')}>
        <TiltedGridHero
          images={images}
          speed={5}
          tileHeight={58}
          aspectRatio={1.55}
          gap={8}
          curve={62}
          axis={50}
          fade={12}
          className="ribbon"
        />
        <div className="ribbon-caption shell">
          <span className="mono">
            {t('takeMoment')}
            <ArrowDown size={13} />
          </span>
          <button
            className="motion-control"
            disabled={systemReduced}
            title={systemReduced ? t('systemMotion') : undefined}
            onClick={() => setMotion(!motion)}
            aria-label={t(reduced ? 'play' : 'pause')}
            aria-pressed={!reduced}
          >
            {reduced ? <Play size={13} /> : <Pause size={13} />}
            <span>{t(reduced ? 'play' : 'pause')}</span>
          </button>
        </div>
      </section>
      <div className="shell home-content">
        {recent && (
          <Reveal>
            <a className="continue-banner" href={`#/story/${recent.id}?resume=1`}>
              <span className="continue-icon">
                <Clock3 size={19} />
              </span>
              <span>
                <small>{t('continueReading')}</small>
                <strong>{recent.text[lang].title}</strong>
              </span>
              <span className="continue-progress">
                {Math.round(history[recent.id].progress * 100)}%
              </span>
              <ArrowUpRight size={19} />
            </a>
          </Reveal>
        )}
        <Reveal>
          <section className="featured-story">
            <a className="feature-art" href={`#/story/${featured.id}`}>
              <img
                src={asset(featured.image)}
                alt={featured.text[lang].title}
                width="960"
                height="720"
              />
              <span className="feature-ribbon">
                <Sparkles size={13} />
                {t('featured')}
              </span>
              <span className="feature-caption mono">
                {t('perspective')}
                <ArrowUpRight size={15} />
              </span>
            </a>
            <div className="feature-copy">
              <span className="eyebrow">{t('featuredLabel')}</span>
              <div className="feature-category">
                <a href="#/topic/society" className="category-tag society">
                  {t('society')}
                </a>
                <span className="sample-text">{t('sample')}</span>
              </div>
              <h2>
                <a href={`#/story/${featured.id}`}>{featured.text[lang].title}</a>
              </h2>
              <p>{featured.text[lang].excerpt}</p>
              <div className="feature-byline">
                <span className="avatar">S</span>
                <span>
                  <strong>{t('author')}</strong>
                  <small>
                    {dateLabel(featured.date, lang)} · {featured.time} {t('readTime')}
                  </small>
                </span>
                <a
                  className="circle-link"
                  href={`#/story/${featured.id}`}
                  aria-label={t('readStory')}
                >
                  <ArrowUpRight size={21} />
                </a>
              </div>
            </div>
          </section>
        </Reveal>
        <section className="section latest-section">
          <Reveal>
            <SectionTitle
              eyebrow={t('trending')}
              title={t('latest')}
              description={t('latestSub')}
              action={<ActionLink href="#/discover">{t('viewAll')}</ActionLink>}
            />
          </Reveal>
          <div className="story-grid">
            {articles.slice(1, 7).map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 60}>
                <StoryCard article={a} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
        <Reveal>
          <section className="quick-section">
            <div className="quick-heading">
              <span className="quick-spark">
                <Asterisk size={33} />
              </span>
              <span className="eyebrow">{t('quickReads')}</span>
              <h2>{t('quickSub')}</h2>
              <a href="#/discover?sort=short" className="mono">
                {t('viewAll')}
                <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="quick-list">
              {articles
                .filter((a) => a.time <= 3)
                .slice(0, 3)
                .map((a, i) => (
                  <a href={`#/story/${a.id}`} key={a.id}>
                    <span className="quick-number">0{i + 1}</span>
                    <span>
                      <small>
                        {t(a.category)} <i>·</i> {a.time} {t('readTime')}
                      </small>
                      <strong>{a.text[lang].title}</strong>
                    </span>
                    <ArrowUpRight size={20} />
                  </a>
                ))}
            </div>
          </section>
        </Reveal>
        <section className="section topic-section">
          <Reveal>
            <SectionTitle
              eyebrow={t('topics')}
              title={t('browseTopics')}
              description={t('topicSub')}
            />
          </Reveal>
          <div className="topic-tiles">
            {categories.map((c, i) => (
              <Reveal delay={i * 50} key={c}>
                <a className={`topic-tile ${c}`} href={`#/topic/${c}`}>
                  <span className="topic-glyph">
                    <CategoryIcon category={c} />
                  </span>
                  <span className="topic-tile-name">{t(c)}</span>
                  <span className="topic-tile-foot">
                    <span>
                      {String(articles.filter((a) => a.category === c).length).padStart(2, '0')}{' '}
                      {t('totalStories')}
                    </span>
                    <ArrowUpRight size={17} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="section discovery-section">
          <Reveal>
            <SectionTitle eyebrow={t('exploreMore')} title={t('exploreMoreTitle')} />
          </Reveal>
          <div className="discovery-grid">
            <Reveal>
              <a className="discovery-card discovery-collections" href="#/collections">
                <div className="discovery-card-top">
                  <Layers3 size={30} strokeWidth={1.2} />
                  <span className="mono">01 / SUNSET</span>
                </div>
                <h3>{t('collections')}</h3>
                <p>{t('collectionsTeaser')}</p>
                <span className="discovery-card-link">
                  {t('viewCollections')}
                  <ArrowUpRight size={19} />
                </span>
              </a>
            </Reveal>
            <Reveal delay={60}>
              <a className="discovery-card discovery-daily" href="#/daily">
                <div className="discovery-card-top">
                  <Sunrise size={32} strokeWidth={1.2} />
                  <span className="mono">05 · 10 · 15</span>
                </div>
                <h3>{t('daily')}</h3>
                <p>{t('dailyTeaser')}</p>
                <span className="discovery-card-link">
                  {t('buildPause')}
                  <ArrowUpRight size={19} />
                </span>
              </a>
            </Reveal>
          </div>
        </section>
        <Reveal>
          <Newsletter />
        </Reveal>
      </div>
    </>
  );
}
