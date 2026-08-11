# Arcanum Information Technology

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-0055FF?style=for-the-badge&logo=framer)

Official website and digital portal for **Arcanum Information Technology** — a professionally managed software development firm based in the UAE delivering enterprise ERPs, core banking integrations, clinical management systems, and Oracle Forms modernization.

---

## 🚀 Features

- **Modern & Responsive Design**: Built with Next.js 14 App Router, TypeScript, and custom Tailwind CSS design system.
- **Cinematic Animations & Motion**: Smooth scroll dynamics powered by Lenis and UI animations crafted with Framer Motion.
- **Enterprise Solutions Showcase**: Interactive presentation of core software domains including ERPs, Core Banking, Healthcare, Education, and Cloud Infrastructure.
- **Interactive Modals & Catalogs**: Seamless brochure previews/downloads and contact inquiry flows.
- **SEO & Performance Optimized**: Embedded semantic tags, Open Graph meta configurations, and optimized modern web performance.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **UI Library** | [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **Animations** | [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Utilities** | `clsx`, `tailwind-merge` |

---

## 📁 Project Structure

```text
Arcanum/
├── app/                  # Next.js 14 App Router layout, metadata & entry pages
│   ├── globals.css       # Global styles & Tailwind directives
│   ├── layout.tsx        # Root layout with providers & SEO metadata
│   └── page.tsx          # Main landing page component
├── components/           # Reusable UI components & section layouts
│   ├── AboutSection.tsx
│   ├── BrochureModal.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroTopSection.tsx
│   ├── LenisProvider.tsx
│   └── SolutionsSection.tsx
├── data/                 # JSON & static data assets
├── public/               # Static assets & public media
├── tailwind.config.js    # Tailwind configuration & design tokens
└── tsconfig.json         # TypeScript compiler configurations
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jestinxavier/Arcanum.git
   cd Arcanum
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` — Starts the Next.js development server.
- `npm run build` — Builds the application for production optimization.
- `npm run start` — Starts the Next.js production server.
- `npm run lint` — Runs Next.js ESLint checker.

---

## 📄 License

Copyright © Arcanum Information Technology. All rights reserved.
