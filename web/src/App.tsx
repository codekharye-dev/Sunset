import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { StateProvider, useRoute, useSunset } from '@/lib/state';
import { articles, categories } from '@/lib/content';
import type { Category } from '@/lib/content';
import { Header, Footer, ScrollTop, TopicBar } from '@/components/layout';
import { EmptyState } from '@/components/common';
import { Button } from '@/components/ui/button';
import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import Story from '@/pages/Story';
import Saved from '@/pages/Saved';
import Preferences from '@/pages/Preferences';
import About from '@/pages/About';
import Collections from '@/pages/Collections';
import Daily from '@/pages/Daily';
import Ideas from '@/pages/Ideas';
import Notebook from '@/pages/Notebook';
import { ideas } from '@/lib/ideas';
function Site() {
  const { path, params } = useRoute();
  const { t, notification, lang } = useSunset();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [path]);
  useEffect(() => {
    const name = path.startsWith('/story/')
      ? articles.find((a) => a.id === path.split('/')[2])?.text[lang]?.title || t('readingRoom')
      : path.startsWith('/ideas/')
        ? ideas.find((idea) => idea.id === path.split('/')[2])?.text[lang].title ||
          t('ideasLibrary')
        : path === '/ideas'
          ? t('ideasLibrary')
          : path === '/notebook'
            ? t('notebook')
            : path.startsWith('/collections')
              ? t('collections')
              : path === '/daily'
                ? t('daily')
                : path === '/saved'
                  ? t('list')
                  : path === '/preferences'
                    ? t('settings')
                    : path === '/about'
                      ? t('aboutNav')
                      : path.startsWith('/topic/')
                        ? t(path.split('/')[2])
                        : path === '/discover'
                          ? t('explore')
                          : t('heroTop');
    document.title = `Sunset — ${name}`;
  }, [path, t, lang]);
  let page;
  if (path === '/') page = <Home />;
  else if (path === '/discover') page = <Discover key={params.toString()} />;
  else if (path.startsWith('/topic/') && categories.includes(path.split('/')[2] as Category))
    page = <Discover key={path} topic={path.split('/')[2] as Category} />;
  else if (path.startsWith('/story/')) page = <Story key={path} id={path.split('/')[2]} />;
  else if (path === '/saved') page = <Saved />;
  else if (path === '/preferences') page = <Preferences />;
  else if (path === '/about') page = <About />;
  else if (path === '/collections') page = <Collections />;
  else if (/^\/collections\/[^/]+$/.test(path)) page = <Collections id={path.split('/')[2]} />;
  else if (path === '/daily') page = <Daily />;
  else if (path === '/ideas') page = <Ideas key={params.toString()} />;
  else if (/^\/ideas\/[^/]+$/.test(path)) page = <Ideas id={path.split('/')[2]} />;
  else if (path === '/notebook') page = <Notebook ideaId={params.get('idea') ?? undefined} />;
  else
    page = (
      <div className="shell page-padding">
        <EmptyState
          title={t('notFound')}
          description={t('notFoundSub')}
          action={
            <Button asChild>
              <a href="#/">
                {t('home')}
                <ArrowUpRight size={17} />
              </a>
            </Button>
          }
        />
      </div>
    );
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        {t('skip')}
      </a>
      <Header />
      <TopicBar />
      <main ref={main} tabIndex={-1} id="main" className="page-enter" key={path}>
        {page}
      </main>
      <Footer />
      <ScrollTop />
      <div className={`toast ${notification ? 'show' : ''}`} role="status" aria-live="polite">
        {notification}
      </div>
    </>
  );
}
export default function App() {
  return (
    <StateProvider>
      <Site />
    </StateProvider>
  );
}
