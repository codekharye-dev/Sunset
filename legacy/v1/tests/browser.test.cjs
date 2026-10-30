const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {existsSync} = require('node:fs');
const {chromium} = require('playwright');
const {setTimeout:pause} = require('node:timers/promises');
const port=3131, origin=`http://127.0.0.1:${port}`;

test('Sunset browser regression suite', {timeout:120000}, async t=>{
 const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:require('node:path').resolve(__dirname,'..'),stdio:'ignore'});
 t.after(()=>server.kill());
 let ready=false;
 for(let i=0;i<50;i++){try{const response=await fetch(origin);if(response.ok){ready=true;break;}}catch{}await pause(100);}
 assert.ok(ready,'Test server started');
 const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 const browser=await chromium.launch({executablePath,args:['--no-sandbox']});t.after(()=>browser.close());
 async function scenario(name,run,options={}){await t.test(name,async()=>{
  const context=await browser.newContext({viewport:{width:1440,height:1000},...options});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{await page.goto(origin);await run(page,context);assert.deepEqual(errors,[],'No JavaScript errors');}finally{await context.close();}
 });}
 await scenario('AZ/EN/TR translate navigation, stories, reader and persist',async page=>{
  assert.equal(await page.locator('.story-card').count(),6);assert.match(await page.locator('.card-meta').first().textContent(),/30 oktyabr 2026/);
  for(const [lang,home,title] of [['en','Home','New horizons'],['tr','Ana sayfa','Yapay zekâyla'],['az','Ana səhifə','Süni intellektlə']]){
   await page.locator(`.languages [data-lang="${lang}"]`).click();assert.equal(await page.locator('html').getAttribute('lang'),lang);
   assert.equal(await page.locator('nav [data-home]').textContent(),home);
   assert.ok((await page.locator('.story-card h3').first().textContent()).startsWith(title));
  }
  await page.locator('.languages [data-lang="en"]').click();await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.locator('[data-article="ai-creativity"]').first().click();assert.match(await page.locator('#dialog-title').textContent(),/New horizons/);assert.equal(await page.locator('#dialog-content p').count(),4);
 });
 await scenario('light/dark modes persist and have readable backgrounds',async page=>{
  await page.locator('button[data-theme="light"]').click();await page.waitForTimeout(450);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(247, 242, 236)');
  await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.locator('button[data-theme="dark"]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 });
 await scenario('bookmarks toggle, filter, reload and remove from saved view',async page=>{
  await page.locator('[data-save="ai-creativity"]').click();assert.equal(await page.locator('#saved-count').textContent(),'1');
  await page.reload();assert.equal(await page.locator('#saved-count').textContent(),'1');await page.locator('#saved-filter').click();assert.equal(await page.locator('.story-card').count(),1);
  await page.locator('[data-save="ai-creativity"]').click();assert.equal(await page.locator('.story-card').count(),0);assert.equal(await page.locator('#empty').isVisible(),true);
  await page.locator('#reset-filters').click();assert.equal(await page.locator('.story-card').count(),6);
 });
 await scenario('search in text, locale casing, categories and sort',async page=>{
  await page.locator('.search-toggle').click();await page.locator('#search').fill('  SÜNİ  ');assert.equal(await page.locator('.story-card').count(),1);
  await page.locator('#search').fill('olmayan-soz-xyz');assert.equal(await page.locator('.story-card').count(),0);await page.locator('#clear-search').click();assert.equal(await page.locator('.story-card').count(),6);
  await page.locator('#search').fill('tələsik');assert.equal(await page.locator('.story-card').count(),1);assert.match(await page.locator('.story-card h3').textContent(),/Şəhər/);
  await page.locator('#reset-filters').click();await page.locator('nav [data-category="society"]').click();assert.equal(await page.locator('.story-card').count(),2);assert.equal(await page.locator('nav .active').textContent(),'Cəmiyyət');
  await page.locator('nav [data-home]').click();assert.equal(await page.locator('.story-card').count(),6);
  await page.locator('#sort').selectOption('short');assert.match(await page.locator('.card-meta').first().textContent(),/3 dəq/);await page.locator('#sort').selectOption('long');assert.match(await page.locator('.card-meta').first().textContent(),/6 dəq/);
 });
 await scenario('reader font, save, next, read marks and deep links',async page=>{
  await page.locator('[data-article="ai-creativity"]').first().click();assert.match(page.url(),/#article=ai-creativity/);
  await page.locator('#font-larger').click();await page.waitForFunction(()=>getComputedStyle(document.querySelector('#dialog-content')).fontSize==='20px');assert.equal(await page.locator('#dialog-content').evaluate(e=>getComputedStyle(e).fontSize),'20px');
  await page.locator('#article-save').click();assert.equal(await page.locator('#article-save').getAttribute('aria-pressed'),'true');
  await page.locator('#next-story').click();assert.match(await page.locator('#dialog-title').textContent(),/Bir kitab/);await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelectorAll('.read-label').length>=2);assert.ok(await page.locator('.read-label').count()>=2);
  await page.goto(`${origin}/#article=digital-break`);assert.equal(await page.locator('dialog').evaluate(e=>e.open),true);assert.match(await page.locator('#dialog-title').textContent(),/Ekrandan/);
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('#dialog-content')).fontSize==='20px');assert.equal(await page.locator('#dialog-content').evaluate(e=>getComputedStyle(e).fontSize),'20px');
 });
 await scenario('share supports clipboard and manual fallback',async(page,context)=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.locator('[data-article="ai-creativity"]').first().click();await page.locator('#article-share').click();await page.waitForFunction(()=>!document.querySelector('#dialog-status').hidden);assert.equal(await page.locator('#dialog-status').isVisible(),true);assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/#article=ai-creativity/);
  await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('blocked')};});await page.locator('#article-share').click();assert.equal(await page.locator('#share-fallback').isVisible(),true);assert.match(await page.locator('#share-url').inputValue(),/#article=ai-creativity/);
 });
 await scenario('demo subscription persists, unsubscribes and info controls work',async page=>{
  await page.locator('#email').fill('reader@example.com');await page.locator('#subscribe button').click();assert.equal(await page.locator('#email').isVisible(),false);
  await page.reload();assert.equal(await page.locator('#email').isVisible(),false);await page.locator('#subscribe button').click();assert.equal(await page.locator('#email').isVisible(),true);
  for(const selector of ['#map','#contact-button','[data-social="LinkedIn"]','#credits']){await page.locator(selector).click();assert.equal(await page.locator('dialog').evaluate(e=>e.open),true);assert.ok((await page.locator('#dialog-content').textContent()).length>20);await page.keyboard.press('Escape');}
 });
 await scenario('responsive layouts in all languages and themes, mobile menu',async page=>{
  for(const lang of ['az','en','tr']){await page.locator(`.languages [data-lang="${lang}"]`).click();for(const theme of ['dark','light']){await page.locator(`button[data-theme="${theme}"]`).click();for(const width of [320,390,560,768,850,1024,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${lang}/${theme}/${width}`);}}}
  await page.setViewportSize({width:390,height:844});await page.locator('.menu').click();assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'true');await page.locator('nav [data-category="sport"]').click();assert.equal(await page.locator('.story-card').count(),1);assert.equal(await page.locator('.menu').getAttribute('aria-expanded'),'false');
 });
 await scenario('reduced motion disables decorative animation',async page=>{assert.equal(await page.locator('.sun-disc').evaluate(e=>getComputedStyle(e).animationName),'none');},{reducedMotion:'reduce'});
 await scenario('corrupt browser preferences do not break startup',async page=>{
  await page.evaluate(()=>{localStorage.setItem('sunset.saved','{}');localStorage.setItem('sunset.language','"invalid"');localStorage.setItem('sunset.readerSize','"bad"');});await page.reload();assert.equal(await page.locator('.story-card').count(),6);assert.equal(await page.locator('html').getAttribute('lang'),'az');
 });
});
