# 🍽️ TableTurn — Bangladesh Restaurant Discovery & Table Reservation Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" alt="TableTurn Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>Next-Generation Dining Experience across all 8 Administrative Divisions of Bangladesh 🇧🇩</strong>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-8%20Divisions-FF5A5F?style=for-the-badge&logo=compass" alt="Divisions" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-MERN%20%2B%20Vite%20%2B%20Tailwind-00D26A?style=for-the-badge&logo=react" alt="Tech Stack" /></a>
  <a href="#-deployment"><img src="https://img.shields.io/badge/Deploy-Vercel%20%26%20Render-000000?style=for-the-badge&logo=vercel" alt="Deployment" /></a>
  <a href="https://github.com/Raiyan-19/TableTurn"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" /></a>
</p>

---

## 📖 Overview

**TableTurn** is a high-performance, mobile-responsive restaurant discovery and real-time table reservation platform inspired by Resy & OpenTable, designed specifically for the Bangladeshi culinary landscape. 

From upscale rooftop lounges in Gulshan (Dhaka) to heritage dining in Chattogram, lakefront cafes in Sylhet, and riverside eateries in Barishal — TableTurn connects food lovers with premier dining spots with instant booking confirmations, digital QR passes, and automated seating management.

---

## ✨ Key Features

### 🗺️ 1. Nationwide 8-Division Discovery Engine
- **Full Coverage:** Seamless browsing across **Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh**.
- **Localized Sub-Districts:** Filter by major food hubs (*Gulshan, Banani, Dhanmondi, GEC Circle, Agrabad, Zindabazar, Shaheb Bazar, Shibbari*, etc.).
- **Dynamic Search & Filters:** Filter by cuisine types (Bengali, Mughlai, Italian, Japanese, BBQ, Continental), price categories (`৳` to `৳৳৳৳`), and dining slots (*Breakfast, Lunch, Evening Adda, Dinner, Late Night*).

### ⚡ 2. Real-Time 4-Step Reservation Engine
- **Interactive Seating Selection:** Choose seating preferences (*Main Dining Room, Open-Air Rooftop, Chef’s Table, VIP Booth, Garden Terrace*).
- **Special Occasion Customization:** Tailor bookings for *Birthdays, Date Nights, Anniversaries, Business Dinners, or Family Gatherings*.
- **Bangladeshi Mobile Verification:** Built-in phone validation supporting `+8801XXXXXXXXX` and `01XXXXXXXXX` formats.
- **Smart Party Sizing:** Dynamic guest stepper with support for 1 to 25+ diners with instant slot availability calculations.

### 🎟️ 3. Digital QR Pass & Instant Confirmation
- **Unique Reservation ID:** Automatically generated booking codes (`TT-DHK-XXXX`, `TT-CTG-XXXX`).
- **Scannable QR Pass:** On-screen dynamic QR code for swift guest check-in at the host podium.
- **Calendar & Social Integration:** 1-Click **Add to Calendar (.ics download)** and **WhatsApp Booking Share**.
- **Confetti Celebration:** Delightful micro-animations upon successful table booking.

### 👥 4. Role-Based Access & 1-Click Demo
- **Demo Switcher:** Instant 1-click login as **Diner**, **Restaurant Venue Manager**, or **System Administrator** without manual credentials.
- **My Bookings Drawer:** Slide-out management panel to view active reservations, display QR passes, or cancel bookings.
- **Host / Manager Portal:** Dedicated management overview for venue managers.

### 🛡️ 5. Resilient Hybrid Architecture (Zero Downtime)
- **MongoDB Atlas Integration:** Full Mongoose ORM with schema validation for users, restaurants, and reservations.
- **Automatic In-Memory / JSON Fallback:** If the database connection is offline or in cold start, the app automatically fails over to an intelligent in-memory store, ensuring 100% uninterrupted user experience.

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Description |
|---|---|
| **React 18** | Modern Component Architecture with React Hooks |
| **Vite 5** | Lightning-fast HMR and optimized production bundling |
| **Tailwind CSS 3** | Utility-first responsive design & custom glassmorphism |
| **Framer Motion** | Fluid page transitions, modal drawers & micro-interactions |
| **Lucide Icons** | Clean, modern iconography |
| **Axios** | HTTP client with automatic JWT bearer interception |
| **Canvas Confetti & QRCode.react** | Visual celebrations and QR pass rendering |

### Backend (Server)
| Technology | Description |
|---|---|
| **Node.js & Express.js** | High-throughput REST API server |
| **MongoDB & Mongoose** | Document database for persistent storage |
| **JWT (JSON Web Tokens)** | Secure stateless authentication |
| **Bcrypt.js** | Industry-standard password hashing |
| **Morgan & CORS** | Request logging and cross-origin resource sharing |

---

## 📁 Project Structure

```bash
TableTurn/
├── client/                     # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # UI Components (Navbar, Modals, Cards, Filters, QR)
│   │   ├── context/            # AuthContext & ReservationContext
│   │   ├── data/               # Mock dataset & Bangladesh division metadata
│   │   ├── services/           # Axios API Client with cloud fallback
│   │   ├── App.jsx             # Main Application Layout
│   │   ├── main.jsx            # React Root Entrypoint
│   │   └── index.css           # Tailwind & Custom Design Tokens
│   ├── index.html              # HTML Shell
│   ├── package.json            # Frontend Dependencies & Scripts
│   ├── tailwind.config.js      # Tailwind Configuration
│   ├── vercel.json             # Vercel SPA Routing Configuration
│   └── vite.config.js          # Vite Bundler & Proxy Settings
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Route controllers (Auth, Restaurant, Reservation)
│   ├── data/                   # Seed data across all 8 divisions
│   ├── middleware/             # Auth JWT guard & Global Error Handler
│   ├── models/                 # Mongoose schemas (User, Restaurant, Reservation)
│   ├── routes/                 # Express API routes
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

## 🌐 24/7 Free Cloud Deployment

### 1. Deploy Backend on [Render](https://render.com) (Free)
1. Create a **New Web Service** and connect this repository.
2. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
3. Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = *(Optional: Your MongoDB Atlas connection URI)*

### 2. Deploy Frontend on [Vercel](https://vercel.com) (Free)
1. Import this repository into Vercel.
2. Configure settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
3. Add Environment Variable:
   - **`VITE_API_URL`**: `https://<your-render-backend-name>.onrender.com/api`
4. Click **Deploy**.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck & division capability status |
| `GET` | `/api/restaurants` | Query restaurants (division, cuisine, price, search) |
| `GET` | `/api/restaurants/:id` | Get comprehensive details of a specific restaurant |
| `GET` | `/api/restaurants/meta/division-stats` | Get restaurant counts per division |
| `POST` | `/api/reservations` | Create a new table reservation |
| `GET` | `/api/reservations/my` | Retrieve active & past reservations |
| `PATCH` | `/api/reservations/:id/cancel` | Cancel an existing reservation |
| `POST` | `/api/auth/register` | Register diner or manager account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/demo` | 1-Click instant demo session |

---

## 👨‍💻 Author

Developed with ❤️ by **[Raiyan-19](https://github.com/Raiyan-19)**

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify for personal or commercial projects.
