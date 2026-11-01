import { Bookmark, Compass, Home, Layers3, Sunrise, Lightbulb } from 'lucide-react';
import { useRoute, useSunset } from '@/lib/state';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './navigation-menu';

export default function NavigationMenuWithActiveItem({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const { t, saved } = useSunset();
  const { path } = useRoute();
  const items = [
    { title: t('home'), href: '/', icon: Home, active: path === '/' },
    {
      title: t('explore'),
      href: '/discover',
      icon: Compass,
      active: path === '/discover' || path.startsWith('/topic/') || path.startsWith('/story/'),
    },
    {
      title: t('collections'),
      href: '/collections',
      icon: Layers3,
      active: path.startsWith('/collections'),
    },
    {
      title: t('inspiration'),
      href: '/ideas',
      icon: Lightbulb,
      active: path.startsWith('/ideas') || path === '/notebook',
    },
    { title: t('daily'), href: '/daily', icon: Sunrise, active: path === '/daily' },
    { title: t('list'), href: '/saved', icon: Bookmark, active: path === '/saved' },
  ];
  return (
    <NavigationMenu
      className={cn('main-nav', open && 'open')}
      id="main-nav"
      aria-label={t('sections')}
    >
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild active={item.active}>
              <a href={`#${item.href}`} className="navigation-link" onClick={onNavigate}>
                <item.icon size={16} strokeWidth={1.6} aria-hidden="true" />
                <span>{item.title}</span>
                {item.href === '/saved' && saved.length > 0 && (
                  <span className="nav-count">{saved.length}</span>
                )}
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <a className="mobile-about-link mobile-notebook-link" href="#/notebook" onClick={onNavigate}>
        {t('notebook')}
      </a>
      <a className="mobile-about-link" href="#/about" onClick={onNavigate}>
        {t('aboutNav')}
      </a>
    </NavigationMenu>
  );
}
