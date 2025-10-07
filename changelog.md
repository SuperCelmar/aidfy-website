## Changelog

This changelog is generated from git history. Dates are in local time.

### 2025-10-07
- **Fixed 404 issue for dynamically added templates and tutorials:**
  - Added `export const dynamicParams = true;` to `app/templates/[slug]/page.tsx` to allow templates added after build time to be generated on-demand
  - Added `export const dynamicParams = true;` to `app/tutorials/[slug]/page.tsx` to allow tutorials added after build time to be generated on-demand
  - This prevents 404 errors when new content is added to the database without requiring a full site redeployment

### 2025-10-06
- Templates and Tutorials pages now fetch on page refresh only:
  - Added `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` to `app/templates/page.tsx` and `app/tutorials/page.tsx` to prevent build-time/static refetching.
  - Added Vitest tests asserting these flags for both pages.
  - Removed Voiceflow agent widget from `app/layout.tsx` and updated tests to assert its absence.

### 2025-06-14
- Implement fresh Supabase connection functionality and update dependencies (c18359c)
- Merge branch 'main' of github.com/SuperCelmar/aidfy-website into development (d0885eb)

### 2025-08-26
- Refactor color palette to modular CSS variables with light/dark tokens
- Map Tailwind color utilities to CSS variables for runtime theming
- Keep gradient/sparkles effects bound to tokens for consistency
- Add new default palette (Space Cadet): full scales in Tailwind and theme tokens
- Added Vitest config and tests for ROI calculator and profile normalization.
- Created `profiles/getseoni.json` seed profile.
- Implemented analytics utility with session ID and `/api/track` endpoint (service role insert to `funnel_events`).
- Implemented `/api/profile/[company]` to load from local profile then Supabase `demo_profiles`.
- Refactored `app/demo/[company]/page.tsx` to dynamic, themed 6-slide funnel with ROI calculator and analytics hooks. Removed chatbot embed placeholder per request; CTA only for now.
- Scripts: added `test`, `test:watch`, and `format` to `package.json`.

### 2025-09-14
- Integrated Voiceflow chat widget globally in `app/layout.tsx` using `next/script` with `afterInteractive`.
- Added SSR tests in `__tests__/voiceflow-widget.test.tsx` to verify widget snippet presence and locale detection (navigator.language / navigator.languages[0]).
- Added Vitest setup mocks for Next modules and theme hook to support layout SSR in tests.
- Added console log of detected locale in Voiceflow loader for debugging (wrapped in try/catch).

### 2025-05-26
- Add suspense loading for tutorial filters in TutorialsPage component (131dd65)
- Enhance application with new features and styling updates (41a3d6a)

### 2025-05-25
- Remove unused remote image patterns from next.config.js (1a11f34)

### 2025-05-15
- Enhance application functionality and update dependencies (26a07b3)

### 2025-05-14
- Update date formatting in TemplateDetailClient component (4c7eb4a)
- Enhance TemplateDetailClient and Footer components (baae7c7)

### 2025-05-13
- Refactor layout for TemplateDetailClient component (40c676a)
- Enhance layout structure and update dependencies (c79ba84)

### 2025-05-11
- Update Header description interaction for hero section (8272fcd)
- Update the whole responsiveness of the website (c3e04f5)
- Add responsiveness (b3a36c4)
- Updated the footer (44a38a3)
- Updated correct link to CDN images (513301e)
- Big update UI: Chatbot UI cleaned, assets moved to Supabase CDN, copy improvements (cc6f360)

### 2025-05-10
- Re-add tailwind.config.ts as a normal file (b4d4ce3)
- Re-add postcss.config.js as a normal file (c9bee51)
- Re-add package-lock.json as a normal file (de179b7)
- Stop tracking package-lock.json with Git LFS (0f7783c)
- Added utils from lib (860e737)
- Modified tsconfig (19767a1)
- Corrected next.config.mjs (f50585b)
- Update attributes (1ef1655)
- Remove Git LFS tracking for package.json (dffcfe7)
- Remove Git LFS tracking from package.json (09ec272)
- App added (16d5cf9)
- App added (9bc4a55)
- Components react added (ebb97c7)
- Remove large files from version control (75be751)
- Try to large file add png (70b5c5a)
- Public files added: assets, creatives (08286c4)
- Project Config added (df2e560)
- first commit (5293ebd)
- initialized the repo with Readme (a7bae40)


