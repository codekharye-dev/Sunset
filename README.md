# Sunset

AZ, EN və TR dillərində nümunə xəbər blogu. Yeni React versiyası hazır statik fayllarla birlikdə bu repozitoriyadadır. Bütün hekayələr **Nümunə / Sample / Örnek** kimi işarələnib.

## Quruluş

- `web/` — React, TypeScript, Tailwind CSS və shadcn quruluşunda mənbə kodu.
- `index.html`, `assets/`, `.nojekyll` — GitHub Pages-in birbaşa yayımladığı, `web/` mənbəsindən hazırlanmış fayllar.
- `scripts/publish-static.mjs` — yığımı ana qovluğa köçürür, yalnız əvvəlki yığımın köhnəlmiş fayllarını təmizləyir.
- `legacy/v1/` — əvvəlki saytın dəyişdirilməmiş tam nüsxəsi. Köhnə sayt `/legacy/v1/` yolunda ayrıca açılır.
- `backup/sunset-v1-d6f9191` — GitHub-da əvvəlki işlək versiyanı saxlayan branch.

## İnkişaf və test

Node.js 20+ və Python 3 ilə:

```sh
npm run setup
npm run dev
npm test
```

Testlər üçün Chromium lazımdır. Sistem Chromium-u yoxdursa: `cd web` və `npx playwright install chromium`. Başqa icra faylı üçün `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` istifadə olunur.

## Saytı yeniləmək

```sh
npm run build
npm run preview
```

Build əmri TypeScript yoxlamasını və Vite yığımını işlədir, sonra nəticəni hazır GitHub Pages ana qovluğuna köçürür. Mənbə və yaradılmış fayllar birlikdə commit olunmalıdır. `assets/` qovluğunu əl ilə dəyişmək əvəzinə şəkilləri `web/public/assets/` daxilində yenilə.

GitHub Pages ayarı **Deploy from a branch → main → / (root)** olaraq qalır. Əlavə Actions icazəsi və ya yeni hostinq quruluşu tələb olunmur. Hash marşrutları ayrıca server yönləndirməsi olmadan işləyir.

## Əvvəlki versiyaya qayıtmaq

Əvvəlki sayt `legacy/v1/index.html` daxilindədir və Git tarixçəsi də qorunur. Tam köhnə vəziyyət GitHub-da `backup/sunset-v1-d6f9191` branch-ində saxlanılır. Yeni tarixçəni silmək və ya force-push etmək əvəzinə dəyişiklik commit-i `git revert` ilə geri alına bilər.

## Funksiyalar

Ayrı ana səhifə, kəşf, mövzu, məqalə, oxu siyahısı, seçimlər və haqqımızda səhifələri; əyilmiş 3D şəkil lenti; axtarış, filtrlər, sıralama və səhifələmə; oxuma gedişi və davam etmə; mətn ölçüsü, diqqət rejimi, paylaşım və saxlanılanlar.

**Seçmələr** (`#/collections`) dörd redaksiya kolleksiyasını ayrıca səhifələrdə təqdim edir. **Günün ritmi** (`#/daily`) 5, 10 və ya 15 dəqiqəlik vaxta və əhvala uyğun oxu planı hazırlayır. Alternativ seçimlər vaxt həddini aşmır; plan bir düymə ilə təkrarsız saxlanılır. Oxunmuş hekayələr mövcud oxu tarixçəsindən götürülür. Yeni səhifələr AZ, EN və TR dillərini və hər iki görünüşü dəstəkləyir.

Dil, görünüş və oxu seçimləri `sunset.v2.*` açarlarında saxlanılır. Mövcud `sunset.*` seçimləri ilk açılışda oxunur, silinmir və dəyişdirilmir. Bu, köhnə versiyaya qayıdanda əvvəlki seçimlərin də qalmasını təmin edir.

Göndərilmiş `TiltedGridHero` komponenti `web/src/components/ui/tilted-grid-hero.tsx` daxilindədir. shadcn alias-ları `web/components.json`, Tailwind və dizayn dəyişənləri `web/src/styles.css`, `cn` köməkçisi `web/src/lib/utils.ts` fayllarındadır. Yeni shadcn komponenti üçün `web/` daxilində `npx shadcn@latest add <component>` istifadə oluna bilər.

Göndərilmiş `navigation-menu-05` komponenti `web/src/components/ui/navigation-menu-05.tsx`, onun Radix/shadcn primitivləri `web/src/components/ui/navigation-menu.tsx` daxilindədir. Layihənin standart UI yolu `@/components/ui` → `web/src/components/ui` olduğundan ayrıca kök `components/ui` qovluğu yaratmaq lazım deyil. React, TypeScript, Tailwind və `cn` artıq qurulub; əlavə Radix paketləri `npm run setup` ilə quraşdırılır. Vite və GitHub Pages quruluşuna uyğun olaraq `next/link` yerinə mövcud hash keçidləri istifadə edilir; Next.js əlavə edilmir. Headerin aktiv alt xətti həm ana, həm də daxili səhifələrdə cari bölməni izləyir.

Header və yeni səhifələrin üslubları `web/src/styles/refinements.css` faylındadır. Animasiyalar həm sistemin `prefers-reduced-motion` seçiminə, həm də saytdakı hərəkət parametrinə əməl edir.

Abunə forması demodur: e-poçt saxlanılmır və məktub göndərilmir. Bütün xəbərlər, ünvanlar və sosial hesablar nümunədir.
