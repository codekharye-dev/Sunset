import { useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  Check,
  Clock3,
  RefreshCw,
  Sunrise,
  Coffee,
  Sparkles,
  Leaf,
} from 'lucide-react';
import { asset } from '@/lib/content';
import { readingPlan } from '@/lib/collections';
import type { Mood } from '@/lib/collections';
import { useSunset } from '@/lib/state';
import { Button } from '@/components/ui/button';

export default function Daily() {
  const { t, lang, saved, setSaved, history, notify } = useSunset();
  const [budget, setBudget] = useState(10);
  const [mood, setMood] = useState<Mood>('balanced');
  const [edition, setEdition] = useState(0);
  const plan = readingPlan(budget, mood, edition);
  const duration = plan.reduce((sum, a) => sum + a.time, 0);
  const allSaved = plan.every((a) => saved.includes(a.id));
  const completed = plan.filter((a) => history[a.id]?.completed).length;
  const moods = [
    { value: 'balanced' as const, label: 'moodBalanced', icon: Coffee },
    { value: 'inspired' as const, label: 'moodInspired', icon: Sparkles },
    { value: 'unwind' as const, label: 'moodUnwind', icon: Leaf },
  ];
  return (
    <div className="shell page-padding daily-page">
      <div className="page-hero daily-page-heading">
        <span className="eyebrow">
          <span className="little-line" />
          {t('dailyEyebrow')}
        </span>
        <h1>
          {t('dailyTitle')}
          <span className="heading-period">.</span>
        </h1>
        <p>{t('dailySub')}</p>
      </div>
      <div className="daily-layout">
        <aside className="daily-controls">
          <div className="daily-sun-art" aria-hidden="true">
            <Sunrise size={66} strokeWidth={0.85} />
            <span>TAKE YOUR TIME</span>
          </div>
          <fieldset>
            <legend>
              <span className="mono">01</span>
              {t('timeQuestion')}
            </legend>
            <div className="budget-options">
              {[5, 10, 15].map((minutes) => (
                <button
                  key={minutes}
                  aria-pressed={budget === minutes}
                  onClick={() => {
                    setBudget(minutes);
                    setEdition(0);
                  }}
                >
                  {minutes}
                  <span>{t('minutesShort')}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span className="mono">02</span>
              {t('moodQuestion')}
            </legend>
            <div className="mood-options">
              {moods.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  aria-pressed={mood === value}
                  onClick={() => {
                    setMood(value);
                    setEdition(0);
                  }}
                >
                  <Icon size={17} strokeWidth={1.5} />
                  {t(label)}
                  <span className="mood-check">{mood === value && <Check size={12} />}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <p className="daily-private-note">{t('dailyNote')}</p>
        </aside>
        <section className="daily-plan" aria-labelledby="plan-title">
          <div className="daily-plan-heading">
            <div>
              <span className="eyebrow">{t('yourPause')}</span>
              <h2 id="plan-title">{t('yourPlan')}</h2>
            </div>
            <span className="plan-duration">
              <Clock3 size={14} />
              {duration} {t('minutesShort')}
            </span>
          </div>
          <div className="plan-progress">
            <span style={{ width: `${(completed / plan.length) * 100}%` }} />
          </div>
          <span className="plan-progress-label">
            {completed} / {plan.length} {t('planCompleted')}
          </span>
          <div
            className="daily-stories"
            key={`${budget}-${mood}-${edition}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {plan.map((a, i) => (
              <a className="daily-story" key={a.id} href={`#/story/${a.id}`}>
                <span
                  className={`daily-story-number ${history[a.id]?.completed ? 'complete' : ''}`}
                >
                  {history[a.id]?.completed ? <Check size={17} /> : String(i + 1).padStart(2, '0')}
                </span>
                <img src={asset(a.image)} alt="" width="120" height="100" />
                <div>
                  <span className="daily-story-meta">
                    {t(a.category)}
                    <span>·</span>
                    {a.time} {t('readTime')}
                  </span>
                  <h3>{a.text[lang].title}</h3>
                  <p>{a.text[lang].excerpt}</p>
                </div>
                <ArrowUpRight className="daily-story-arrow" size={19} />
              </a>
            ))}
          </div>
          <div className="daily-plan-actions">
            <Button asChild variant="primary">
              <a href={`#/story/${plan.find((a) => !history[a.id]?.completed)?.id ?? plan[0].id}`}>
                {t('startReading')}
                <ArrowUpRight size={17} />
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSaved((previous) => [...new Set([...previous, ...plan.map((a) => a.id)])]);
                notify(t('planSaved'));
              }}
              disabled={allSaved}
            >
              {allSaved ? <Check size={16} /> : <Bookmark size={16} />}
              {t(allSaved ? 'planAlreadySaved' : 'savePlan')}
            </Button>
          </div>
          <div className="daily-plan-foot">
            <span>{t('noRush')}</span>
            <button onClick={() => setEdition((value) => value + 1)}>
              <RefreshCw size={13} />
              {t('anotherPlan')}
            </button>
          </div>
        </section>
      </div>
      <a href="#/ideas" className="daily-inspiration-note">
        <Sparkles size={25} strokeWidth={1.1} />
        <span>
          <strong>{t('dailyIdeaTitle')}</strong>
          <small>{t('dailyIdeaSub')}</small>
        </span>
        <ArrowUpRight size={20} />
      </a>
    </div>
  );
}
