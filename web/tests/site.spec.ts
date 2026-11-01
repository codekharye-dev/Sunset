import { test, expect } from '@playwright/test';
const errors: string[] = [];
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
});
test.afterEach(() => {
  expect(errors).toEqual([]);
});
test('home and supplied ribbon render complete images, motion can pause', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Gün bitir.');
  await expect(page.locator('.ribbon img').first()).toBeVisible();
  const dimensions = await page
    .locator('.ribbon img')
    .first()
    .evaluate((el: HTMLImageElement) => ({
      width: el.getBoundingClientRect().width,
      natural: el.naturalWidth,
      max: getComputedStyle(el).maxWidth,
    }));
  expect(dimensions.natural).toBeGreaterThan(0);
  expect(dimensions.max).toBe('none');
  expect(dimensions.width).toBeGreaterThan(80);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Animasiyanı dayandır', exact: true }).click();
  await expect(page.locator('.ribbon [class*="tgh-t-"]').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );
  await page.getByRole('button', { name: 'Animasiyanı başlat', exact: true }).click();
  await expect(page.locator('.ribbon [class*="tgh-t-"]').first()).toHaveCSS(
    'animation-play-state',
    'running',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.ribbon [class*="tgh-t-"]').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );
  await expect(page.locator('.preview-banner')).toHaveCount(0);
});
test('navigation opens separate pages and browser back restores route', async ({ page }) => {
  await page.locator('.main-nav').getByRole('link', { name: 'Kəşf et', exact: true }).click();
  await expect(page).toHaveURL(/#\/discover/);
  await expect(page.locator('h1')).toHaveText('Sənin baxış bucağın.');
  await page.locator('.topic-bar').getByRole('link', { name: 'Texnologiya', exact: true }).click();
  await expect(page).toHaveURL(/#\/topic\/tech/);
  await expect(page.locator('h1')).toHaveText('Texnologiya');
  await expect(page.locator('.story-card')).toHaveCount(3);
  await page.goBack();
  await expect(page).toHaveURL(/#\/discover/);
  await page.goto('/#/about');
  await expect(page.locator('h1')).toContainText('Gün batır.');
  await page.goto('/#/unknown');
  await expect(page.getByRole('heading', { name: 'Bu səhifəyə gün batıb.' })).toBeVisible();
});
test('discover supports search, category, sorting, pagination, list layout, empty reset', async ({
  page,
}) => {
  await page.goto('/#/discover');
  await expect(page.locator('.story-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Növbəti səhifə' }).click();
  await expect(page.locator('.story-card')).toHaveCount(6);
  await expect(page.locator('.pagination')).toContainText('02');
  await page.getByRole('button', { name: 'Əvvəlki səhifə' }).click();
  await page.getByRole('textbox', { name: 'Xəbərlərdə axtar' }).fill('  SÜNİ  ');
  await expect(page.locator('.story-card')).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Xəbərlərdə axtar' }).fill('tapilmayan-xyz');
  await expect(page.locator('.story-card')).toHaveCount(0);
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button', { name: 'Filtrləri təmizlə', exact: true }).last().click();
  await expect(page.locator('.story-card')).toHaveCount(6);
  await page.getByLabel('Sıralama', { exact: true }).selectOption('short');
  await expect(page.locator('.story-meta').first()).toContainText('2 dəq oxu');
  await page.getByRole('button', { name: 'Siyahı görünüşü' }).click();
  await expect(page.locator('.list-layout')).toBeVisible();
});
test('language and theme settings translate full pages and persist', async ({ page }) => {
  await page
    .locator('.header-actions')
    .getByRole('button', { name: 'English', exact: true })
    .click();
  await expect(page.locator('h1')).toContainText('The day fades.');
  await page.getByRole('button', { name: 'Light mode', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/#/story/evening');
  await expect(page.locator('h1')).toHaveText('When the city slows down: what evenings teach us');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page
    .locator('.header-actions')
    .getByRole('button', { name: 'Türkçe', exact: true })
    .click();
  await expect(page.locator('h1')).toContainText('Şehir yavaşladığında');
  await expect(page).toHaveTitle(/Şehir yavaşladığında/);
  await page.goto('/#/preferences');
  await expect(page.locator('h1')).toHaveText('Kendi ritmini bul.');
});
test('saved reading list persists, remove and clear require intentional action', async ({
  page,
}) => {
  await page.goto('/#/discover');
  await page.locator('.save-button').first().click();
  await page.locator('.save-button').nth(1).click();
  await page.goto('/#/saved');
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Siyahını təmizlə' }).click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Ləğv et', exact: true }).click();
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Siyahını təmizlə' }).click();
  await page.getByRole('button', { name: 'Təmizlə', exact: true }).click();
  await expect(page.locator('.empty-state')).toBeVisible();
});
test('story has real page, focus mode, font tools, progress and resume history', async ({
  page,
}) => {
  await page.goto('/#/story/evening');
  await expect(page.locator('.story-paragraph')).toHaveCount(3);
  await page.getByRole('button', { name: 'Mətni böyüt' }).click();
  await expect(page.locator('.reading-content')).toHaveCSS('font-size', '20px');
  await page.getByRole('button', { name: 'Diqqət rejimi', exact: true }).click();
  await expect(page.locator('.article-toc')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await page.getByRole('button', { name: 'Adi görünüş', exact: true }).click();
  await page.locator('#story-section-1').scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const p = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow');
  expect(Number(p)).toBeGreaterThan(0);
  await page.goto('/#/saved');
  await expect(page.locator('.recent-story')).toHaveCount(1);
  await page.locator('.recent-story').click();
  await expect(page).toHaveURL(/resume=1/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(150);
  await page.getByRole('button', { name: 'Oxudum', exact: true }).click();
  await page.goto('/#/discover');
  await page.getByLabel('Oxunma vəziyyəti').selectOption('read');
  await expect(page.locator('.story-card')).toHaveCount(1);
});
test('share copies deep link and falls back when clipboard unavailable', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#/story/quiet-books');
  await page.locator('.reader-actions').getByRole('button', { name: 'Keçidi paylaş' }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('#/story/quiet-books');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('test refusal');
    };
  });
  await page.locator('.reader-actions').getByRole('button', { name: 'Keçidi paylaş' }).click();
  await expect(page.locator('#share-url')).toHaveValue(/#\/story\/quiet-books/);
});
test('search dialog keyboard shortcut opens results and closes accessibly', async ({ page }) => {
  await page.keyboard.press('Control+k');
  await expect(page.locator('.search-dialog')).toBeVisible();
  await page.locator('.search-dialog input').fill('Süni');
  await expect(page.locator('.search-results>button')).toHaveCount(1);
  await page.locator('.search-results>button').click();
  await expect(page).toHaveURL(/#\/story\/ai-creativity/);
  await expect(page.locator('.search-dialog')).toHaveCount(0);
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-dialog')).toHaveCount(0);
});
test('preferences persist motion and size, reset does not delete saved stories', async ({
  page,
}) => {
  await page.goto('/#/discover');
  await page.locator('.save-button').first().click();
  await page.goto('/#/preferences');
  await page.getByRole('switch').click();
  await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  await page.locator('input[type=range]').fill('23');
  await page.reload();
  await expect(page.locator('input[type=range]')).toHaveValue('23');
  await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: 'Seçimləri sıfırla' }).click();
  await page.getByRole('button', { name: 'Təmizlə', exact: true }).click();
  await expect(page.locator('input[type=range]')).toHaveValue('19');
  await page.goto('/#/saved');
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(1);
});
test('newsletter is honest demo, subscription toggles and persists', async ({ page }) => {
  await page.locator('#newsletter-email').fill('reader@example.com');
  await page
    .locator('.newsletter-block')
    .getByRole('button', { name: 'Abunə ol', exact: true })
    .click();
  await expect(page.locator('#newsletter-email')).toHaveCount(0);
  await expect(page.locator('.newsletter-block form')).toContainText('məktub göndərilmir');
  await page.reload();
  await expect(page.locator('#newsletter-email')).toHaveCount(0);
  await page.locator('.newsletter-block').getByRole('button', { name: 'Abunəni dayandır' }).click();
  await expect(page.locator('#newsletter-email')).toBeVisible();
});
test('mobile menu, themes and all major pages have no horizontal overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/discover',
      '/topic/culture',
      '/saved',
      '/story/evening',
      '/preferences',
      '/about',
      '/collections',
      '/collections/slow-living',
      '/daily',
    ]) {
      await page.goto(`/#${path}`);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), {
          message: `no overflow ${width} ${path}`,
        })
        .toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menyu', exact: true }).click();
  await expect(page.locator('.main-nav')).toBeVisible();
  await page.locator('.main-nav').getByRole('link', { name: 'Kəşf et', exact: true }).click();
  await expect(page).toHaveURL(/#\/discover/);
  await expect(page.locator('.main-nav')).toBeHidden();
});

test('collections open curated detail pages and keep their navigation active', async ({ page }) => {
  await page.goto('/#/collections');
  await expect(page.locator('.collection-card')).toHaveCount(4);
  await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText('Seçmələr');
  await page.locator('.collection-card').first().click();
  await expect(page).toHaveURL(/#\/collections\/slow-living/);
  await expect(page.locator('h1')).toHaveText('Bir az yavaşla');
  await expect(page.locator('.story-card')).toHaveCount(4);
  await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText('Seçmələr');
  await page.getByRole('link', { name: 'İlk hekayədən başla' }).click();
  await expect(page).toHaveURL(/#\/story\/evening/);
  await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText('Kəşf et');
  await page.goto('/#/collections/not-a-collection');
  await expect(page.locator('.empty-state')).toBeVisible();
});

test('reading plans respect every time budget and mood, offer alternatives, and save without duplicates', async ({
  page,
}) => {
  await page.goto('/#/daily');
  for (const budget of [5, 10, 15]) {
    await page.getByRole('button', { name: new RegExp(`^${budget}\\s*dəq$`) }).click();
    for (const mood of ['Bir az hər şeydən', 'İlham axtarıram', 'Bir az sakitlik']) {
      await page.getByRole('button', { name: mood, exact: true }).click();
      for (let alternative = 0; alternative < 6; alternative++) {
        const times = await page.locator('.daily-story-meta').allTextContents();
        const total = times.reduce((sum, text) => sum + Number(text.match(/(\d+) dəq/)?.[1]), 0);
        expect(total).toBeGreaterThan(0);
        expect(total).toBeLessThanOrEqual(budget);
        await expect(page.locator('.plan-duration')).toContainText(`${total} dəq`);
        const links = await page
          .locator('.daily-story')
          .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')));
        expect(new Set(links).size).toBe(links.length);
        await page.getByRole('button', { name: 'Başqa seçim göstər' }).click();
      }
    }
  }
  const first = await page.locator('.daily-story').first().getAttribute('href');
  await page.getByRole('button', { name: 'Başqa seçim göstər' }).click();
  expect(await page.locator('.daily-story').first().getAttribute('href')).not.toBe(first);
  const ids = await page
    .locator('.daily-story')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')?.split('/').pop()));
  await page.getByRole('button', { name: 'Siyahıya saxla', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Siyahındadır' })).toBeDisabled();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sunset.v2.saved') || '[]'),
  );
  expect(saved).toEqual(ids);
  await page.getByRole('link', { name: 'Oxumağa başla', exact: true }).click();
  await page.getByRole('button', { name: 'Oxudum', exact: true }).click();
  await page.goto('/#/daily');
  // Completed stories are reflected when they appear in a later plan.
  const completedId = ids[0];
  const history = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sunset.v2.history') || '{}'),
  );
  expect(history[completedId!].completed).toBe(true);
  await page.goto('/#/saved');
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(ids.length);
});

test('new pages translate and the mobile menu closes on selection and Escape', async ({ page }) => {
  await page
    .locator('.header-actions')
    .getByRole('button', { name: 'English', exact: true })
    .click();
  await page.goto('/#/collections');
  await expect(page.locator('h1')).toContainText('One theme, fresh perspectives');
  await page.goto('/#/daily');
  await expect(page.locator('h1')).toContainText('A little pause in your day');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-language-select').selectOption('tr');
  await expect(page.locator('h1')).toContainText('Güne küçük bir mola');
  await page.getByRole('button', { name: 'Menü', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.main-nav')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Menü', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Menü', exact: true }).click();
  await page.locator('.main-nav').getByRole('link', { name: 'Seçkiler', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Bir konu, farklı bakışlar');
  await expect(page.locator('.main-nav')).toBeHidden();
});
test('corrupt browser preferences are recovered without breaking pages', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('sunset.v2.language', '"invalid"');
    localStorage.setItem('sunset.v2.history', '{"bad":null}');
    localStorage.setItem('sunset.v2.saved', '{}');
    localStorage.setItem('sunset.v2.size', '"huge"');
  });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'az');
  await page.goto('/#/saved');
  await expect(page.locator('.empty-state')).toBeVisible();
});

test('upgrade preserves v1 preferences and saved stories without overwriting the old data', async ({
  page,
}) => {
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('sunset.language', '"en"');
    localStorage.setItem('sunset.theme', 'light');
    localStorage.setItem('sunset.saved', '["quiet-books","evening"]');
    localStorage.setItem('sunset.read', '["quiet-books"]');
    localStorage.setItem('sunset.readerSize', '22');
  });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/#/saved');
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(2);
  await expect(page.locator('.recent-story')).toHaveCount(1);
  await page.goto('/#/story/quiet-books');
  await expect(page.locator('.reading-content')).toHaveCSS('font-size', '22px');
  expect(await page.evaluate(() => localStorage.getItem('sunset.saved'))).toBe(
    '["quiet-books","evening"]',
  );
  expect(await page.evaluate(() => localStorage.getItem('sunset.theme'))).toBe('light');
  await page.goto('/#/saved');
  await page.getByRole('button', { name: 'Clear reading list', exact: true }).click();
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await page.reload();
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('sunset.saved'))).toBe(
    '["quiet-books","evening"]',
  );
});
