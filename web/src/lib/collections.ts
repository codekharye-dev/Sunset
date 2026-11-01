import { articles } from './content';

export const collections = [
  {
    id: 'slow-living',
    image: 'sunset',
    tone: 'peach',
    title: 'slowCollection',
    description: 'slowCollectionSub',
    ids: ['evening', 'quiet-books', 'digital-break', 'slow-weekend'],
  },
  {
    id: 'future-notes',
    image: 'tech',
    tone: 'lilac',
    title: 'futureCollection',
    description: 'futureCollectionSub',
    ids: ['ai-creativity', 'small-web', 'digital-break'],
  },
  {
    id: 'closer-world',
    image: 'world',
    tone: 'green',
    title: 'worldCollection',
    description: 'worldCollectionSub',
    ids: ['city-stories', 'window-world', 'shared-space', 'green-neighbourhood'],
  },
  {
    id: 'small-rituals',
    image: 'sport',
    tone: 'rose',
    title: 'ritualCollection',
    description: 'ritualCollectionSub',
    ids: ['stretch-break', 'running', 'quiet-books', 'slow-weekend'],
  },
] as const;

export function collectionStories(id: string) {
  const collection = collections.find((item) => item.id === id);
  return collection?.ids.flatMap((id) => articles.filter((article) => article.id === id)) ?? [];
}

export type Mood = 'balanced' | 'inspired' | 'unwind';
const moodOrder: Record<Mood, string[]> = {
  balanced: [
    'stretch-break',
    'ai-creativity',
    'shared-space',
    'city-stories',
    'quiet-books',
    'evening',
  ],
  inspired: ['quiet-books', 'ai-creativity', 'slow-weekend', 'small-web', 'window-world'],
  unwind: ['digital-break', 'evening', 'stretch-break', 'quiet-books', 'green-neighbourhood'],
};

// Rotate the editorial order to offer alternatives while respecting the reader's time.
export function readingPlan(budget: number, mood: Mood, edition: number) {
  const order = moodOrder[mood];
  const offset = edition % order.length;
  const ids = [...order.slice(offset), ...order.slice(0, offset)];
  let remaining = budget;
  return ids.flatMap((id) => {
    const article = articles.find((item) => item.id === id);
    if (!article || article.time > remaining) return [];
    remaining -= article.time;
    return [article];
  });
}
