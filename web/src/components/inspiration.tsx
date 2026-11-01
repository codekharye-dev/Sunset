import { ArrowUpRight } from 'lucide-react';
import { ideas, ideaImage } from '@/lib/ideas';
import { useSunset } from '@/lib/state';
import { Reveal, SectionTitle } from './common';
import { ScrollReelTestimonials } from './ui/scroll-reel-testimonials';

export function InspirationReel() {
  const { lang, t, reduced, savedIdeas, toggleIdea } = useSunset();
  return (
    <ScrollReelTestimonials
      testimonials={ideas.map((idea) => ({
        quote: idea.text[lang].quote,
        author: idea.author,
        image: ideaImage(idea.id),
        role: idea.text[lang].role,
        source: idea.source,
        href: `#/ideas/${idea.id}`,
        saved: savedIdeas.includes(idea.id),
      }))}
      reducedMotion={reduced}
      onSave={(index) => toggleIdea(ideas[index].id)}
      labels={{
        region: t('inspirationReel'),
        previous: t('previousIdea'),
        next: t('nextIdea'),
        read: t('behindIdea'),
        save: t('saveIdea'),
        saved: t('removeIdea'),
        translation: lang === 'en' ? t('originalExcerpt') : t('translatedExcerpt'),
      }}
    />
  );
}

export function InspirationSection() {
  const { t } = useSunset();
  return (
    <section className="section inspiration-section">
      <Reveal>
        <SectionTitle
          eyebrow={t('inspirationEyebrow')}
          title={t('inspirationTitle')}
          description={t('inspirationSub')}
          action={
            <a className="inspiration-all" href="#/ideas">
              {t('ideasLibrary')}
              <ArrowUpRight size={17} />
            </a>
          }
        />
        <InspirationReel />
      </Reveal>
    </section>
  );
}
