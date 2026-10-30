# Sunset

AZ, EN və TR dillərində nümunə xəbər blogu. Bütün hekayələr **Nümunə / Sample / Örnek** kimi işarələnib.

## Açılış

`index.html` faylını brauzerdə aç və ya Python 3 ilə `npm run dev` əmrini işə sal. İstehsal üçün server, verilənlər bazası və build addımı lazım deyil. Bütün şəkillər layihədədir; şriftlər üçün Google Fonts istifadə olunur və şəbəkə olmadıqda sistem şriftləri işləyir.

## Funksiyalar

- Açıq və qaranlıq rejim; seçim brauzerdə yadda qalır.
- İnterfeys və yeddi nümunə hekayə üçün AZ / EN / TR tərcümələri.
- Başlıq və məzmuna görə axtarış, kateqoriya filtrləri, oxuma müddətinə görə sıralama.
- Brauzerdə saxlanılan oxu siyahısı və açılmış hekayələr üçün oxunma nişanı.
- Tam nümunə mətnli oxuma pəncərəsi, mətn ölçüsü, növbəti hekayə və paylaşım keçidləri.
- Paylaşım keçidi birbaşa hekayəni açır. Buferə çıxış mümkün olmadıqda əl ilə kopyalama sahəsi göstərilir.
- Scroll animasiyaları, kart keçidləri və `prefers-reduced-motion` dəstəyi.
- Mobil menyu, klaviatura dəstəyi, bildirişlər və yuxarı qayıt düyməsi.

## Demo sərhədləri

Abunə forması yalnız brauzerdə demo abunə vəziyyətini saxlayır. E-poçt ünvanı saxlanılmır və məktub göndərilmir. Xəritə, sosial hesablar və əlaqə ünvanı nümunədir; düymələr bunu izah edən məlumat pəncərəsini açır. Real göndəriş və profillər üçün ayrıca xidmət və ünvanlar əlavə edilməlidir. Məlumatlar cihazlar arasında sinxronlaşmır.

## Testlər

```sh
npm ci
npx playwright install chromium
npm test
```

Sistem Chromium-u `/usr/bin/chromium` yolunda olduqda avtomatik istifadə edilir. Başqa yol üçün `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` təyin etmək olar. Testlər öz yerli serverini 3131 portunda başladır və sonunda dayandırır.

## GitHub Pages

**Settings → Pages → Build and deployment** bölməsində:

- **Source:** Deploy from a branch
- **Branch:** main
- **Folder:** / (root)

**Save** düyməsini seç. Sonrakı `main` yeniləmələrini GitHub Pages avtomatik yayımlayır.
