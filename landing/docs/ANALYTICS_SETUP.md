# Landing page analytics — setup checklist

Use this **before** adding any tracking code to the `landing/` app. Complete the external setup first, then implement in the repo.

**Site:** `https://stack-forge.aitaouss.me/` (update if your domain changes)

---

## Todo (before writing code)

- [ ] **Pick a provider** (see comparison below).
- [ ] **Confirm who owns the site** (you need admin access to the domain or hosting).
- [ ] **Decide on cookies / privacy** — if you use GA4 in the EU/UK, plan a cookie notice and privacy policy link (legal advice is your responsibility).
- [ ] **List what you want to measure** (minimum: page views; optional: npm/GitHub clicks, chatbot opens).
- [ ] **Create accounts** for the chosen tool (Google, Plausible, Vercel, etc.).
- [ ] **Copy credentials into a local env file only** — never commit secrets (use `.env.local`, add to `.gitignore`).

### Provider comparison (quick)

| Provider                     | Cost                | Cookie banner often needed (EU) | Good for                              |
| ---------------------------- | ------------------- | ------------------------------- | ------------------------------------- |
| **Google Analytics 4 (GA4)** | Free                | Often yes                       | Full funnels, campaigns, demographics |
| **Google Search Console**    | Free                | N/A (not on-site JS)            | Google Search clicks/impressions      |
| **Plausible**                | Paid                | Usually lighter                 | Simple, privacy-focused dashboard     |
| **Vercel Analytics**         | Paid tier on Vercel | Usually lighter                 | Easiest if hosted on Vercel           |
| **Cloudflare Web Analytics** | Free                | Often none                      | Sites proxied through Cloudflare      |

You can use **GA4 + Search Console** together (common combo).

---

## Part A — Google Analytics 4 (GA4)

### A1. Create property (Google side)

1. Open [Google Analytics](https://analytics.google.com/).
2. **Admin** (gear) → **Create** → **Property**.
3. Property name: e.g. `StackForge Landing`.
4. Time zone & currency: your preference.
5. Choose **Web** as the platform.

### A2. Data stream

1. In the property → **Data streams** → **Add stream** → **Web**.
2. **Website URL:** `https://stack-forge.aitaouss.me`
3. **Stream name:** e.g. `StackForge production`.
4. Create stream.

### A3. What to copy (save in a password manager / notes)

| Item               | Where to find it                      | Use in project                      |
| ------------------ | ------------------------------------- | ----------------------------------- |
| **Measurement ID** | Stream details, format `G-XXXXXXXXXX` | `NEXT_PUBLIC_GA_ID` in `.env.local` |

Optional (advanced / server-side later):

- **Measurement Protocol API secret** — only if you send events from a server; not required for basic page views.

### A4. Recommended GA4 settings (optional but useful)

In **Admin → Data collection and modification**:

- [ ] **Data retention:** set event data retention (e.g. 14 months) under **Data retention**.
- [ ] **Google signals:** enable only if you want ads/remarketing features (off is fine for a dev tool landing page).

In **Admin → Data display → Events**:

- [ ] After launch, mark key events as **conversions** (e.g. `click_npm`, `click_github`) once you send them from code.

### A5. After you have `G-XXXXXXXXXX` — code todo (landing repo)

Do these **after** Part A is done:

- [ ] Add to `landing/.env.local` (create file if missing):

  ```env
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
  ```

- [ ] Add to `landing/.env.local.example` (no real ID):

  ```env
  NEXT_PUBLIC_GA_ID=
  ```

- [ ] Install Next.js helper (recommended):

  ```bash
  cd landing && pnpm add @next/third-parties
  ```

- [ ] In `landing/src/app/layout.tsx`, render:

  ```tsx
  import { GoogleAnalytics } from "@next/third-parties/google";

  // inside <body>, only when ID is set:
  {
    process.env.NEXT_PUBLIC_GA_ID ? (
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    ) : null;
  }
  ```

- [ ] **Production:** set `NEXT_PUBLIC_GA_ID` in your host (Vercel / Netlify / etc.) environment variables.
- [ ] Deploy and verify (see **Verification** below).

---

## Part B — Google Search Console (optional, no visitor JS)

Complements GA4 with **search** performance (not real-time on-site visitors).

### B1. Add property

1. [Google Search Console](https://search.google.com/search-console).
2. **Add property** → **URL prefix:** `https://stack-forge.aitaouss.me/`

### B2. Verify ownership (pick one method)

- **HTML file** upload to `public/` in Next.js, or
- **DNS TXT record** at your registrar, or
- **Google Analytics** — if GA4 is already installed on the same domain.

### B3. After verification

- [ ] Submit sitemap when you have one (e.g. `https://stack-forge.aitaouss.me/sitemap.xml` — add sitemap in a later task if missing).
- [ ] Check **Pages** and **Queries** after a few days (data is delayed).

---

## Part C — Plausible (alternative to GA4)

### C1. Before code

1. Sign up at [plausible.io](https://plausible.io) (or self-host Umami).
2. Add site: `stack-forge.aitaouss.me`.
3. Copy the **script snippet** or data domain from the dashboard.

### C2. Code todo

- [ ] Add script via `next/script` in `layout.tsx` with `strategy="afterInteractive"`.
- [ ] Or use env: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=stack-forge.aitaouss.me`.

No `G-` ID for Plausible.

---

## Part D — Vercel Analytics (if hosted on Vercel)

### D1. Before code

- [ ] Project connected to Vercel.
- [ ] Enable **Analytics** in Vercel project → Settings → Analytics.

### D2. Code todo

```bash
cd landing && pnpm add @vercel/analytics
```

In `layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";
// inside body: <Analytics />
```

---

## Verification (after deploy)

### GA4

- [ ] Open site in incognito, browse 2–3 pages.
- [ ] GA4 → **Reports → Realtime** — you should see **1 active user** (can take 30–60 seconds).
- [ ] **Admin → Data streams** → your stream → confirm **Receiving traffic** in last 48 hours (may take longer for full reports).

### Ad blockers

- [ ] Test with ad blocker on/off — many users block GA; expect under-counting.

### Production env

- [ ] Confirm `NEXT_PUBLIC_*` vars are set on the host (build-time for Next.js public env vars).

---

## Suggested custom events (implement later)

Track in GA4 (or Plausible goals) once basic page views work:

| Event name         | When                                       |
| ------------------ | ------------------------------------------ |
| `click_npm`        | User clicks npm link                       |
| `click_github`     | User clicks GitHub link                    |
| `click_docs`       | Documentation / external docs link         |
| `chatbot_open`     | StackForge Assistant opened                |
| `copy_cli_command` | Copy on `npx create-stackforge-app@latest` |

Document event names here when implemented so marketing and code stay aligned.

---

## Files checklist (this repo)

| File                              | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `landing/.env.local`              | Real `NEXT_PUBLIC_GA_ID` (gitignored) |
| `landing/.env.local.example`      | Template for other developers         |
| `landing/src/app/layout.tsx`      | Load analytics component              |
| `landing/docs/ANALYTICS_SETUP.md` | This guide                            |

---

## Order of work (summary)

1. Complete **Todo (before writing code)** above.
2. Finish **Part A** (or C/D) in Google / Plausible / Vercel.
3. Copy **Measurement ID** (or domain) into `.env.local`.
4. Implement code steps in **A5** (or C2/D2).
5. Deploy with production env vars.
6. Run **Verification**.
7. Optional: **Part B** Search Console + custom events.

**A5 is implemented** in `layout.tsx` via `@next/third-parties/google`. Set `NEXT_PUBLIC_GA_ID` in `.env.local` (local) and in your host env (production).
