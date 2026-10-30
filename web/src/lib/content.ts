import rawArticles from '@/data/articles.json';
import rawLocales from '@/data/locales.json';
export type Lang = 'az' | 'en' | 'tr';
export type Category = 'tech' | 'society' | 'culture' | 'sport' | 'world';
export interface StoryText {
  title: string;
  excerpt: string;
  body: string[];
}
export interface Article {
  id: string;
  category: Category;
  image: string;
  time: number;
  date: string;
  text: Record<Lang, StoryText>;
}
export const articles = rawArticles as Article[];
export const locales = rawLocales as Record<Lang, Record<string, string>>;
export const categories: Category[] = ['tech', 'society', 'culture', 'sport', 'world'];
export const asset = (image: string) => `${import.meta.env.BASE_URL}assets/${image}.svg`;
export function dateLabel(date: string, lang: Lang) {
  const [y, m, d] = date.split('-').map(Number);
  const months = {
    az: [
      'yanvar',
      'fevral',
      'mart',
      'aprel',
      'may',
      'iyun',
      'iyul',
      'avqust',
      'sentyabr',
      'oktyabr',
      'noyabr',
      'dekabr',
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    tr: [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ],
  };
  return `${d} ${months[lang][m - 1]} ${y}`;
}
