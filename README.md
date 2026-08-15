# 🍽️ TableTurn — Bangladesh Restaurant Discovery & Table Reservation Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="TableTurn Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>Next-Generation Dining Experience & Bespoke Seating Reservations across all 8 Administrative Divisions of Bangladesh 🇧🇩</strong>
</p>

<p align="center">
  <a href="https://github.com/asnayem1122/TableTurn"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repo" /></a>
  <a href="#-features"><img src="https://img.shields.io/badge/Features-8%20Divisions-FF5A5F?style=for-the-badge&logo=compass" alt="Divisions" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-MERN%20%2B%20Vite%20%2B%20Tailwind-00D26A?style=for-the-badge&logo=react" alt="Tech Stack" /></a>
  <a href="#-deployment"><img src="https://img.shields.io/badge/Deploy-Vercel%20%26%20Render-000000?style=for-the-badge&logo=vercel" alt="Deployment" /></a>
  <a href="https://github.com/asnayem1122/TableTurn/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" /></a>
</p>

---

## 🚀 Live Demo & Links

- **GitHub Repository:** [https://github.com/asnayem1122/TableTurn](https://github.com/asnayem1122/TableTurn)
- **Vercel Frontend Deployment:** Configure & Deploy on [Vercel](https://vercel.com) using the [`client/vercel.json`](client/vercel.json) SPA configuration.
- **Render Backend Service:** Deploy Node.js server on [Render](https://render.com) using `server/` as root directory.

---

## 📖 Overview

**TableTurn** is a high-performance, mobile-responsive restaurant discovery and real-time table reservation platform inspired by OpenTable and Resy, built specifically for the Bangladeshi culinary landscape.

From upscale rooftop lounges in Gulshan & Dhanmondi (Dhaka) to heritage seafood dining in Chattogram, lakefront cafes in Sylhet, and riverside eateries in Barishal — TableTurn connects food lovers with premier dining spots featuring instant booking confirmations, digital QR passes, automated seating allocation, and enterprise-grade VAPT security.

---

## ✨ Key Features

### 🗺️ 1. Nationwide 8-Division Discovery Engine
- **Full Coverage:** Browse top-rated restaurants across **Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh**.
- **Localized Sub-Districts:** Filter by major food hubs (*Gulshan, Banani, Dhanmondi, Uttara, GEC Circle, Agrabad, Zindabazar, Shaheb Bazar, Shibbari*).
- **Dynamic Search & Filters:** Multi-criteria filtering by cuisine types (*Bengali, Mughlai, Italian, Japanese, BBQ, Continental*), price tiers (`৳` to `৳৳৳৳`), and min rating.

### ⚡ 2. Real-Time 4-Step Reservation Engine
- **Interactive Seating Selection:** Choose seating preferences (*Main Dining Room, Open-Air Rooftop, Chef’s Table, VIP Booth, Garden Terrace*).
- **Special Occasion Customization:** Tailor bookings for *Birthdays, Date Nights, Anniversaries, Business Dinners, or Family Gatherings*.
- **Bangladeshi Phone Validation:** Built-in mobile number verification supporting `+8801XXXXXXXXX` and `01XXXXXXXXX` formats.
- **Smart Party Sizing:** Dynamic guest stepper with support for 1 to 25+ diners with instant slot availability check.

### 🎟️ 3. Digital QR Pass & Instant Confirmation
- **Unique Reservation ID:** Automatically generated human-friendly booking codes (`TT-DHK-XXXX`, `TT-CTG-XXXX`).
- **Scannable QR Pass:** On-screen dynamic QR code for host podium check-in.
- **Calendar & Social Integration:** 1-Click **Add to Calendar (.ics download)** and **WhatsApp Booking Share**.
- **Confetti Celebration:** Visual micro-animations upon successful table reservation.

### 👥 4. Role-Based Access & Host Portal
- **Demo Switcher:** Instant 1-click login as **Diner**, **Restaurant Venue Manager**, or **System Administrator**.
- **My Bookings Drawer:** Slide-out management panel to view active reservations, display QR passes, or cancel bookings.
- **Host / Manager Portal:** Dedicated management overview for venue managers to inspect live seating lists.

### 🛡️ 5. Resilient Hybrid Architecture (Zero Downtime)
- **MongoDB Atlas Integration:** Full Mongoose ORM with schema validation for users, restaurants, and reservations.
- **Automatic In-Memory Fallback:** Intelligent client-side store failover ensuring 100% uninterrupted user experience during cold starts or offline database states.

### 🔒 6. Security & VAPT Hardening
- **Rate Limiting & Anti-Bruteforce:** Custom sliding window rate limiters (`authLimiter`, `apiLimiter`) protecting auth and API endpoints against brute-force attacks.
- **Security Headers & CORS Controls:** Production HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`), strict origin validation, and 10kb request payload caps.
- **IDOR & BOLA Prevention:** Ownership verification on reservation lookup/cancellation and mandatory `protect` auth middleware.
- **ReDoS Protection:** Input sanitization (`escapeRegex`) across search and filter queries to prevent regular expression denial of service.
- **Role Escalation Safeguards:** Fixed user role assignments on public registration and environment-restricted demo auth endpoints.

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Description |
|---|---|
| **React 18** | Modern Component Architecture with React Hooks & Context API |
| **Vite 5** | Lightning-fast HMR and optimized production bundling |
| **Tailwind CSS 3** | Utility-first responsive design & custom dark glassmorphism |
| **Framer Motion** | Fluid page transitions, modal drawers & micro-interactions |
| **Lucide Icons** | Clean, modern iconography |
| **Axios** | HTTP client with automatic JWT bearer interception |
| **Canvas Confetti & QRCode.react** | Visual celebrations and dynamic QR pass rendering |

### Backend (Server)
| Technology | Description |
|---|---|
| **Node.js & Express.js** | High-throughput REST API server |
| **MongoDB & Mongoose** | Document database for persistent storage |
| **JWT (JSON Web Tokens)** | Secure stateless authentication |
| **Bcrypt.js** | Industry-standard password hashing |
| **Rate Limiter & Morgan** | Custom sliding window rate limiting and HTTP request logging |

---

## 📁 Project Structure

```bash
TableTurn/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # UI Components (Navbar, Modals, Cards, Filters, QR, Host Portal)
│   │   ├── context/            # AuthContext & ReservationContext
│   │   ├── data/               # Mock dataset & Bangladesh division metadata
│   │   ├── services/           # Axios API Client with offline fallback
│   │   ├── App.jsx             # Main Application Layout & State Router
│   │   ├── main.jsx            # React Root Entrypoint
│   │   └── index.css           # Tailwind & Custom Glassmorphism Design Tokens
│   ├── index.html              # HTML Shell
│   ├── package.json            # Frontend Dependencies & Scripts
│   ├── tailwind.config.js      # Tailwind Configuration
│   ├── vercel.json             # Vercel SPA Rewrite Configuration
│   └── vite.config.js          # Vite Bundler & Dev Proxy Settings
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # Route controllers (Auth, Restaurant, Reservation)
│   ├── data/                   # Seed data across all 8 administrative divisions
│   ├── middleware/             # Auth JWT guard, Rate Limiter & Global Error Handler
│   ├── models/                 # Mongoose schemas (User, Restaurant, Reservation)
│   ├── routes/                 # Express REST API routes
│   ├── package.json            # Server Dependencies & Scripts
│   └── server.js               # Express Server Entrypoint
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package manager
├── README.md                   # Project Documentation
└── start.bat                   # Windows 1-Click Dual Service Launcher
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/asnayem1122/TableTurn.git
cd TableTurn
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 3. Run Locally

#### Option A: 1-Click Launcher (Windows)
Double-click [`start.bat`](start.bat) in the root directory.

#### Option B: Concurrently
```bash
npm run dev
```

#### Option C: Separate Terminals
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm start

# Terminal 2: Frontend App (Port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🌐 24/7 Cloud Deployment Guide

### 1. Deploy Frontend on [Vercel](https://vercel.com) (Free)
1. Import this repository [`https://github.com/asnayem1122/TableTurn`](https://github.com/asnayem1122/TableTurn) into Vercel.
2. Configure build settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment Variables:
   - **`VITE_API_URL`**: `https://<your-render-backend-url>.onrender.com/api`
4. Click **Deploy**. Vercel will automatically use [`client/vercel.json`](client/vercel.json) for client-side SPA routing.

### 2. Deploy Backend on [Render](https://render.com) (Free)
1. Create a **New Web Service** and connect this repository.
2. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
3. Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_secure_jwt_secret_key`
   - `CLIENT_URL` = `https://<your-vercel-app-name>.vercel.app`
   - `MONGODB_URI` = *(Optional: MongoDB Atlas connection string)*

---

## 📡 REST API Reference

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Healthcheck & database connection status |
| `GET` | `/api/restaurants` | Public | Query restaurants (division, sub-district, cuisine, price, search) |
| `GET` | `/api/restaurants/:id` | Public | Get comprehensive details of a specific restaurant |
| `GET` | `/api/restaurants/meta/division-stats` | Public | Get restaurant count aggregations per division |
| `POST` | `/api/reservations` | Public | Create a new table reservation |
| `GET` | `/api/reservations/my` | JWT Protected | Retrieve authenticated user's active & past reservations |
| `GET` | `/api/reservations/lookup/:code` | Public | Lookup reservation details by unique code |
| `PATCH` | `/api/reservations/:id/cancel` | JWT Protected | Cancel an existing reservation (Ownership verified) |
| `POST` | `/api/auth/register` | Rate Limited | Register diner account |
| `POST` | `/api/auth/login` | Rate Limited | Authenticate user & issue JWT token |
| `POST` | `/api/auth/demo` | Dev Restricted | 1-Click instant demo session |

---

## 👨‍💻 Maintainer & License

Maintained by **[asnayem1122](https://github.com/asnayem1122)**

This project is licensed under the **MIT License** — feel free to use and modify for personal or commercial projects.
