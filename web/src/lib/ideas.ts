import type { Lang } from './content';

export type IdeaTheme = 'focus' | 'craft' | 'courage' | 'calm';
export interface IdeaText {
  quote: string;
  role: string;
  title: string;
  intro: string;
  perspective: string;
  practice: string;
  question: string;
}
export interface Idea {
  id: string;
  author: string;
  years: string;
  theme: IdeaTheme;
  color: string;
  source: { title: string; url: string; original: string };
  related: string[];
  text: Record<Lang, IdeaText>;
}

export const ideas: Idea[] = [
  {
    id: 'james-clear',
    author: 'James Clear',
    years: '1986 —',
    theme: 'focus',
    color: '#d2b28c',
    source: {
      title: 'James Clear · Atomic Habits',
      url: 'https://jamesclear.com/quotes/you-do-not-rise-to-the-level-of-your-goals-you-fall-to-the-level-of-your-systems',
      original:
        'You do not rise to the level of your goals. You fall to the level of your systems.',
    },
    related: ['digital-break', 'stretch-break'],
    text: {
      az: {
        quote: 'Hədəflərinin səviyyəsinə yüksəlmirsən. Sistemlərinin səviyyəsinə enirsən.',
        role: 'Yazıçı · vərdişlər və davamlılıq',
        title: 'Böyük hədəfin kiçik sistemi',
        intro:
          'Atomic Habits kitabının müəllifi James Clear diqqəti bir dəfəlik həvəsdən gündəlik davranışlara çevirir. Onun işinin mərkəzində təkrarlana bilən kiçik addımlar dayanır.',
        perspective:
          'Hədəf istiqaməti göstərir, amma günün necə keçəcəyini çox vaxt qurduğumuz mühit müəyyən edir. Sunset baxışı ilə bu fikir, daha çox iş görməkdən əvvəl başlamağı asanlaşdırmaq haqqındadır.',
        practice:
          'Oxumaq istədiyin kitabı bu axşam telefonunun yerinə masanın üstünə qoy. Sabah üçün böyük vəd vermək əvəzinə, iki səhifəni asan seçimə çevir.',
        question: 'Davam etdirmək istədiyin bir vərdişi iki dəqiqəyə necə kiçildə bilərsən?',
      },
      en: {
        quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
        role: 'Writer · habits and consistency',
        title: 'A small system for a big goal',
        intro:
          'James Clear, the author of Atomic Habits, turns attention from occasional motivation to everyday behavior. Repeatable small actions sit at the center of his work.',
        perspective:
          'A goal gives direction, but the environment we build often decides how our day unfolds. Our Sunset reading of this idea is to make starting easier before trying to do more.',
        practice:
          'Put the book you want to read where you usually leave your phone tonight. Instead of making a big promise for tomorrow, make two pages the easy choice.',
        question: 'How could you shrink a habit you want to keep into two minutes?',
      },
      tr: {
        quote: 'Hedeflerinin seviyesine yükselmezsin. Sistemlerinin seviyesine düşersin.',
        role: 'Yazar · alışkanlıklar ve istikrar',
        title: 'Büyük bir hedefin küçük sistemi',
        intro:
          'Atomik Alışkanlıklar kitabının yazarı James Clear, dikkati geçici hevesten gündelik davranışlara çevirir. Çalışmalarının merkezinde tekrarlanabilir küçük adımlar vardır.',
        perspective:
          'Hedef yönü gösterir, ama günün nasıl geçeceğini çoğu zaman kurduğumuz çevre belirler. Sunset bakışıyla bu fikir, daha çok şey yapmadan önce başlamayı kolaylaştırmaktır.',
        practice:
          'Bu akşam okumak istediğin kitabı telefonunun yerine masaya koy. Yarın için büyük bir söz vermek yerine iki sayfayı kolay seçime dönüştür.',
        question: 'Sürdürmek istediğin bir alışkanlığı iki dakikaya nasıl küçültebilirsin?',
      },
    },
  },
  {
    id: 'steve-jobs',
    author: 'Steve Jobs',
    years: '1955 — 2011',
    theme: 'courage',
    color: '#baafd0',
    source: {
      title: 'Stanford · Commencement Address, 2005',
      url: 'https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says',
      original: 'Your time is limited, so don’t waste it living someone else’s life.',
    },
    related: ['ai-creativity', 'slow-weekend'],
    text: {
      az: {
        quote: 'Vaxtın məhduddur, onu başqasının həyatını yaşamağa sərf etmə.',
        role: 'Apple həmtəsisçisi · yaradıcılıq',
        title: 'Öz yoluna yer ayırmaq',
        intro:
          'Steve Jobs 2005-ci ildə Stanford məzunlarına etdiyi çıxışda öz həyatından üç hekayə danışır. Söhbətin mövzusu təkcə iş deyil, insanın öz seçiminə qulaq asmasıdır.',
        perspective:
          'Başqalarının uğur ölçüsü bizim marağımızla həmişə üst-üstə düşmür. Bu sözlərdən götürdüyümüz fikir hər şeyi birdən dəyişmək deyil, bir qərarda öz səsini eşitməkdir.',
        practice:
          'Bu həftə vaxt ayırdığın üç şeyi yaz. Onlardan hansını doğrudan özün seçmisən? Birinə sadəcə maraq üçün iyirmi dəqiqə ayır.',
        question: 'Heç kim nəticəni görməsəydi, yenə hansı işi öyrənmək istəyərdin?',
      },
      en: {
        quote: 'Your time is limited, so don’t waste it living someone else’s life.',
        role: 'Apple co-founder · creativity',
        title: 'Making room for your own path',
        intro:
          'In his 2005 Stanford commencement address, Steve Jobs tells three stories from his life. The speech is about work, but also about listening to your own choices.',
        perspective:
          'Other people’s measures of success do not always match our curiosity. We take this as an invitation to hear your own voice in one decision, rather than change everything at once.',
        practice:
          'Write down three things you spent time on this week. Which did you choose for yourself? Give one of your own interests twenty minutes, simply out of curiosity.',
        question: 'What would you still want to learn if no one else saw the result?',
      },
      tr: {
        quote: 'Zamanın sınırlı, onu başkasının hayatını yaşayarak harcama.',
        role: 'Apple kurucu ortağı · yaratıcılık',
        title: 'Kendi yoluna yer açmak',
        intro:
          'Steve Jobs, 2005 Stanford mezuniyet konuşmasında hayatından üç hikâye anlatır. Konu yalnızca iş değil, insanın kendi seçimlerine kulak vermesidir.',
        perspective:
          'Başkalarının başarı ölçüsü merakımızla her zaman örtüşmez. Bu sözlerden aldığımız fikir, her şeyi birden değiştirmek değil, bir kararda kendi sesimizi duymaktır.',
        practice:
          'Bu hafta zaman ayırdığın üç şeyi yaz. Hangisini gerçekten kendin seçtin? Kendi ilgi alanlarından birine sırf merak için yirmi dakika ayır.',
        question: 'Kimse sonucu görmeyecek olsaydı yine de ne öğrenmek isterdin?',
      },
    },
  },
  {
    id: 'marcus-aurelius',
    author: 'Marcus Aurelius',
    years: '121 — 180',
    theme: 'focus',
    color: '#a8b6a1',
    source: {
      title: 'Meditations · IV.2 · George Long',
      url: 'https://classics.mit.edu/Antoninus/meditations.4.four.html',
      original:
        'Let no act be done without a purpose, nor otherwise than according to the perfect principles of art.',
    },
    related: ['evening', 'quiet-books'],
    text: {
      az: {
        quote: 'Heç bir işi məqsədsiz və sənətin düzgün prinsiplərindən kənar görmə.',
        role: 'Roma imperatoru · stoik düşüncə',
        title: 'Günün içində bir niyyət',
        intro:
          'Marcus Aureliusun Özümə düşüncələr əsəri şəxsi qeydlərdən ibarətdir. Bu qısa cümlə dördüncü kitabda hərəkətin arxasındakı niyyətə diqqət çəkir.',
        perspective:
          'Məqsəd hər dəqiqəni məhsuldar etmək məcburiyyəti deyil. Sakit oxumaq, dincəlmək və kimisə dinləmək də şüurlu seçim ola bilər. Əsas sual bu anı niyə seçdiyimizdir.',
        practice:
          'Növbəti işə başlamazdan əvvəl bir cümlə yaz: bu iyirmi dəqiqənin sonunda nəyi anlamaq istəyirəm? Diqqətin dağılanda həmin cümləyə qayıt.',
        question: 'Bu gün tələsdiyin hansı işin arxasındakı niyyəti yenidən düşünmək istəyirsən?',
      },
      en: {
        quote:
          'Let no act be done without a purpose, nor otherwise than according to the perfect principles of art.',
        role: 'Roman emperor · Stoic thought',
        title: 'An intention inside the day',
        intro:
          'The Meditations of Marcus Aurelius is a collection of personal reflections. This short sentence in Book Four draws attention to the intention behind an action.',
        perspective:
          'Purpose need not mean making every minute productive. Reading quietly, resting and listening can be deliberate choices too. The useful question is why we choose this moment.',
        practice:
          'Before your next task, write one sentence: what do I want to understand by the end of these twenty minutes? Return to it when your attention drifts.',
        question:
          'Which task are you rushing through today whose purpose you would like to reconsider?',
      },
      tr: {
        quote: 'Hiçbir işi amaçsız ve sanatın doğru ilkelerinin dışında yapma.',
        role: 'Roma imparatoru · Stoacı düşünce',
        title: 'Günün içinde bir niyet',
        intro:
          'Marcus Aurelius’un Kendime Düşünceler eseri kişisel notlardan oluşur. Dördüncü kitaptaki bu kısa cümle, eylemin arkasındaki niyete dikkat çeker.',
        perspective:
          'Amaç, her dakikayı verimli geçirmek zorunluluğu değildir. Sakin okumak, dinlenmek ve birini dinlemek de bilinçli bir seçim olabilir. Asıl soru bu anı neden seçtiğimizdir.',
        practice:
          'Bir sonraki işe başlamadan önce bir cümle yaz: bu yirmi dakikanın sonunda neyi anlamak istiyorum? Dikkatin dağıldığında o cümleye dön.',
        question: 'Bugün acele ettiğin hangi işin arkasındaki niyeti yeniden düşünmek istersin?',
      },
    },
  },
  {
    id: 'paul-graham',
    author: 'Paul Graham',
    years: '1964 —',
    theme: 'craft',
    color: '#d0a3a2',
    source: {
      title: 'Paul Graham · Do Things that Don’t Scale, 2013',
      url: 'https://paulgraham.com/ds.html',
      original: "You can't wait for users to come to you. You have to go out and get them.",
    },
    related: ['small-web', 'shared-space'],
    text: {
      az: {
        quote: 'İstifadəçilərin sənə gəlməsini gözləyə bilməzsən. Özün gedib onları tapmalısan.',
        role: 'Y Combinator həmtəsisçisi · sahibkarlıq',
        title: 'İlk addımın insan tərəfi',
        intro:
          'Paul Graham 2013-cü il essesində yeni layihələrin ilk insanlara çatmaq üçün tələb etdiyi əl əməyindən danışır. Buradakı sözlər həmin sahibkarlıq kontekstindəndir.',
        perspective:
          'Sunset üçün bu fikrin maraqlı tərəfi nəticəni gözləmək əvəzinə insanla əlaqə yaratmaqdır. Bir ideyanı gerçəyə çevirmək bəzən böyük təqdimatdan yox, bir yaxşı söhbətdən başlayır.',
        practice:
          'Üzərində düşündüyün ideyanı bir nəfərə anlat və onu dinlə. Satmağa çalışmaq əvəzinə, onun nəyi çətin hesab etdiyini soruş.',
        question: 'İdeyanı bir az yaxşılaşdırmaq üçün bu həftə kiminlə danışa bilərsən?',
      },
      en: {
        quote: "You can't wait for users to come to you. You have to go out and get them.",
        role: 'Y Combinator co-founder · entrepreneurship',
        title: 'The human side of a first step',
        intro:
          'In his 2013 essay, Paul Graham discusses the hands-on work of reaching the first people for a new project. These words belong to that startup context.',
        perspective:
          'For Sunset, the interesting part is making contact with a person instead of waiting for an outcome. Turning an idea into something real sometimes starts with one good conversation.',
        practice:
          'Explain an idea you are working on to one person, then listen. Instead of trying to sell it, ask what they find difficult.',
        question: 'Who could you talk to this week to make your idea a little better?',
      },
      tr: {
        quote: 'Kullanıcıların sana gelmesini bekleyemezsin. Gidip onları kendin bulmalısın.',
        role: 'Y Combinator kurucu ortağı · girişimcilik',
        title: 'İlk adımın insani tarafı',
        intro:
          'Paul Graham, 2013 tarihli denemesinde yeni projelerin ilk insanlara ulaşmak için gerektirdiği emeği anlatır. Bu sözler o girişimcilik bağlamından gelir.',
        perspective:
          'Sunset için ilginç olan, sonucu beklemek yerine insanla bağlantı kurmaktır. Bir fikri gerçeğe dönüştürmek bazen büyük bir sunumdan değil, iyi bir sohbetten başlar.',
        practice:
          'Üzerinde düşündüğün fikri bir kişiye anlat ve onu dinle. Satmaya çalışmak yerine neyi zor bulduğunu sor.',
        question: 'Fikrini biraz geliştirmek için bu hafta kiminle konuşabilirsin?',
      },
    },
  },
  {
    id: 'epictetus',
    author: 'Epictetus',
    years: 'c. 50 — 135',
    theme: 'calm',
    color: '#a2b6c8',
    source: {
      title: 'Enchiridion · 1 · Elizabeth Carter',
      url: 'https://classics.mit.edu/Epictetus/epicench.html',
      original: 'Some things are in our control and others not.',
    },
    related: ['digital-break', 'window-world'],
    text: {
      az: {
        quote: 'Bəzi şeylər bizim nəzarətimizdədir, bəziləri isə deyil.',
        role: 'Filosof · diqqət və daxili sakitlik',
        title: 'Dəyişə bildiyin yerdən başla',
        intro:
          'Epiktetin düşüncələrini toplayan Enchiridion nəzarətimizdə olan və olmayan şeyləri ayırmaqla başlayır. Bu fərq stoik düşüncənin tanınmış mövzularındandır.',
        perspective:
          'Hər nəticəni idarə edə bilmirik, amma atacağımız növbəti addımı seçə bilərik. Bu, çətinliyi kiçiltmək deyil; diqqəti real hərəkət edə bildiyimiz yerə yönəltmək üçün bir sualdır.',
        practice:
          'Səni düşündürən bir məsələni iki sütuna böl: təsir edə bildiklərim və edə bilmədiklərim. Bu gün üçün birinci sütundan bir kiçik addım seç.',
        question:
          'Hazırda enerjini alan məsələnin hansı hissəsinə kiçik də olsa təsir edə bilərsən?',
      },
      en: {
        quote: 'Some things are in our control and others not.',
        role: 'Philosopher · attention and inner calm',
        title: 'Start where you can make a change',
        intro:
          'The Enchiridion, which collects the teachings of Epictetus, begins by separating what is in our control from what is not. This distinction is a familiar theme in Stoic thought.',
        perspective:
          'We cannot manage every outcome, but we can choose a next step. This is a question for directing attention toward something actionable, rather than dismissing a difficulty.',
        practice:
          'Split a concern into two columns: things I can influence and things I cannot. Choose one small action from the first column for today.',
        question: 'Which part of something taking your energy could you influence, even a little?',
      },
      tr: {
        quote: 'Bazı şeyler bizim kontrolümüzdedir, bazıları ise değildir.',
        role: 'Filozof · dikkat ve iç huzur',
        title: 'Değiştirebildiğin yerden başla',
        intro:
          'Epiktetos’un öğretilerini toplayan El Kitabı, kontrolümüzde olan ve olmayan şeyleri ayırarak başlar. Bu ayrım Stoacı düşüncenin tanınmış konularındandır.',
        perspective:
          'Her sonucu yönetemeyiz, ama bir sonraki adımı seçebiliriz. Bu, zorluğu küçümsemek değil; dikkati gerçekten harekete geçebileceğimiz yere yöneltmek için bir sorudur.',
        practice:
          'Seni düşündüren bir konuyu iki sütuna ayır: etkileyebildiklerim ve etkileyemediklerim. Bugün için ilk sütundan küçük bir adım seç.',
        question: 'Şu anda enerjini alan konunun hangi bölümünü biraz da olsa etkileyebilirsin?',
      },
    },
  },
];

export const ideaImage = (id: string) => `${import.meta.env.BASE_URL}assets/idea-${id}.svg`;
export const ideaThemes: IdeaTheme[] = ['focus', 'craft', 'courage', 'calm'];
