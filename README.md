# 🍽️ TableTurn — Bangladesh Restaurant Discovery & Table Reservation Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="TableTurn Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>Next-Generation Dining Experience across all 8 Administrative Divisions of Bangladesh 🇧🇩</strong>
</p>

<p align="center">
  <a href="https://raiyan-19.github.io/TableTurn/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Visit%20GitHub%20Pages-FFB800?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Live Demo" />
  </a>
  <a href="#-features"><img src="https://img.shields.io/badge/Coverage-8%20Divisions-FF5A5F?style=for-the-badge&logo=compass" alt="Divisions" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-MERN%20%2B%20Vite%20%2B%20Tailwind-00D26A?style=for-the-badge&logo=react" alt="Tech Stack" /></a>
  <a href="https://github.com/Raiyan-19/TableTurn"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" /></a>
</p>

---

## 🌐 Live Interactive Demo

Experience the live interactive frontend directly in your browser:

* 🚀 **GitHub Pages Official Live Demo**: [https://raiyan-19.github.io/TableTurn/](https://raiyan-19.github.io/TableTurn/)

> [!NOTE]
> The frontend features an intelligent client-side fallback engine, allowing full exploration of all 8 administrative divisions, real-time filters, 3D animations, slot reservations, and dynamic QR passes in standalone preview mode!

---

## 📖 Overview

**TableTurn** is a high-performance, mobile-responsive restaurant discovery and real-time table reservation platform inspired by Resy & OpenTable, designed specifically for the Bangladeshi culinary landscape. 

From upscale rooftop lounges in Gulshan (Dhaka) to heritage dining in Chattogram, lakefront cafes in Sylhet, and riverside eateries in Barishal — TableTurn connects food lovers with premier dining spots with instant booking confirmations, digital QR passes, and automated seating management.

---

## ✨ Key Features

### 🌐 1. Interactive 3D Cyber & Dual-Theme Experience
- **Interactive 3D Constellation Sphere:** Real-time mouse-tracking holographic orbital sphere with glowing divisional coordinates.
- **3D Tilt & Light Sheen Feature Cards:** Dynamic gyroscope card perspective with moving cursor lighting highlights.
- **Space Black & Silk Light Themes:** Seamless 1-click toggle between cyber obsidian dark mode and clean Linear/Notion-style silk white light mode.

### 🗺️ 2. Nationwide 8-Division Discovery Engine
- **Full Coverage:** Seamless browsing across **Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh**.
- **Localized Sub-Districts:** Filter by major food hubs (*Gulshan, Banani, Dhanmondi, GEC Circle, Agrabad, Zindabazar, Shaheb Bazar, Shibbari*, etc.).
- **Dynamic Search & Filters:** Filter by cuisine types (Bengali, Mughlai, Italian, Japanese, BBQ, Continental), price categories (`৳` to `৳৳৳৳`), and dining slots (*Breakfast, Lunch, Evening Adda, Dinner, Late Night*).

### ⚡ 3. Real-Time 4-Step Reservation Engine
- **Interactive Seating Selection:** Choose seating preferences (*Main Dining Room, Open-Air Rooftop, Chef’s Table, VIP Booth, Garden Terrace*).
- **Special Occasion Customization:** Tailor bookings for *Birthdays, Date Nights, Anniversaries, Business Dinners, or Family Gatherings*.
- **Bangladeshi Mobile Verification:** Built-in phone validation supporting `+8801XXXXXXXXX` and `01XXXXXXXXX` formats.
- **Smart Party Sizing:** Dynamic guest stepper with support for 1 to 30 diners with instant slot availability calculations.

### 🎟️ 4. Digital QR Pass & Instant Confirmation
- **Cryptographic High-Entropy Reservation ID:** Automatically generated booking codes (`TT-DHA-XXXXXXXX`, `TT-CTG-XXXXXXXX`).
- **Scannable QR Pass:** On-screen dynamic QR code for swift guest check-in at the host podium.
- **Calendar & Social Integration:** 1-Click **Add to Calendar (.ics download)** and **WhatsApp Booking Share**.
- **Confetti Celebration:** Delightful micro-animations upon successful table booking.

### 👥 5. Role-Based Access & Admin Management Terminal
- **Admin Dashboard:** Full MongoDB CRUD interface for adding venues, toggling flash discounts, and managing listings.
- **Live KPIs & Analytics:** Division breakdown statistics, lifetime reservations count, upcoming diners, and active venue counts.
- **Host Stand Scanner:** Real-time verification of guest QR code references and 1-click table seating (`seated`).
- **Verified Reviews & Star Ratings:** Authentic diner community feedback, ratings recalculation, and reviews engine.

### 🔒 6. Security & VAPT Hardening (OWASP Top 10 Compliance)
- **Rate Limiting & Anti-Bruteforce:** Custom sliding window rate limiters (`authLimiter`, `apiLimiter`) preventing brute-force attacks on auth and API endpoints.
- **Security Headers & CORS Controls:** Production HTTP security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`), strict origin validation, and 10kb request payload limits.
- **IDOR & BOLA Prevention:** Ownership check verification on reservation management and mandatory `protect` auth guards for user booking data.
- **Role Escalation Safeguards:** Locked public user registration roles (`role` forced to `user`).

---

## 🔑 Default Test Accounts

| Role | Email | Password | Access & Capabilities |
|---|---|---|---|
| **Super Administrator** | `admin@tableturn.bd` | `admin1122` | Full Management Terminal, Analytics, Venue CRUD, Flash Deals, Scanner |
| **Venue Manager** | `manager@thegrove.bd` | `Shakila1122` | Host Stand Scanner, Seating Management, Live Reservations |
| **Diner (User)** | *Register new or any account* | *User password* | Instant Table Bookings, Profile & Favorite Venues, Reviews |

---

## 📡 API Reference Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Service health & division manifest |
| `GET` | `/api/restaurants` | Public | Get all restaurants with division/cuisine/price filters |
| `GET` | `/api/restaurants/:id` | Public | Get single restaurant details |
| `GET` | `/api/restaurants/meta/division-stats` | Public | Get counts per Bangladesh division |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | User | Get current logged-in user profile |
| `POST` | `/api/reservations` | Public/User | Create real-time table booking & QR pass |
| `GET` | `/api/reservations/lookup/:code` | Public/Host | Verify reservation by booking code |
| `GET` | `/api/reservations/my` | User | Get authenticated user's reservations |
| `PATCH` | `/api/reservations/:id/cancel` | User/Staff | Cancel reservation (BOLA protected) |
| `GET` | `/api/admin/stats` | Admin/Manager | Platform KPI statistics & division breakdowns |
| `GET` | `/api/admin/reservations` | Admin/Manager | Filtered list of all nationwide reservations |
| `PATCH` | `/api/admin/reservations/:id/status` | Admin/Manager | Update reservation status (`confirmed`, `seated`, `cancelled`) |
| `POST` | `/api/admin/restaurants` | Admin/Manager | List a new partner restaurant |
| `PATCH` | `/api/admin/restaurants/:id/offer` | Admin/Manager | Toggle 30% flash deal on venue |

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Description |
|---|---|
| **React 18** | Modern Component Architecture with React Hooks |
| **Vite 5** | Lightning-fast HMR and optimized production bundling |
| **Tailwind CSS 3** | Utility-first responsive design & custom glassmorphism |
| **Framer Motion** | Fluid page transitions, modal drawers & 3D micro-interactions |
| **HTML5 Canvas** | 3D Constellation Sphere & Orbital Node Physics |
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
| **Rate Limiters & Security Headers** | Hardened HTTP security headers and anti-DDoS throttles |
| **Morgan & CORS** | Request logging and cross-origin resource sharing |

---

## 📁 Project Structure

```bash
TableTurn/
├── client/                     # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # UI Components (3D Hero, Navbar, Modals, Cards, Filters, QR)
│   │   ├── context/            # AuthContext, ReservationContext & ThemeContext
│   │   ├── data/               # Mock dataset & Bangladesh division metadata
│   │   ├── services/           # Axios API Client with offline/static fallback
│   │   ├── App.jsx             # Main Application Layout & Master Gradients
│   │   ├── main.jsx            # React Root Entrypoint
│   │   └── index.css           # Custom Design Tokens, Space Black & Silk Light Themes
│   ├── index.html              # HTML Shell
│   ├── package.json            # Frontend Dependencies & Scripts
│   ├── tailwind.config.js      # Tailwind Configuration
│   ├── vercel.json             # Vercel SPA Routing Configuration
│   └── vite.config.js          # Vite Bundler & Relative Base Settings
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Route controllers (Auth, Restaurant, Reservation, Admin, Review)
│   ├── data/                   # Seed data across all 8 divisions
│   ├── middleware/             # Auth JWT guard, VAPT rate limiters & Global Error Handler
│   ├── models/                 # Mongoose schemas (User, Restaurant, Reservation)
│   ├── routes/                 # Express API routes (Auth, Restaurant, Reservation, Admin)
│   ├── package.json            # Server Dependencies & Scripts
│   └── server.js               # Express Server Entrypoint
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package manager
├── README.md                   # Project Documentation & Live Demo Badges
└── start.bat                   # Windows 1-Click Dual Service Launcher
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Raiyan-19/TableTurn.git
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
Simply double-click [`start.bat`](start.bat) in the root directory.

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

## 👨‍💻 Author

Developed with ❤️ by **[Raiyan-19](https://github.com/Raiyan-19)**

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify for personal or commercial projects.
