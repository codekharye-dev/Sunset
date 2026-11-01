import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Menu,
  X,
  Settings2,
  Sun,
  Moon,
  Heart,
  Newspaper,
  Instagram,
  ArrowUp,
  Mail,
  Command,
} from 'lucide-react';
import { articles, asset, categories } from '@/lib/content';
import { useRoute, useSunset, go } from '@/lib/state';
import { LanguageSwitch, Logo, ThemeSwitch } from './common';
import { Button } from './ui/button';
import NavigationMenuWithActiveItem from './ui/navigation-menu-05';
export function Header() {
  const { t } = useSunset();
  const { path } = useRoute();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearch((s) => !s);
      }
      if (e.key === 'Escape') {
        setMenu((open) => {
          if (open) menuButton.current?.focus();
          return false;
        });
      }
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, []);
  return (
    <>
      {import.meta.env.DEV && (
        <div className="preview-banner">
          <span>
            <i />
            {t('previewBadge')}
          </span>
          <span>{t('previewHint')}</span>
        </div>
      )}
      <header className="site-header">
        <div className="header-inner shell">
          <Logo />
          <NavigationMenuWithActiveItem open={menu} onNavigate={() => setMenu(false)} />
          <div className="header-actions">
            <LanguageSwitch compact />
            <ThemeSwitch />
            <button
              className="icon-button search-trigger"
              onClick={() => setSearch(true)}
              aria-label={t('search')}
            >
              <Search size={18} />
              <kbd aria-hidden="true">⌘ K</kbd>
            </button>
            <a
              className="icon-button settings-link"
              href="#/preferences"
              aria-label={t('settings')}
              aria-current={path === '/preferences' ? 'page' : undefined}
            >
              <Settings2 size={18} />
            </a>
            <button
              ref={menuButton}
              className="icon-button menu-trigger"
              onClick={() => setMenu((s) => !s)}
              aria-label={t('menu')}
              aria-controls="main-nav"
              aria-expanded={menu}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      {menu && <div className="menu-scrim" onClick={() => setMenu(false)} />}
      {search && <SearchDialog onClose={() => setSearch(false)} />}
    </>
  );
}
function SearchDialog({ onClose }: { onClose: () => void }) {
  const { lang, t } = useSunset();
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    input.current?.focus();
    return () => d?.close();
  }, []);
  const matches = query.trim()
    ? articles
        .filter((a) =>
          `${a.text[lang].title} ${a.text[lang].excerpt} ${t(a.category)}`
            .toLocaleLowerCase(lang)
            .includes(query.trim().toLocaleLowerCase(lang)),
        )
        .slice(0, 5)
    : articles.slice(0, 4);
  function follow(path: string) {
    onClose();
    go(path);
  }
  return (
    <dialog
      className="search-dialog"
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="search-title"
    >
      <div className="search-dialog-top">
        <Search size={21} />
        <h2 className="sr-only" id="search-title">
          {t('search')}
        </h2>
        <input
          ref={input}
          placeholder={t('searchInline')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') follow(`/discover?q=${encodeURIComponent(query)}`);
          }}
        />
        <button className="icon-button" onClick={onClose} aria-label={t('close')}>
          <X size={19} />
        </button>
      </div>
      <div className="search-results">
        <span className="eyebrow">{t(query.trim() ? 'resultsFor' : 'featured')}</span>
        {matches.length ? (
          matches.map((a) => (
            <button key={a.id} onClick={() => follow(`/story/${a.id}`)}>
              <img src={asset(a.image)} alt="" />
              <span>
                <small>{t(a.category)}</small>
                <strong>{a.text[lang].title}</strong>
              </span>
              <ArrowUpRight size={18} />
            </button>
          ))
        ) : (
          <p className="search-none">{t('noResults')}</p>
        )}
      </div>
      <div className="search-bottom">
        <span>
          <Command size={13} /> K <span>·</span> ESC
        </span>
        <button onClick={() => follow(`/discover?q=${encodeURIComponent(query)}`)}>
          {t('viewAll')}
          <ArrowRight size={14} />
        </button>
      </div>
    </dialog>
  );
}
export function TopicBar() {
  const { t } = useSunset();
  const { path } = useRoute();
  return (
    <div className="topic-bar shell">
      <nav aria-label={t('topics')}>
        {categories.map((c) => (
          <a
            href={`#/topic/${c}`}
            key={c}
            aria-current={path === `/topic/${c}` ? 'page' : undefined}
          >
            {t(c)}
          </a>
        ))}
      </nav>
      <span className="edition-dot">
        <i />
        {t('sampleEdition')}
      </span>
    </div>
  );
}
export function Newsletter() {
  const { subscribed, setSubscribed, t, notify } = useSunset();
  const [email, setEmail] = useState('');
  return (
    <section className="newsletter-block">
      <div className="newsletter-symbol">
        <Mail size={48} />
        <span>✦</span>
      </div>
      <div className="newsletter-copy">
        <span className="eyebrow">{t('newsletterEyebrow')}</span>
        <h2 dangerouslySetInnerHTML={{ __html: t('newsletterTitle') }} />
        <p>{t('newsletterDescription')}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubscribed(!subscribed);
          setEmail('');
          notify(t(subscribed ? 'unsubscribeToast' : 'subscribedToast'));
        }}
      >
        <label htmlFor="newsletter-email">{subscribed ? t('subscribed') : t('email')}</label>
        <div className="newsletter-field">
          {!subscribed && (
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
            />
          )}
          <Button variant="primary" type="submit">
            {t(subscribed ? 'unsubscribe' : 'subscribe')}
            <ArrowUpRight size={16} />
          </Button>
        </div>
        <small>{t('demoNote')}</small>
      </form>
    </section>
  );
}
const marker =
  'M160 85C90 52 52 104 115 140C182 180 118 236 44 203M219 98C180 224 220 247 284 121L307 90C262 217 282 225 326 197M348 207L391 86 361 171C449 44 501 73 451 176C432 217 461 222 495 193M621 84C554 56 516 104 575 141C646 184 576 236 513 205M651 151C760 149 778 62 718 82C645 106 623 249 729 203M840 28L775 182C750 242 814 223 856 187M773 102L901 92';
export function Footer() {
  const { t, notify } = useSunset();
  return (
    <footer className="site-footer">
      <div className="footer-columns shell">
        <div>
          <span className="footer-label">{t('sections')}</span>
          <div className="footer-links">
            {categories.map((c) => (
              <a key={c} href={`#/topic/${c}`}>
                {t(c)}
                <ArrowUpRight size={17} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <span className="footer-label">{t('editorial')}</span>
          <p className="footer-address" dangerouslySetInnerHTML={{ __html: t('address') }} />
          <a className="wavy-link" href="#/about">
            {t('learnMore')}
            <ArrowUpRight size={15} />
          </a>
          <div className="footer-extra-links">
            <a href="#/ideas">
              {t('inspiration')} <ArrowUpRight size={14} />
            </a>
            <a href="#/notebook">
              {t('notebook')} <ArrowUpRight size={14} />
            </a>
            <a href="#/collections">
              {t('collections')} <ArrowUpRight size={14} />
            </a>
            <a href="#/daily">
              {t('daily')} <ArrowUpRight size={14} />
            </a>
          </div>
          <small className="footer-sample-note">{t('sample')}</small>
        </div>
        <div>
          <span className="footer-label">{t('contact')}</span>
          <button className="footer-email" onClick={() => notify(t('sampleContact'))}>
            salam@sunset.example
            <ArrowUpRight size={17} />
          </button>
          <LanguageSwitch />
          <div className="social-buttons">
            <button aria-label="LinkedIn" onClick={() => notify(t('socialText'))}>
              in
            </button>
            <button aria-label="Instagram" onClick={() => notify(t('socialText'))}>
              <Instagram size={18} />
            </button>
            <button aria-label="TikTok" onClick={() => notify(t('socialText'))}>
              ♪
            </button>
          </div>
        </div>
      </div>
      <div className="footer-canvas">
        <svg className="footer-marker" viewBox="0 0 1000 300" aria-label="sunset" role="img">
          <path
            d={marker}
            fill="none"
            stroke="currentColor"
            strokeWidth="29"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sticker sticker-sun">
          <Sun />
        </span>
        <span className="sticker sticker-moon">
          <Moon />
        </span>
        <span className="sticker sticker-new">{t('new')}</span>
        <span className="sticker sticker-heart">
          <Heart fill="currentColor" />
        </span>
        <span className="sticker sticker-hello">{t('hello')}</span>
        <span className="sticker sticker-paper">
          <Newspaper />
        </span>
        <a className="credit-pill" href="#/about">
          {t('credits')}
          <ArrowUpRight size={12} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>{t('footer')}</span>
        <span>{t('footerMotto')}</span>
      </div>
    </footer>
  );
}
export function ScrollTop() {
  const [show, setShow] = useState(false);
  const { t, reduced } = useSunset();
  useEffect(() => {
    const fn = () => setShow(scrollY > 600);
    addEventListener('scroll', fn, { passive: true });
    return () => removeEventListener('scroll', fn);
  }, []);
  return (
    show && (
      <button
        className="scroll-top icon-button"
        onClick={() => scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })}
        aria-label={t('backTop')}
      >
        <ArrowUp size={18} />
      </button>
    )
  );
}
