/* Sunset: static, account-free reading with browser-local preferences. */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const articles = window.SUNSET_ARTICLES;
const translations = window.SUNSET_I18N;
const categories = ['tech', 'society', 'culture', 'sport', 'world'];
const arrow = '<svg class="arrow-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11"/></svg>';
const bookmark = '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 3h10v14l-5-3-5 3Z"/></svg>';
function load(key, fallback) {
 try { const raw = localStorage.getItem(`sunset.${key}`); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; }
}
let lang = load('language', 'az');
if (!Object.hasOwn(translations, lang)) lang = 'az';
let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
const validIds = new Set(articles.map(a => a.id));
function storedIds(key) { const value = load(key, []); return new Set(Array.isArray(value) ? value.filter(id => validIds.has(id)) : []); }
const saved = storedIds('saved');
const read = storedIds('read');
let subscribed = load('subscribed', false) === true;
let readerSize = load('readerSize', 18);
if (!Number.isFinite(readerSize)) readerSize = 18;
readerSize = Math.min(24, Math.max(16, readerSize));
let category = '', query = '', savedOnly = false, sort = 'editor', currentArticle = null, infoKey = null, returnArticleId = null;
const grid = $('#story-grid'), dialog = $('#article-dialog'), nav = $('#main-nav'), menu = $('.menu');
const t = key => translations[lang][key] || key;
let toastTimer;
$('#saved-filter>span:first-child').innerHTML = bookmark;
function toast(message) {
 const target = dialog.open ? $('#dialog-status') : $('#toast');
 target.textContent = message; target.hidden = false;
 clearTimeout(toastTimer); toastTimer = setTimeout(() => { target.hidden = true; }, 3600);
}
function persist(key, value) {
 try { localStorage.setItem(`sunset.${key}`, JSON.stringify(value)); } catch { toast(t('storageError')); }
}
function dateLabel(date) {
 const [year, month, day] = date.split('-').map(Number);
 const months = {
  az: ['yanvar','fevral','mart','aprel','may','iyun','iyul','avqust','sentyabr','oktyabr','noyabr','dekabr'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  tr: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
 };
 return `${day} ${months[lang][month-1]} ${year}`;
}
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
function setTheme(value) {
 theme = value; document.documentElement.dataset.theme = theme;
 try { localStorage.setItem('sunset.theme', theme); } catch { toast(t('storageError')); }
 $('meta[name="theme-color"]').content = theme === 'light' ? '#f7f2ec' : '#151020';
 $$('button[data-theme]').forEach(b => { b.classList.toggle('selected', b.dataset.theme === theme); b.setAttribute('aria-pressed', String(b.dataset.theme === theme)); });
}
// Keep decorative SVGs while changing the visible text of action controls.
function action(selector, key) { $(selector).innerHTML = `${t(key)} ${arrow}`; }
const bindings = {
 '.skip-link':'skip', '.search-panel label':'searchLabel', '.search-panel>p':'searchHint', '.eyebrow>span:first-child':'eyebrow', '.live':'live', '.hero-layout>div:first-child>p':'heroDescription', '.art-note':'artNote', '.hero-bottom>span:first-child':'curious', '.hero-bottom>span:last-child':'scroll', '.image-note':'perspective', '.featured-copy .sample':'sample', '.author strong':'author', '.section-heading .overline':'trending', '.topics h2':'topics', '.topics-heading>span':'interests', '.newsletter-copy .overline':'newsletterEyebrow', '.newsletter-copy>p':'newsletterDescription', '#subscribe label':'email', '.footer-top>div:nth-child(1) .pill-label':'sections', '.footer-top>div:nth-child(2) .pill-label':'editorial', '.footer-top>div:nth-child(3) .pill-label':'contact', '.footer-bottom>span:first-child':'footer', '.footer-bottom>span:last-child':'footerMotto', '.star-sticker':'new', '.speech-sticker':'hello', '.paper-sticker small':'paper', '#article-dialog>.sample':'sample', '.dialog-note':'note'
};
function applyLanguage() {
 document.documentElement.lang = lang;
 document.title = `Sunset — ${t('latest')}`;
 Object.entries(bindings).forEach(([selector, key]) => { $(selector).textContent = t(key); });
 $$('[data-text]').forEach(e => { e.textContent = t(e.dataset.text); });
 $('.hero h1').innerHTML = t('heroTitle');
 $('.newsletter h2').innerHTML = t('newsletterTitle');
 $('.address').innerHTML = t('address');
 menu.textContent = `${t('menu')} ☰`;
 nav.setAttribute('aria-label', t('sections'));
 $('[data-home][aria-current], nav [data-home]').textContent = t('home');
 const navCategories = nav.querySelectorAll('[data-category]');
 navCategories.forEach((a,i) => { a.dataset.category = categories[i]; a.textContent = t(categories[i]); });
 $$('.footer-nav [data-category]').forEach((a,i) => { a.dataset.category = categories[i]; a.innerHTML = `${t(categories[i])} ${arrow}`; });
 $$('.languages, .footer-langs').forEach(e => e.setAttribute('aria-label', lang === 'az' ? 'Dil' : lang === 'tr' ? 'Dil' : 'Language'));
 $$('[data-lang]').forEach(b => { b.classList.toggle('selected', b.dataset.lang === lang); b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
 $('.theme').setAttribute('aria-label', t('preferences'));
 $$('button[data-theme]').forEach(b => b.setAttribute('aria-label', t(b.dataset.theme)));
 $('#search').placeholder = t('searchPlaceholder'); $('#email').placeholder = t('emailPlaceholder');
 $('#clear-search').setAttribute('aria-label', t('clearSearch'));
 $('.search-toggle').setAttribute('aria-label', t($('#search-panel').hidden ? 'search' : 'searchClose'));
 $('.close').setAttribute('aria-label', t('close')); $('#back-top').setAttribute('aria-label', t('backTop'));
 $('#font-smaller').setAttribute('aria-label', t('fontSmaller')); $('#font-larger').setAttribute('aria-label', t('fontLarger'));
 $('#reader-tools').setAttribute('aria-label', t('reader'));
 action('.hero-buttons .primary', 'browse'); action('.hero-buttons .outline', 'subscribe');
 action('#all-stories', 'all'); action('#map', 'map'); action('#credits', 'credits');
 $('.section-heading h2').innerHTML = `${t('latest')}<span class="small-dot" aria-hidden="true">✳</span>`;
 $('.featured-badge').textContent = `✦ ${t('featured')}`;
 $('.featured-copy .category').textContent = t(articles[0].category);
 $('.featured h2 a').textContent = articles[0].text[lang].title;
 $('.featured-copy>p').textContent = articles[0].text[lang].excerpt;
 $('.featured-image img').alt = `${articles[0].text[lang].title} — ${t('imageAlt')}`;
 $('.author div>span').textContent = `${dateLabel(articles[0].date)} · ${articles[0].time} ${t('readTime')}`;
 $('.round-arrow').setAttribute('aria-label', t('readFeatured'));
 $('#topics').innerHTML = categories.map(c => `<button class="topic" data-category="${c}" aria-pressed="false">${t(c)}<span>${String(articles.filter(a=>a.category===c).length).padStart(2,'0')}</span>${arrow}</button>`).join('');
 updateSubscription(); render();
 if (dialog.open) currentArticle ? fillArticle() : fillInfo();
}
function progress() {
 const max = document.documentElement.scrollHeight - innerHeight;
 $('#progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
 $('#back-top').hidden = scrollY < 600;
}
function render() {
 const normalized = query.trim().toLocaleLowerCase(lang);
 let list = (savedOnly || category || normalized ? articles : articles.slice(1)).filter(a => (!category || a.category === category) && (!savedOnly || saved.has(a.id)) && `${a.text[lang].title} ${a.text[lang].body.join(' ')} ${t(a.category)}`.toLocaleLowerCase(lang).includes(normalized));
 if (sort !== 'editor') list = [...list].sort((a,b) => sort === 'short' ? a.time-b.time : b.time-a.time);
 grid.innerHTML = list.map((a,i) => `<article class="story-card" style="--card-index:${i}"><a class="card-image" href="#article=${a.id}" data-article="${a.id}" aria-label="${a.text[lang].title}"><img src="assets/${a.image}.svg" alt="${a.text[lang].title} — ${t('imageAlt')}" loading="lazy" width="960" height="720"><span class="image-sample">${t('sample')}</span><span class="image-arrow">${arrow}</span></a><button class="bookmark ${saved.has(a.id)?'is-saved':''}" data-save="${a.id}" aria-label="${t(saved.has(a.id)?'unsave':'save')}: ${a.text[lang].title}" aria-pressed="${saved.has(a.id)}">${bookmark}</button><div class="card-copy"><div class="card-tags"><span class="category">${t(a.category)}</span>${read.has(a.id)?`<span class="read-label">✓ ${t('read')}</span>`:''}</div><h3><a href="#article=${a.id}" data-article="${a.id}">${a.text[lang].title}</a></h3><div class="card-meta"><span>${dateLabel(a.date)}</span><span>${a.time} ${t('readTime')}</span></div></div></article>`).join('');
 $('#empty').hidden = list.length > 0;
 $('#empty').textContent = t(savedOnly && saved.size===0 ? 'savedEmpty' : 'empty');
 $('#results-status').textContent = `${category ? t(category)+' · ' : ''}${list.length} ${t('results')}`;
 $('#reset-filters').hidden = !category && !query && !savedOnly && sort === 'editor';
 $('#reset-filters').textContent = `${t('clear')} ×`;
 $('#clear-search').hidden = !query;
 $('#saved-count').textContent = saved.size;
 $('#saved-filter').setAttribute('aria-pressed', String(savedOnly));
 $$('.topic').forEach(b => { const active = b.dataset.category === category; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
 nav.querySelectorAll('a').forEach(a => { const active = category ? a.dataset.category===category : a.hasAttribute('data-home'); a.classList.toggle('active',active); if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current'); });
 requestAnimationFrame(progress);
}
function resetFilters() { category='';query='';savedOnly=false;sort='editor';$('#sort').value=sort;$('#search').value='';render(); }
function toggleSave(id) {
 saved.has(id) ? saved.delete(id) : saved.add(id);
 persist('saved',[...saved]);render();updateSaveButton();toast(t(saved.has(id)?'savedToast':'removedToast'));
}
function updateSaveButton() {
 if(!currentArticle)return;
 const active=saved.has(currentArticle.id);
 $('#article-save').innerHTML=`${bookmark} ${t(active?'unsave':'save')}`;
 $('#article-save').setAttribute('aria-pressed',String(active));
}
function fillArticle() {
 const a=currentArticle;
 $('#dialog-title').textContent=a.text[lang].title;
 $('#dialog-meta').textContent=`${t(a.category)} · ${t('author')} · ${dateLabel(a.date)} · ${a.time} ${t('readTime')}`;
 $('#dialog-image').src=`assets/${a.image}.svg`;$('#dialog-image').alt=`${a.text[lang].title} — ${t('imageAlt')}`;$('#dialog-image').hidden=false;
 $('#dialog-content').replaceChildren(...a.text[lang].body.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
 $('#reader-tools').hidden=false;$('#next-story').hidden=false;$('.dialog-note').hidden=false;
 $('#dialog-content').style.fontSize=`${readerSize}px`;
 $('#font-smaller').disabled=readerSize<=16;$('#font-larger').disabled=readerSize>=24;
 $('#article-share').innerHTML=`${t('share')} ${arrow}`;
 $('#next-story').innerHTML=`${t('next')} ${arrow}`;
 updateSaveButton();
}
function openArticle(id, updateUrl=true) {
 const article=articles.find(a=>a.id===id);if(!article)return;
 if(!dialog.open)returnArticleId=document.activeElement?.dataset.article ?? null;
 currentArticle=article;infoKey=null;$('#share-fallback').hidden=true;$('#dialog-status').hidden=true;fillArticle();
 if(!dialog.open)dialog.showModal();document.body.classList.add('dialog-open');dialog.scrollTop=0;
 if(updateUrl) history.replaceState(null,'',`#article=${article.id}`);
}
function fillInfo() {
 $('#dialog-title').textContent=infoKey==='socialText'?currentSocial:t(infoKey==='mapText'?'editorial':infoKey==='contactText'?'contact':'about');
 $('#dialog-meta').textContent='';$('#dialog-image').hidden=true;$('#reader-tools').hidden=true;$('#next-story').hidden=true;$('.dialog-note').hidden=true;$('#share-fallback').hidden=true;
 $('#dialog-content').textContent=t(infoKey);$('#dialog-status').hidden=true;
}
let currentSocial='';
function openInfo(key) { currentArticle=null;infoKey=key;fillInfo();if(!dialog.open)dialog.showModal();document.body.classList.add('dialog-open');dialog.scrollTop=0; }
function setSearch(open) {
 $('#search-panel').hidden=!open;$('.search-toggle').setAttribute('aria-expanded',String(open));$('.search-toggle').setAttribute('aria-label',t(open?'searchClose':'search'));if(open)$('#search').focus();
}
function updateSubscription() {
 $('#form-note').textContent=t(subscribed?'subscribed':'demoNote');
 $('#subscribe label').hidden=subscribed;$('#email').hidden=subscribed;$('#email').required=!subscribed;
 $('#subscribe button').innerHTML=`${t(subscribed?'unsubscribe':'subscribe')} ${arrow}`;
}
document.addEventListener('click', e=>{
 const language=e.target.closest('[data-lang]');
 if(language){lang=language.dataset.lang;persist('language',lang);applyLanguage();return;}
 const mode=e.target.closest('button[data-theme]');if(mode){setTheme(mode.dataset.theme);return;}
 const c=e.target.closest('[data-category]');
 if(c){category=c.classList.contains('topic')&&category===c.dataset.category?'':c.dataset.category;render();closeMenu();if(c.classList.contains('topic'))$('#stories').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 if(e.target.closest('[data-home]')){resetFilters();closeMenu();}
 const save=e.target.closest('[data-save]');if(save){toggleSave(save.dataset.save);return;}
 const a=e.target.closest('[data-article]');if(a){e.preventDefault();openArticle(a.dataset.article==='0'?articles[0].id:a.dataset.article);}
 const social=e.target.closest('[data-social]');if(social){currentSocial=social.dataset.social;openInfo('socialText');}
 if(!e.target.closest('.header'))closeMenu();
});
$('.close').onclick=()=>dialog.close();
dialog.addEventListener('click', e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>{
 document.body.classList.remove('dialog-open');
 if(currentArticle){read.add(currentArticle.id);persist('read',[...read]);render();}
 if(location.hash.startsWith('#article='))history.replaceState(null,'',`${location.pathname}${location.search}`);
 currentArticle=null;infoKey=null;
 if(returnArticleId){document.querySelector(`[data-article="${returnArticleId}"]`)?.focus({preventScroll:true});returnArticleId=null;}
});
$('#all-stories').onclick=resetFilters;$('#reset-filters').onclick=resetFilters;
$('#saved-filter').onclick=()=>{savedOnly=!savedOnly;render();};
$('#sort').onchange=e=>{sort=e.target.value;render();};
menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
$('.search-toggle').onclick=()=>setSearch($('#search-panel').hidden);
$('#search').oninput=e=>{query=e.target.value;render();};
$('#search').onkeydown=e=>{if(e.key==='Enter'){$('#stories').scrollIntoView();$('#results-status').tabIndex=-1;$('#results-status').focus({preventScroll:true});}};
$('#clear-search').onclick=()=>{query='';$('#search').value='';render();$('#search').focus();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(!$('#search-panel').hidden&&!dialog.open){setSearch(false);$('.search-toggle').focus();}}});
$('#subscribe').onsubmit=e=>{e.preventDefault();subscribed=!subscribed;persist('subscribed',subscribed);updateSubscription();e.target.reset();toast(t(subscribed?'subscribedToast':'unsubscribeToast'));};
$('#map').onclick=()=>openInfo('mapText');$('#contact-button').onclick=()=>openInfo('contactText');$('#credits').onclick=()=>openInfo('aboutText');
$('#article-save').onclick=()=>{if(currentArticle)toggleSave(currentArticle.id);};
$('#article-share').onclick=async()=>{
 const url=new URL(location.href);url.hash=`article=${currentArticle.id}`;
 try { await navigator.clipboard.writeText(url.href);toast(t('copied')); }
 catch {$('#share-fallback').hidden=false;$('#share-url').value=url.href;$('#share-url').focus();$('#share-url').select();}
};
function resizeReader(delta){readerSize=Math.max(16,Math.min(24,readerSize+delta));persist('readerSize',readerSize);fillArticle();}
$('#font-smaller').onclick=()=>resizeReader(-2);$('#font-larger').onclick=()=>resizeReader(2);
$('#next-story').onclick=()=>{read.add(currentArticle.id);persist('read',[...read]);openArticle(articles[(articles.indexOf(currentArticle)+1)%articles.length].id);render();};
$('#back-top').onclick=()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
addEventListener('scroll',progress,{passive:true});addEventListener('resize',()=>{progress();if(innerWidth>850)closeMenu();});addEventListener('load',progress);
function openHashArticle(){if(location.hash.startsWith('#article='))openArticle(location.hash.slice(9),false);}
addEventListener('hashchange',openHashArticle);
addEventListener('offline',()=>toast(t('offline')));
setTheme(theme);applyLanguage();
openHashArticle();
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:0.08});
 $$('.featured,.stories,.topics,.newsletter,.footer').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
}
