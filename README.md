# Arcanum Information Technology

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-12.17-FFCA28?style=for-the-badge&logo=firebase)

Official digital platform and CMS Cockpit for **Arcanum Information Technology** — a professionally managed software development firm based in the UAE delivering enterprise ERPs, core banking integrations, clinical management systems, and legacy Oracle Forms modernization.

---

## 🚀 Features

- **Modern & Responsive Design**: Next.js 14 App Router, TypeScript, and high-tech dark slate UI (`#0f172a`).
- **Dynamic CMS Section Editor**: Real-time Firestore synchronized content editor for Hero narrative, Solutions, Product Catalog, Global Tech Hubs (Abu Dhabi, Kerala, Gujarat), and Contact channels.
- **Visitor Analytics & Telemetry**: Site-wide real-time visitor counting, persistent client visitor tracking, and daily session analytics.
- **Enterprise Inquiry Management**: Contact inquiry management flow with encrypted Firestore persistence and automated Nodemailer email alerts.
- **Cinematic Animations**: Smooth scroll dynamics powered by Lenis and animations crafted with Framer Motion & GSAP.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **UI Engine** | [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Backend & DB** | [Firebase Firestore](https://firebase.google.com/), Firebase Auth |
| **Animations** | [Framer Motion](https://www.framer.com/), [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/) |
| **Email Service** | [Nodemailer](https://nodemailer.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🔥 Firebase Setup & Migration Guide

Follow these steps to connect the app to a live Firebase project and migrate local CMS data:

### Step 1: Set Environment Credentials

Create or update your `.env` file in the root directory:

```env
# FIREBASE BACKEND CONFIGURATION
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX

# NODEMAILER SMTP NOTIFICATION SERVICE
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@arcanum.ae
SMTP_PASS="your-app-password"
SMTP_FROM="Arcanum IT <info@arcanum.ae>"
NOTIFICATION_RECEIVER_EMAIL=info@arcanum.ae
```

### Step 2: Configure Firebase Console

1. **Enable Admin Authentication**:
   - Go to [Firebase Console](https://console.firebase.google.com/) → **Build → Authentication → Get Started**.
   - Enable **Email/Password** under *Sign-in method*.
   - Under **Users**, click **Add User** and create your admin account (e.g. `admin@arcanum.ae` / `Password123!`).

2. **Set Cloud Firestore Rules**:
   - Go to **Build → Cloud Firestore → Rules** and paste the security configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // CMS Content: Public read, Admin write
    match /cms_content/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Analytics: Public tracking write & read
    match /analytics_daily/{date} {
      allow read, write: if true;
    }
    match /analytics_summary/{docId} {
      allow read, write: if true;
    }
    // Inquiry Leads: Public submission create, Admin-only manage
    match /inquiries/{inquiryId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### Step 3: Seed & Migrate Local Data to Firebase

Run the automated data sync utility script to seed local backup dataset (`data/cms_backup.json` and `data/arcanumData.ts`) directly into Cloud Firestore:

```bash
npm run seed-firebase
```

To pull the latest live Cloud Firestore data back to local static files:

```bash
npm run sync-data
```

---

## 🚀 Deployment Instructions

### Option A: Deploy to Vercel (Recommended)

1. Push your repository to GitHub / GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. Add all environment variables from `.env` in project settings.
4. Click **Deploy**.

### Option B: Deploy to Node.js Server / VPS

```bash
# 1. Install dependencies
npm install

# 2. Seed data to your live Firebase database
npm run seed-firebase

# 3. Create production build bundle
npm run build

# 4. Start production server
npm run start
```

---

## 📜 Available Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Builds the application for production.
- `npm run start` — Starts the production server.
- `npm run lint` — Runs TypeScript and ESLint typechecks.
- `npm run seed-firebase` — Seeds local backup content into Cloud Firestore.
- `npm run sync-data` — Pulls live Cloud Firestore content to `data/arcanumData.ts`.

---

## 📁 Project Structure

```text
Arcanum/
├── app/                  # Next.js 14 App Router layout & pages
│   ├── admin/            # Admin Dashboard Cockpit & CMS Section Editor
│   ├── api/              # API routes (CMS, Analytics, Inquiries)
│   ├── globals.css       # Global styles & Tailwind directives
│   ├── layout.tsx        # Root layout with Lenis & Analytics Tracker
│   └── page.tsx          # Main landing page component
├── components/           # UI components & section layouts
├── data/                 # JSON backups & static data assets
├── lib/                  # Firebase SDK & analytics services
├── public/               # Public images & assets
├── scripts/              # Firebase synchronization scripts
└── README.md
```

---

## 📄 License

Copyright © Arcanum Information Technology. All rights reserved.
