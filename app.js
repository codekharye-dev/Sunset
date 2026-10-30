const stories=[
{category:'Texnologiya',title:'Süni intellektlə yaradıcılığın yeni sərhədləri',image:'tech',time:4,excerpt:'Yeni alətlərlə ideyaları sınamaq və yaradıcılığa fərqli pəncərədən baxmaq haqqında nümunə hekayə.'},
{category:'Mədəniyyət',title:'Bir kitab, bir fincan, bir az da sakitlik',image:'books',time:3,excerpt:'Günün səs-küyündən uzaqlaşmaq üçün kitablarla qurduğumuz kiçik dünyalar.'},
{category:'Cəmiyyət',title:'Kiçik addımlar, daha yaşıl bir məhəllə',image:'green',time:5,excerpt:'Birlikdə qayğı göstərilən yaşıllıqlar və qonşuluğun gündəlik həyatdakı yeri haqqında.'},
{category:'İdman',title:'Qaçışın tempi yox, verdiyi hiss önəmlidir',image:'sport',time:4,excerpt:'Hərəkətə başlamaq, öz ritmini tapmaq və yolda olmağın sevincini hiss etmək.'},
{category:'Dünya',title:'Uzaq şəhərlərin yaxın hekayələri',image:'world',time:6,excerpt:'Küçələrə, pəncərələrə və gündəlik anlara baxaraq başqa yerləri təsəvvür edirik.'},
{category:'Texnologiya',title:'Ekrandan uzaqda: rəqəmsal fasilə vaxtı',image:'desk',time:3,excerpt:'Bildirişlərə qısa fasilə verib ətrafımızdakı kiçik detalları yenidən görmək.'}
];
const arrow='<svg class="arrow-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11"/></svg>';
const featured={category:'Cəmiyyət',title:'Şəhər yavaşlayanda: axşamın bizə öyrətdikləri',image:'sunset',time:5,excerpt:'Tələsik addımların arasında bir az dayanmaq. Şəhərin axşam ritmində özümüzə vaxt ayırmağın kiçik yolları. Bəzən bir gəzinti, açıq bir pəncərə və günün son işığı fikirlərimizi toplamaq üçün kifayətdir.'};
const $=selector=>document.querySelector(selector);
const grid=$('#story-grid');
const dialog=$('#article-dialog');
const nav=$('#main-nav');
const menu=$('.menu');
let category='',query='';
const categories=['Texnologiya','Cəmiyyət','Mədəniyyət','İdman','Dünya'];
$('#topics').innerHTML=categories.map(c=>{
 const count=stories.filter(s=>s.category===c).length+(featured.category===c?1:0);
 return `<button class="topic" data-category="${c}" aria-pressed="false">${c}<span>${String(count).padStart(2,'0')}</span>${arrow}</button>`;
}).join('');
function progress(){
 const max=document.documentElement.scrollHeight-innerHeight;
 $('#progress').style.width=`${max>0?Math.min(100,scrollY/max*100):0}%`;
}
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
function render(){
 const normalized=query.trim().toLocaleLowerCase('az');
 const filtered=stories.map((s,i)=>({...s,i})).filter(s=>(!category||s.category===category)&&s.title.toLocaleLowerCase('az').includes(normalized));
 grid.innerHTML=filtered.map(s=>`<article class="story-card"><a class="card-image" href="#article-dialog" data-article="${s.i+1}" aria-label="${s.title}"><img src="assets/${s.image}.svg" alt="${s.title} — nümunə illüstrasiya" loading="lazy" width="960" height="720"><span class="image-sample">Nümunə</span><span class="image-arrow">${arrow}</span></a><div class="card-copy"><span class="category">${s.category}</span><h3><a href="#article-dialog" data-article="${s.i+1}">${s.title}</a></h3><div class="card-meta"><span>30 oktyabr 2026</span><span>${s.time} dəq oxu</span></div></div></article>`).join('');
 $('#empty').hidden=filtered.length>0;
 $('#results-status').textContent=category?`${category} · ${filtered.length} nümunə hekayə`:`${filtered.length} nümunə hekayə${normalized?' tapıldı':''}`;
 $('#reset-filters').hidden=!category&&!query;
 $('#clear-search').hidden=!query;
 document.querySelectorAll('.topic').forEach(b=>{
  const active=b.dataset.category===category;
  b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
 });
 nav.querySelectorAll('a').forEach(a=>{
  const active=category?a.dataset.category===category:a.hasAttribute('data-home');
  a.classList.toggle('active',active);
  if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 });
 requestAnimationFrame(progress);
}
function resetFilters(){category='';query='';$('#search').value='';render();}
function openArticle(story){
 $('#dialog-title').textContent=story.title;
 $('#dialog-content').textContent=story.excerpt;
 $('#dialog-meta').textContent=`${story.category} · Müəllif adı · 30 oktyabr 2026 · ${story.time} dəq oxu`;
 $('#dialog-image').src=`assets/${story.image}.svg`;
 $('#dialog-image').alt=`${story.title} — nümunə illüstrasiya`;
 $('#dialog-image').hidden=false;
 dialog.showModal();
}
document.addEventListener('click',e=>{
 const c=e.target.closest('[data-category]');
 if(c){category=c.classList.contains('topic')&&category===c.dataset.category?'':c.dataset.category;render();closeMenu();if(c.classList.contains('topic'))$('#stories').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 if(e.target.closest('[data-home]')){resetFilters();closeMenu();}
 const a=e.target.closest('[data-article]');
 if(a){e.preventDefault();const n=Number(a.dataset.article);openArticle(n?stories[n-1]:featured);}
 if(!e.target.closest('.header'))closeMenu();
});
$('.close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{
 if(e.target!==dialog)return;
 const r=dialog.getBoundingClientRect();
 if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
});
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
new MutationObserver(()=>document.body.classList.toggle('dialog-open',dialog.open)).observe(dialog,{attributes:true,attributeFilter:['open']});
$('#all-stories').onclick=resetFilters;
$('#reset-filters').onclick=resetFilters;
menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
function setSearch(open){
 $('#search-panel').hidden=!open;
 $('.search-toggle').setAttribute('aria-expanded',String(open));
 $('.search-toggle').setAttribute('aria-label',open?'Axtarışı bağla':'Axtarışı aç');
 if(open)$('#search').focus();
}
$('.search-toggle').onclick=()=>setSearch($('#search-panel').hidden);
$('#search').oninput=e=>{query=e.target.value;render();};
$('#clear-search').onclick=()=>{query='';$('#search').value='';render();$('#search').focus();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(!$('#search-panel').hidden){setSearch(false);$('.search-toggle').focus();}}});
$('#subscribe').onsubmit=e=>{e.preventDefault();$('#form-note').textContent='Təşəkkürlər! Bu nümunə abunədir — məlumatın saxlanılmadı.';e.target.reset();};
$('#map').onclick=()=>$('#map-note').hidden=false;
$('#credits').onclick=()=>{
 $('#dialog-title').textContent='Sunset haqqında';
 $('#dialog-content').textContent='Dizayn və illüstrasiyalar bu nümunə xəbər blogu üçün hazırlanıb. Bütün hekayələr nümunədir.';
 $('#dialog-meta').textContent='';$('#dialog-image').hidden=true;dialog.showModal();
};
addEventListener('scroll',progress,{passive:true});
addEventListener('resize',()=>{progress();if(innerWidth>850)closeMenu();});
addEventListener('load',progress);
render();
