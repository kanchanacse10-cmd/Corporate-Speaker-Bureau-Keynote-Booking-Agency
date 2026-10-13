# SummitSpeak Bureau
> **Exceptional Voices. Extraordinary Events.**

A **Corporate Speaker Bureau & Keynote Booking Agency** web platform designed for discovering, contracting, and managing high-caliber keynote speakers for executive conferences, leadership summits, and corporate events.

---

## 🏛️ Brand Identity & Corporate Color Theme

- **Primary (Executive Midnight Navy):** `#0B192C`
- **Primary Hover (Obsidian Navy):** `#06101E`
- **Secondary (Radiant Champagne Gold):** `#C89D4B` / `#D4AF37`
- **Soft Background (Crisp Porcelain Slate):** `#F8FAFC`
- **Secondary Background (Architectural Platinum Slate):** `#EEF2F7`
- **Main Text (Obsidian Slate):** `#0F172A`
- **Secondary Text (Executive Slate):** `#475569`
- **Border (Clean Hairline Border):** `#E2E8F0`
- **Dark Mode Palette:** Background `#090E17`, Secondary `#0F1726`, Cards `#152132`, Text `#F8FAFC`, Accent `#D4AF37`, Borders `#223147`
- **Typography:** Headings: `Manrope`, Body: `Inter`

---

## 📂 Page Directory & Architecture

### 1. Public Marketing Website
- [`index.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/index.html) — **Homepage**
  - Dramatic keynote hero stage photograph with trust strip
  - 6 Featured speaker cards with portraits, topics, fee indicators, and quick-shortlist buttons
  - Browse by Topic (10 categories) and Browse by Industry (8 categories)
  - Interactive "Find the Right Speaker" discovery tool
  - Corporate events supported, 4-step process timeline, client portal preview, testimonials, and FAQs
- [`pages/speaker-roster.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/speaker-roster.html) — **Speaker Directory**
  - Instant text search and real-time filtering by Topic, Industry, Format, and Sort Order
- [`pages/speaker-profile.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/speaker-profile.html) — **Speaker Profile Details**
  - Dynamic loading by ID, executive biography, signature keynotes, audience suitability, verified publications, video reel preview, downloadable speaker kit, and pre-populated booking CTA
- [`pages/topics-industries.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/topics-industries.html) — **Topics & Industries Discovery**
- [`pages/services.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/services.html) — **Services Breakdown**
- [`pages/how-it-works.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/how-it-works.html) — **How It Works (8-Step Journey)**
- [`pages/about.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/about.html) — **About Us (8 Sections)**
- [`pages/insights.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/insights.html) — **Editorial Articles**
- [`pages/article-detail.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/article-detail.html) — **Dedicated Article Reader**
- [`pages/contact.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/contact.html) — **Contact & Enquiries**
- [`pages/book-a-speaker.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/pages/book-a-speaker.html) — **Multi-Step Interactive Booking Engine**

### 2. Authentication Suite
- [`auth/login.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/auth/login.html) — Auditorium keynote backdrop, 1-click demo login credentials for *Apex Global Enterprises*
- [`auth/signup.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/auth/signup.html) — Event planner backdrop, client onboarding form
- [`auth/forgot-password.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/auth/forgot-password.html) — Venue lounge backdrop, neutral security reset confirmation

### 3. Client Portal SaaS Application
- [`dashboard/index.html`](file:///c:/Blue%20Chip%20Projects/Corporate%20Speaker%20Bureau%20&%20Keynote%20Booking%20Agency/dashboard/index.html) — **12-View Client Dashboard**
  1. **Overview:** KPIs, 6-stage booking pipeline, upcoming events, and live activity log
  2. **Find a Speaker:** Search and filter integrated directory
  3. **My Shortlist:** Saved speakers with notes and direct booking request
  4. **Booking Requests:** Live table with status badges and detail modal
  5. **Confirmed Bookings:** Confirmed engagements and 4-point event preparation checklist
  6. **Event Calendar:** Monthly calendar grid with confirmed vs tentative pills
  7. **Contracts & Documents:** Booking agreement viewer with mock electronic signature workflow
  8. **Invoices & Payments:** Financial breakdown and mock deposit payment simulation
  9. **Booking History:** Chronological audit trail
  10. **Notifications:** Notification feed with unread indicators
  11. **Company Profile & Team:** Profile settings and role-based user management
  12. **Help & Support:** Assigned booking director contact card and escalation ticketing

---

## ⚙️ Features & Architecture

- **Theme Engine (`assets/js/theme.js`):** Independent Light/Dark mode and LTR/RTL layout direction toggles with persistent `localStorage` memory and zero flash of unstyled content.
- **RTL Support (`assets/css/rtl.css`):** Full bidirectional mirroring including sidebar docking, forms, card actions, and table layouts.
- **Client Storage Engine (`assets/js/storage.js`):** State persistence in `localStorage` for shortlists, new bookings created via the wizard, contract signing events, and simulated payments.
- **Zero Broken Links:** All generated imagery is organized into dedicated directories (`assets/images/hero/`, `speakers/`, `events/`, `topics/`, `about/`, `insights/`, `auth/`).
