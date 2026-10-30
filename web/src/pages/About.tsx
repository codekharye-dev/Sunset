import { ArrowUpRight, Heart, Sparkles, Sun, ArrowRight, Asterisk } from 'lucide-react';
import { useSunset } from '@/lib/state';
import { asset } from '@/lib/content';
import { Reveal } from '@/components/common';
import { Newsletter } from '@/components/layout';
import { Button } from '@/components/ui/button';
export default function About() {
  const { t } = useSunset();
  return (
    <div className="shell page-padding about-page">
      <header className="about-hero">
        <div>
          <span className="eyebrow">SUNSET / {t('aboutNav')}</span>
          <h1 dangerouslySetInnerHTML={{ __html: t('aboutTitle') }} />
          <p>{t('aboutIntro')}</p>
          <Button asChild variant="primary">
            <a href="#/discover">
              {t('browse')}
              <ArrowUpRight size={18} />
            </a>
          </Button>
        </div>
        <div className="about-art">
          <img src={asset('sunset')} alt={t('sample')} />
          <span className="about-art-sticker">
            <Sun size={45} />
          </span>
          <span className="about-art-note">{t('curious')}</span>
        </div>
      </header>
      <Reveal>
        <section className="about-manifesto">
          <span className="manifesto-star">
            <Asterisk size={40} />
          </span>
          <p>{t('aboutBody')}</p>
          <span className="mono">SUNSET — {t('sampleEdition')}</span>
        </section>
      </Reveal>
      <div className="principles">
        {[Sun, Sparkles, Heart].map((Icon, i) => (
          <Reveal key={i} delay={i * 60}>
            <article>
              <span className="principle-number mono">0{i + 1}</span>
              <Icon size={33} />
              <h2>{t(`principle${i + 1}`)}</h2>
              <p>{t(`principle${i + 1}Body`)}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <section className="editorial-note">
          <span className="eyebrow">{t('editorial')}</span>
          <h2>
            {t('sampleEdition')}
            <span>↗</span>
          </h2>
          <p>{t('sampleContact')}</p>
          <p>{t('principle3Body')}</p>
          <Button asChild>
            <a href="#/preferences">
              {t('settings')}
              <ArrowRight size={16} />
            </a>
          </Button>
        </section>
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
    </div>
  );
}
