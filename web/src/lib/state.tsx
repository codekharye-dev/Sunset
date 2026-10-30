import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { articles, locales } from './content';
import type { Lang } from './content';
export interface Reading {
  progress: number;
  openedAt: number;
  completed: boolean;
}
type History = Record<string, Reading>;
export function readStorage<T>(key: string, fallback: T, validate: (v: unknown) => v is T): T {
  try {
    const current = localStorage.getItem(`sunset.v2.${key}`);
    // An explicit empty list in v2 must never revive archived v1 entries.
    if (current !== null) {
      try {
        const value = JSON.parse(current);
        return validate(value) ? value : fallback;
      } catch {
        return fallback;
      }
    }
    const legacyKey = key === 'size' ? 'readerSize' : key;
    if (key === 'history') {
      const old = JSON.parse(localStorage.getItem('sunset.read') || '[]');
      if (Array.isArray(old)) {
        const migrated = Object.fromEntries(
          old
            .filter((id) => typeof id === 'string' && articles.some((a) => a.id === id))
            .map((id) => [id, { progress: 1, completed: true, openedAt: 0 }]),
        );
        return validate(migrated) ? migrated : fallback;
      }
      return fallback;
    }
    const raw = localStorage.getItem(`sunset.${legacyKey}`);
    if (raw === null) return fallback;
    const value = key === 'theme' && (raw === 'light' || raw === 'dark') ? raw : JSON.parse(raw);
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
function useLocal<T>(key: string, initial: T, validate: (v: unknown) => v is T) {
  const [state, setState] = useState<T>(() => readStorage(key, initial, validate));
  useEffect(() => {
    try {
      localStorage.setItem(`sunset.v2.${key}`, JSON.stringify(state));
    } catch {
      /* Private browsing still works in memory. */
    }
  }, [key, state]);
  return [state, setState] as const;
}
const validIds = new Set(articles.map((a) => a.id));
const isIds = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string' && validIds.has(x));
const isHistory = (v: unknown): v is History =>
  !!v &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.entries(v).every(
    ([id, x]) =>
      validIds.has(id) &&
      x &&
      typeof x.progress === 'number' &&
      Number.isFinite(x.progress) &&
      x.progress >= 0 &&
      x.progress <= 1 &&
      typeof x.completed === 'boolean' &&
      typeof x.openedAt === 'number',
  );
function useAppState() {
  const [lang, setLang] = useLocal<Lang>(
    'language',
    'az',
    (v): v is Lang => v === 'az' || v === 'en' || v === 'tr',
  );
  const [theme, setTheme] = useLocal<'dark' | 'light'>(
    'theme',
    'dark',
    (v): v is 'dark' | 'light' => v === 'dark' || v === 'light',
  );
  const [saved, setSaved] = useLocal<string[]>('saved', [], isIds);
  const [history, setHistory] = useLocal<History>('history', {}, isHistory);
  const [motion, setMotion] = useLocal<boolean>(
    'motion',
    true,
    (v): v is boolean => typeof v === 'boolean',
  );
  const [size, setSize] = useLocal<number>(
    'size',
    19,
    (v): v is number => typeof v === 'number' && v >= 16 && v <= 25,
  );
  const [subscribed, setSubscribed] = useLocal<boolean>(
    'subscribed',
    false,
    (v): v is boolean => typeof v === 'boolean',
  );
  const [systemReduced, setSystemReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [notification, notify] = useState('');
  const t = useCallback((key: string) => locales[lang][key] || key, [lang]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#120e1d' : '#f7f2ec');
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = motion && !systemReduced ? 'on' : 'off';
  }, [motion, systemReduced]);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setSystemReduced(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => notify(''), 3400);
    return () => clearTimeout(timer);
  }, [notification]);
  const toggleSave = useCallback(
    (id: string) => {
      setSaved((old) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]));
    },
    [setSaved],
  );
  const recordReading = useCallback(
    (id: string, progress: number, complete = false) => {
      setHistory((old) => ({
        ...old,
        [id]: {
          progress: Math.max(0, Math.min(1, progress)),
          openedAt: Date.now(),
          completed: complete || old[id]?.completed || false,
        },
      }));
    },
    [setHistory],
  );
  return {
    lang,
    setLang,
    theme,
    setTheme,
    saved,
    setSaved,
    history,
    setHistory,
    motion,
    setMotion,
    reduced: systemReduced || !motion,
    systemReduced,
    size,
    setSize,
    subscribed,
    setSubscribed,
    t,
    toggleSave,
    recordReading,
    notification,
    notify,
  };
}
type State = ReturnType<typeof useAppState>;
const Context = createContext<State | null>(null);
export function StateProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useSunset() {
  const s = useContext(Context);
  if (!s) throw new Error('Missing Sunset provider');
  return s;
}
export function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const change = () => setRoute(location.hash.slice(1) || '/');
    addEventListener('hashchange', change);
    return () => removeEventListener('hashchange', change);
  }, []);
  return useMemo(() => {
    const [path, search = ''] = route.split('?');
    return { path, params: new URLSearchParams(search) };
  }, [route]);
}
export function go(path: string) {
  if (location.hash === `#${path}`) {
    scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  location.hash = path;
}
