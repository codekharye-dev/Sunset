import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Download, NotebookPen, Trash2 } from 'lucide-react';
import { ideas, ideaImage } from '@/lib/ideas';
import { useSunset } from '@/lib/state';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';

export default function Notebook({ ideaId }: { ideaId?: string }) {
  const { t, lang, reflections, setReflections, savedIdeas } = useSunset();
  const [confirm, setConfirm] = useState(false);
  const selected = ideas.find((idea) => idea.id === ideaId) ?? ideas[0];
  const text = reflections[selected.id] ?? '';
  const count = Object.values(reflections).filter((text) => text.trim()).length;
  function download() {
    const body = [
      t('notebook'),
      '',
      ...ideas
        .filter((idea) => reflections[idea.id]?.trim())
        .map(
          (idea) =>
            `${idea.author}\n“${idea.text[lang].quote}”\n${idea.source.url}\n\n${reflections[idea.id]}\n\n———\n`,
        ),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sunset-notebook.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="shell page-padding notebook-page">
      <a href="#/ideas" className="back-link">
        <ArrowLeft size={15} />
        {t('ideasLibrary')}
      </a>
      <div className="page-hero">
        <span className="eyebrow">
          <NotebookPen size={14} />
          {t('ideaToAction')}
        </span>
        <h1>
          {t('notebookTitle')}
          <span className="heading-period">.</span>
        </h1>
        <p>{t('notebookSub')}</p>
      </div>
      <div className="notebook-layout">
        <aside className="notebook-sidebar">
          <div className="notebook-sidebar-heading">
            <span className="eyebrow">{t('chooseVoice')}</span>
            <span className="mono">{count} / 05</span>
          </div>
          <nav aria-label={t('chooseVoice')}>
            {ideas.map((idea) => (
              <a
                key={idea.id}
                className="notebook-author"
                href={`#/notebook?idea=${idea.id}`}
                aria-current={selected.id === idea.id ? 'page' : undefined}
              >
                <img src={ideaImage(idea.id)} alt="" width="43" height="43" />
                <span>
                  <strong>{idea.author}</strong>
                  <small>
                    {t(`ideaTheme_${idea.theme}`)}
                    {savedIdeas.includes(idea.id) ? ` · ${t('savedIdeaShort')}` : ''}
                  </small>
                </span>
                {reflections[idea.id]?.trim() && <Check size={14} />}
              </a>
            ))}
          </nav>
          <Button className="notebook-download" onClick={download} disabled={count === 0}>
            <Download size={16} />
            {t('downloadNotes')}
          </Button>
        </aside>
        <section className="notebook-editor" aria-labelledby="notebook-question">
          <div className="notebook-editor-top">
            <span className="mono">
              {t('yourPage')} / {String(ideas.indexOf(selected) + 1).padStart(2, '0')}
            </span>
            <a href={`#/ideas/${selected.id}`}>
              {t('behindIdea')}
              <ArrowUpRight size={14} />
            </a>
          </div>
          <figure>
            <blockquote>{selected.text[lang].quote}</blockquote>
            <figcaption>— {selected.author}</figcaption>
          </figure>
          <label htmlFor="reflection-text" id="notebook-question">
            {selected.text[lang].question}
          </label>
          <textarea
            id="reflection-text"
            key={selected.id}
            maxLength={2000}
            value={text}
            onChange={(e) => setReflections((old) => ({ ...old, [selected.id]: e.target.value }))}
            placeholder={t('reflectionPlaceholder')}
            rows={8}
          />
          <div className="notebook-editor-foot">
            <span>{text.length} / 2000</span>
            <button disabled={!text} onClick={() => setConfirm(true)}>
              <Trash2 size={13} />
              {t('clearReflection')}
            </button>
          </div>
          <p className="notebook-storage-note">
            <Check size={13} />
            {t('notesStorage')}
          </p>
        </section>
      </div>
      <div className="notebook-next">
        <span>{t('letIdeaRest')}</span>
        <Button asChild variant="ghost">
          <a href="#/daily">
            {t('backToReading')}
            <ArrowUpRight size={16} />
          </a>
        </Button>
      </div>
      {confirm && (
        <ConfirmDialog
          message={t('clearReflectionConfirm')}
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            setReflections((old) => {
              const next = { ...old };
              delete next[selected.id];
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
