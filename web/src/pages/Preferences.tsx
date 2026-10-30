import { useState } from 'react';
import {
  Check,
  Moon,
  Sun,
  Globe2,
  Wind,
  Type,
  Bookmark,
  ArrowUpRight,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useSunset } from '@/lib/state';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
export default function Preferences() {
  const {
    t,
    lang,
    setLang,
    theme,
    setTheme,
    motion,
    setMotion,
    reduced,
    systemReduced,
    size,
    setSize,
    saved,
    history,
    setHistory,
    notify,
  } = useSunset();
  const [confirm, setConfirm] = useState<'prefs' | 'history' | null>(null);
  return (
    <div className="shell page-padding preferences-page">
      <div className="page-hero">
        <span className="eyebrow">SUNSET / {t('settings')}</span>
        <h1>{t('settingsTitle')}</h1>
        <p>{t('settingsSub')}</p>
      </div>
      <div className="preferences-layout">
        <aside className="preference-sidebar">
          <span className="preference-art">
            <Sun size={65} />
            <Moon size={35} />
          </span>
          <h2>{t('preferences')}</h2>
          <p>{t('localHelp')}</p>
          <a href="#/saved">
            {t('list')}
            <ArrowUpRight size={16} />
          </a>
        </aside>
        <div className="preference-panels">
          <section className="preference-panel">
            <h2>
              <Sun size={19} />
              {t('appearance')}
            </h2>
            <div className="theme-options">
              {(['dark', 'light'] as const).map((mode) => (
                <button
                  key={mode}
                  className={`theme-option option-${mode}`}
                  aria-pressed={theme === mode}
                  onClick={() => setTheme(mode)}
                >
                  <span className="theme-option-preview">
                    <i />
                    <i />
                    <i />
                    {mode === 'dark' ? <Moon size={23} /> : <Sun size={23} />}
                  </span>
                  <span>
                    {t(mode)}
                    {theme === mode && <Check size={15} />}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="preference-panel">
            <h2>
              <Globe2 size={19} />
              {t('languageLabel')}
            </h2>
            <div className="language-options">
              {(['az', 'en', 'tr'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}>
                  <span>{l.toUpperCase()}</span>
                  <strong>{{ az: 'Azərbaycanca', en: 'English', tr: 'Türkçe' }[l]}</strong>
                  {lang === l && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>
          <section className="preference-panel">
            <h2>
              <Wind size={19} />
              {t('motionLabel')}
            </h2>
            <div className="motion-setting">
              <div>
                <strong>{t(reduced ? 'motionOff' : 'motionOn')}</strong>
                <p>{t(systemReduced ? 'systemMotion' : 'motionHelp')}</p>
              </div>
              <button
                className="toggle-switch"
                role="switch"
                aria-label={t('motionLabel')}
                aria-checked={motion}
                onClick={() => setMotion(!motion)}
              >
                <i />
              </button>
            </div>
          </section>
          <section className="preference-panel">
            <h2>
              <Type size={19} />
              {t('readerSize')}
            </h2>
            <div className="font-range">
              <span>Aa</span>
              <input
                type="range"
                aria-label={t('readerSize')}
                min={16}
                max={25}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
              <strong>Aa</strong>
              <span className="mono">{size}px</span>
            </div>
            <p className="font-preview" style={{ fontSize: size }}>
              {t('previewText')}
            </p>
          </section>
          <section className="preference-panel">
            <h2>
              <Bookmark size={19} />
              {t('localData')}
            </h2>
            <p>{t('localHelp')}</p>
            <div className="data-counts">
              <span>
                {saved.length} {t('savedUnit')}
              </span>
              <span>
                {Object.keys(history).length} {t('readUnit')}
              </span>
            </div>
            <div className="preference-reset">
              <Button size="sm" onClick={() => setConfirm('prefs')}>
                <RotateCcw size={14} />
                {t('resetPrefs')}
              </Button>
              <Button size="sm" onClick={() => setConfirm('history')}>
                <Trash2 size={14} />
                {t('clearRead')}
              </Button>
            </div>
          </section>
        </div>
      </div>
      {confirm && (
        <ConfirmDialog
          message={t(confirm === 'prefs' ? 'resetConfirm' : 'historyConfirm')}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm === 'history') setHistory({});
            else {
              setLang('az');
              setTheme('dark');
              setMotion(true);
              setSize(19);
            }
            notify(t('updated'));
          }}
        />
      )}
    </div>
  );
}
