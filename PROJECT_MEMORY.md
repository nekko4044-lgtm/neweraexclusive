# New Era Exclusive

- Live site: https://neweraexclusive.ae ; locales `/ru/`, `/en/`, `/ar/`.
- Next.js 14 static export (`npm run build` → `out/`), next-intl, Tailwind.
- Repository: `nekko4044-lgtm/neweraexclusive`, branch `main`.
- Production: Cloudflare Pages `neweraexclusive`, GitHub workflow `Weekly Blog Deploy` (ID `319052507`). Push source, dispatch workflow, wait for success, verify live site.
- Local Wrangler OAuth was unavailable in this session; use the existing GitHub workflow.
- Founder section: `components/About.tsx`; translations: `messages/{locale}.json`; portrait: `public/ksenia-bulgakova.webp`.
- Mobile WebKit collapses the previous grid item with `aspect-ratio` and an absolutely positioned image to 0×0. Keep the portrait in normal flow on mobile with explicit intrinsic width/height. Desktop may position it absolutely in the stretched grid column. Test fresh mobile WebKit, not only Chromium or HTTP status.
- Founder title is exactly `Founder and CEO` in every locale. Keep the gold quote border and centered full-width statistics.
- Dubai years: five in 2026, +1 each calendar year in Asia/Dubai, calculated client-side without rebuilding. Translated label uses ICU pluralization.
- Shared menu: `components/Navbar.tsx`. From catalog/blog, section links must target the locale homepage plus fragment, not local `#about` etc.
- Catalog hero: `app/[locale]/catalog/page.tsx`. Decorative full-screen title layer must not intercept clicks; breadcrumb sits above it.
- Required catalog videos are tracked exceptions to `*.mp4` in `.gitignore`: `public/videos/hero-desktop.mp4`, `hero-mobile-lite.mp4`. Keep the responsive static posters visible while video loads or fails.
- Browser checks: actual clicks on catalog breadcrumb, logo, all six menu entries; mobile RU/EN/AR; fresh WebKit without cache; portrait bounding box must have positive dimensions.
