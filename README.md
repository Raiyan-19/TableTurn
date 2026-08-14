# TableTurn — Bangladesh Restaurant Discovery & Reservation Platform

A high-performance, mobile-responsive restaurant discovery and table reservation platform inspired by Resy, tailored specifically for **Bangladesh across all 8 administrative divisions** (Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, and Mymensingh).

---

## 🚀 Quick Start (Running the App)

### Option 1: Live Right Now (Already Running!)
The application is currently already running in your background session:
* **Frontend Web App:** [http://localhost:5173](http://localhost:5173)
* **Backend REST API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Option 2: Windows 1-Click Launcher
Double-click [`start.bat`](file:///f:/TableTurn/start.bat) in the project root folder. It will launch both the backend API server and the Vite frontend in separate terminal windows.

---

### Option 3: Manual Terminal Commands

#### Terminal 1 — Start the Backend Server:
```bash
cd f:/TableTurn/server
node server.js
```
* Backend runs on: `http://localhost:5000`

#### Terminal 2 — Start the Frontend Client:
```bash
cd f:/TableTurn/client
npm run dev
```
* Frontend runs on: `http://localhost:5173`

---

## 🎯 Key Features to Test

1. **8-Division Quick Switcher:** Click through Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh tabs.
2. **Dynamic Sticky Search Bar:** Select division sub-zones (e.g., *Gulshan*, *GEC Circle*, *Zindabazar*), date, party size stepper (1-25+ guests), and dining session windows (*Lunch*, *Dinner*, *Late Night*).
3. **Instant Slot Booking:** Click any available time slot pill (e.g. `12:30 PM`, `07:00 PM`, `08:15 PM`) directly on a card.
4. **4-Step Booking Engine:**
   - Step 1: Slot & Seating selection (*Main Dining*, *Rooftop Terrace*, *Chef's Table*, *VIP Booth*).
   - Step 2: Occasion (*Birthday*, *Date Night*, *Business*) & dietary notes.
   - Step 3: Bangladeshi mobile number validation (`+8801XXXXXXXXX` or `01XXXXXXXXX`).
   - Step 4: Instant booking confirmation with a unique reference code (`TT-DHA-XXXX`), **Digital QR Pass**, Confetti, **Add to Calendar (.ics)**, and WhatsApp share.
5. **My Bookings Drawer:** Open from the top navbar to see all active reservations and display QR passes to restaurant hosts.
6. **1-Click Demo Accounts:** Click `Demo User` in the navbar or in the Auth Modal to instantly test as Diner, Restaurant Manager, or Admin.
