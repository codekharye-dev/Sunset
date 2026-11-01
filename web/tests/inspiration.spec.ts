import { test, expect } from '@playwright/test';

test('reel navigates by keyboard, stops at boundaries and honors live motion settings', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/ideas');
  const reel = page.getByRole('region', { name: 'İlham verən fikirlər' });
  await expect(reel.locator('.reel-byline')).toContainText('James Clear');
  await expect(page.getByRole('button', { name: 'Əvvəlki fikir', exact: true })).toBeDisabled();
  await reel.focus();
  await page.keyboard.press('ArrowRight');
  await expect(reel.locator('.reel-byline')).toContainText('Steve Jobs');
  await expect(reel.locator('.reel-column').first()).toHaveCSS('transition-duration', '0s');
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Növbəti fikir', exact: true }).click();
  await expect(reel.locator('.reel-byline')).toContainText('Epictetus');
  await expect(page.getByRole('button', { name: 'Növbəti fikir', exact: true })).toBeDisabled();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Əvvəlki fikir', exact: true }).click();
  await expect(reel.locator('.reel-byline')).toContainText('Paul Graham');
  await expect(reel.locator('.scroll-reel-char').first()).toHaveCSS(
    'animation-name',
    'scroll-reel-char-rise',
  );
  // Switching to reduced motion during a slide must settle the reel and unlock navigation.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Əvvəlki fikir', exact: true }).click();
  await expect(reel.locator('.reel-byline')).toContainText('Marcus Aurelius');
  await reel.getByRole('link', { name: 'Fikrin arxasında', exact: true }).click();
  await expect(page).toHaveURL(/#\/ideas\/marcus-aurelius/);
  await expect(page.locator('.sourced-quote a')).toHaveAttribute(
    'href',
    'https://classics.mit.edu/Antoninus/meditations.4.four.html',
  );
  await page.getByText('Sitatın orijinalını oxu', { exact: true }).click();
  await expect(page.locator('.quote-original p')).toContainText(
    'Let no act be done without a purpose',
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/preferences');
  await page.getByRole('switch').click();
  await page.goto('/#/ideas');
  await expect(page.locator('.scroll-reel')).toHaveClass(/reel-reduced/);
});

test('idea filters and saved quotes persist independently from saved stories', async ({ page }) => {
  await page.goto('/#/discover');
  await page.locator('.save-button').first().click();
  await page.goto('/#/ideas');
  await expect(page.locator('.idea-card')).toHaveCount(5);
  await page.getByRole('button', { name: 'Fikri saxla: Steve Jobs', exact: true }).click();
  await page.getByRole('button', { name: 'Saxladığım fikirlər', exact: false }).click();
  await expect(page.locator('.idea-card')).toHaveCount(1);
  await expect(page.locator('.idea-card')).toContainText('Steve Jobs');
  await page.goto('/#/ideas?saved=1');
  await expect(page.locator('.idea-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.idea-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Diqqət və intizam', exact: true }).click();
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.getByRole('button', { name: 'Bütün fikirlərə qayıt', exact: true }).click();
  await page.getByRole('textbox', { name: 'Müəllif və ya fikir axtar' }).fill('  MARCUS  ');
  await expect(page.locator('.idea-card')).toHaveCount(1);
  await page.goto('/#/saved');
  await expect(page.locator('.saved-grid .story-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Saxladığım fikirlər (1)' }).click();
  await expect(page.locator('.idea-card')).toContainText('Steve Jobs');
  await page.goto('/#/ideas/unknown');
  await expect(page.locator('.empty-state')).toBeVisible();
});

test('notebook preserves independent notes, exports them, and deletes only the confirmed note', async ({
  page,
}) => {
  await page.goto('/#/notebook?idea=steve-jobs');
  const editor = page.locator('textarea');
  await editor.fill('Mən öz layihəmə iyirmi dəqiqə ayıracağam.');
  await page
    .locator('.notebook-sidebar')
    .getByRole('link', { name: /James Clear/ })
    .click();
  await expect(editor).toHaveValue('');
  await editor.fill('Hər axşam iki səhifə oxumaq.');
  await page.reload();
  await expect(editor).toHaveValue('Hər axşam iki səhifə oxumaq.');
  await page
    .locator('.notebook-sidebar')
    .getByRole('link', { name: /Steve Jobs/ })
    .click();
  await expect(editor).toHaveValue('Mən öz layihəmə iyirmi dəqiqə ayıracağam.');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Qeydlərimi endir' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('sunset-notebook.txt');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const exported = Buffer.concat(chunks).toString('utf8');
  expect(exported).toContain('Hər axşam iki səhifə oxumaq.');
  expect(exported).toContain('Mən öz layihəmə iyirmi dəqiqə ayıracağam.');
  expect(exported).toContain('https://news.stanford.edu/');
  await page.getByRole('button', { name: 'Bu qeydi sil', exact: true }).click();
  await page.getByRole('button', { name: 'Ləğv et', exact: true }).click();
  await expect(editor).not.toHaveValue('');
  await page.getByRole('button', { name: 'Bu qeydi sil', exact: true }).click();
  await page.getByRole('button', { name: 'Təmizlə', exact: true }).click();
  await expect(editor).toHaveValue('');
  await page
    .locator('.notebook-sidebar')
    .getByRole('link', { name: /James Clear/ })
    .click();
  await expect(editor).toHaveValue('Hər axşam iki səhifə oxumaq.');
});

test('new pages translate and corrupt notebook data is recovered safely', async ({ page }) => {
  await page.goto('/#/ideas');
  await page
    .locator('.header-actions')
    .getByRole('button', { name: 'English', exact: true })
    .click();
  await expect(page.locator('h1')).toContainText('Ideas stay, perspectives change');
  await page.goto('/#/ideas/james-clear');
  await expect(page.locator('h1')).toHaveText('A small system for a big goal');
  await page.getByRole('link', { name: 'Reflect on this idea', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Listen to yourself');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.mobile-language-select').selectOption('tr');
  await expect(page.locator('h1')).toContainText('Biraz da kendini dinle');
  await page.evaluate(() => {
    localStorage.setItem('sunset.v2.reflections', '{"steve-jobs":null}');
    localStorage.setItem('sunset.v2.savedIdeas', '["not-a-person"]');
  });
  await page.reload();
  await expect(page.locator('textarea')).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Notlarımı indir' })).toBeDisabled();
});
