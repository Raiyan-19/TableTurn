import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Compass, 
  ArrowRight, 
  ArrowDown, 
  Flame, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  BookOpen,
  Award,
  Utensils,
  Cpu,
  Activity,
  Layers,
  Radio
} from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { useTheme } from '../context/ThemeContext';
import { BANGLADESH_DIVISIONS } from '../data/mockData';

// Seamless 3D Spherical Constellation Network (Without harsh outer circle)
const Interactive3DConstellation = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = 480);
    let height = (canvas.height = 480);

    const numPoints = 46;
    const points = [];
    const radius = 145;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        pulse: Math.random() * Math.PI,
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - width / 2) / (width / 2);
      const y = (e.clientY - rect.top - height / 2) / (height / 2);
      mouseX = x * 0.012;
      mouseY = y * 0.012;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let angleX = 0.0025;
    let angleY = 0.0035;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      angleX += (mouseY + 0.0025 - angleX) * 0.04;
      angleY += (mouseX + 0.0035 - angleY) * 0.04;

      // 1. Rotate Sphere Nodes in 3D Space
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.pulse += 0.025;

        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      // 2. Draw Interconnected Constellation Mesh
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dz = points[i].z - points[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 82) {
            const avgZ = (points[i].z + points[j].z) / 2;
            const depthFactor = (avgZ + radius) / (2 * radius);
            const alpha = (1 - dist / 82) * (0.15 + depthFactor * 0.45);

            ctx.strokeStyle = isDark
              ? `rgba(245, 158, 11, ${alpha * 0.75})`
              : `rgba(180, 83, 9, ${alpha * 0.75})`;
            ctx.lineWidth = isDark ? 0.8 : 1.1;
            
            ctx.beginPath();
            ctx.moveTo(centerX + points[i].x, centerY + points[i].y);
            ctx.lineTo(centerX + points[j].x, centerY + points[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Glowing 3D Celestial Nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const scale = (p.z + radius) / (2 * radius);
        const nodeSize = 1.2 + scale * 3.0;
        const alpha = 0.3 + scale * 0.7;

        // Foreground Node Halo Glow
        if (p.z > 25) {
          const grad = ctx.createRadialGradient(
            centerX + p.x, centerY + p.y, 0,
            centerX + p.x, centerY + p.y, nodeSize * 4
          );
          if (isDark) {
            grad.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.5})`);
            grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          } else {
            grad.addColorStop(0, `rgba(217, 119, 6, ${alpha * 0.4})`);
            grad.addColorStop(1, 'rgba(217, 119, 6, 0)');
          }
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(centerX + p.x, centerY + p.y, nodeSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core Node Color
        if (isDark) {
          ctx.fillStyle = p.z > 40 ? '#FFFFFF' : `rgba(245, 158, 11, ${alpha})`;
        } else {
          ctx.fillStyle = p.z > 40 ? '#0F172A' : `rgba(217, 119, 6, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(centerX + p.x, centerY + p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none transition-opacity duration-300 ${
        isDark ? 'opacity-65' : 'opacity-85'
      }`}
      width={480}
      height={480}
    />
  );
};

// 3D Tilt Card with dynamic holographic cursor sheen
const Interactive3DCard = ({ icon: Icon, title, description, badge, color = 'gold' }) => {
  const cardRef = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotX(rX);
    setRotY(rY);
    setSheenPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative p-6 sm:p-7 rounded-3xl cyber-card overflow-hidden group cursor-pointer flex flex-col justify-between"
    >
      {/* Dynamic Cursor Sheen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
        style={{
          background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(245, 158, 11, 0.12) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${
            color === 'emerald'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-500 border border-emerald-500/30'
              : color === 'indigo'
              ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-500 border border-indigo-500/30'
              : 'bg-gold-500/15 text-amber-700 dark:text-gold-500 border border-gold-500/30'
          }`}>
            <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-500">
            {badge}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-gold-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom status bar */}
      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">Active Protocol</span>
        </span>
        <span className="text-amber-700 dark:text-gold-400 font-bold flex items-center gap-1">
          <span>Synced</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
  const { isDark } = useTheme();
  const {
    selectedDivision,
    setSelectedDivision,
    selectedDate,
    setSelectedDate,
    partySize,
    setPartySize,
    setSelectedSubZone,
    setIsHostPortalOpen,
  } = useReservation();

  return (
    <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden cyber-grid-bg transition-colors duration-300 w-full max-w-full">
      
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/3 w-[320px] sm:w-[650px] h-[320px] sm:h-[650px] bg-gold-500/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-1/2 right-1/4 w-[280px] sm:w-[550px] h-[280px] sm:h-[550px] bg-emerald-500/8 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Main Hero Header Area */}
        <div className="relative min-h-[360px] sm:min-h-[400px] flex flex-col items-center justify-center text-center">
          
          {/* Seamless Theme-Adaptive 3D Constellation Sphere */}
          <div className="absolute -left-16 lg:-left-6 top-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none z-0 hidden md:block">
            <Interactive3DConstellation isDark={isDark} />
          </div>

          {/* Top Pill Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-[10px] sm:text-[11px] font-mono uppercase tracking-normal sm:tracking-widest text-amber-700 dark:text-gold-400 mb-5 sm:mb-6 shadow-sm backdrop-blur-md relative z-20 max-w-[94vw] text-center leading-snug"
          >
            <Radio className="w-3.5 h-3.5 text-amber-500 dark:text-gold-500 animate-pulse shrink-0" />
            <span className="break-words">Non-monetary Academic & Hospitality Dining Protocol</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white uppercase leading-[1.08] max-w-5xl relative z-20 px-1 break-words"
          >
            RESERVE A TABLE. <br />
            GET A TABLE. <span className="font-light italic text-slate-600 dark:text-slate-400 normal-case">Save the Night.</span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mt-4 sm:mt-5 leading-relaxed relative z-20 px-2"
          >
            Your city's premier dining spots already survived the rush. Discover verified table allocations, 
            rate culinary experiences, and reserve across all 8 Bangladesh divisions.
          </motion.p>

          {/* Pill Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto relative z-20"
          >
            <button
              onClick={() => {
                const gridElement = document.getElementById('restaurant-grid-section');
                if (gridElement) gridElement.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-slate-950 dark:bg-white/10 hover:bg-gold-500 dark:hover:bg-gold-500 text-white hover:text-slate-950 dark:hover:text-slate-950 font-extrabold text-xs tracking-wider uppercase border border-slate-800 dark:border-white/20 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-glow-gold hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Dining Bazaar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsHostPortalOpen(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-white/90 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-slate-200 font-bold text-xs tracking-wider uppercase border border-slate-300 dark:border-white/15 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] shadow-sm justify-center flex items-center"
            >
              Host Stand Scanner
            </button>
          </motion.div>

          {/* Telemetry HUD Bar */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-10 text-[10px] sm:text-[11px] font-mono text-slate-600 dark:text-slate-400 relative z-20 px-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="font-bold">8 DIVISIONS ACTIVE</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-gold-500" />
              <span className="font-bold">0% BOOKING CONFLICTS</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-gold-500 dark:text-gold-500" />
              <span className="font-bold">4.9 DINER RATING</span>
            </span>
          </div>
        </div>

        {/* Resy-Style Interactive Quick Slot Engine Bar */}
        <div className="mt-12 max-w-5xl mx-auto p-3.5 sm:p-4 rounded-3xl glass-panel-gold border border-gold-500/40 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            
            {/* 1. Division Selector */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-amber-600 dark:text-gold-400 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-gold-400 block">
                  Division
                </span>
                <select
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedSubZone('All');
                  }}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">All 8 BD Divisions</option>
                  <option value="Dhaka" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Dhaka Division</option>
                  <option value="Chattogram" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Chattogram Division</option>
                  <option value="Sylhet" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Sylhet Division</option>
                  <option value="Rajshahi" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Rajshahi Division</option>
                  <option value="Khulna" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Khulna Division</option>
                  <option value="Barishal" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Barishal Division</option>
                  <option value="Rangpur" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Rangpur Division</option>
                  <option value="Mymensingh" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Mymensingh Division</option>
                </select>
              </div>
            </div>

            {/* 2. Date Picker */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-amber-600 dark:text-gold-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-gold-400 block">
                  Date
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Guests Party Size */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-amber-600 dark:text-gold-400 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-gold-400 block">
                  Party Size
                </span>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">1 Guest (Solo Table)</option>
                  <option value={2} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">2 Guests (Table for Two)</option>
                  <option value={3} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">3 Guests</option>
                  <option value={4} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">4 Guests (Family / Friends)</option>
                  <option value={5} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">5 Guests</option>
                  <option value={6} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">6 Guests (Large Table)</option>
                  <option value={8} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">8+ Guests (VIP / Party)</option>
                </select>
              </div>
            </div>

            {/* 4. Action Button */}
            <button
              onClick={() => {
                const gridElement = document.getElementById('restaurant-grid-section');
                if (gridElement) gridElement.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Available Tables</span>
              <ArrowDown className="w-4 h-4 text-slate-950 animate-bounce" />
            </button>

          </div>
        </div>

        {/* 3 Bottom Minimalist 3D Tilt Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <Interactive3DCard
            icon={BookOpen}
            title="Division Dining Protocol"
            description="Curated dining venues structured across 8 administrative divisions with real-time floor availability and VIP seating areas."
            badge="01 / REGION_MATRIX"
            color="gold"
          />

          <Interactive3DCard
            icon={ShieldCheck}
            title="Cryptographic Host Pass"
            description="High-entropy cryptographic verification passes and dynamic QR codes eliminate double-bookings and ensure instant seating."
            badge="02 / CRYPTO_GUARD"
            color="emerald"
          />

          <Interactive3DCard
            icon={Award}
            title="Verified Diner Community"
            description="Authentic diner reviews, chef recommendations, and exclusive last-minute flash deals for registered TableTurn members."
            badge="03 / DINER_CONSENSUS"
            color="indigo"
          />

        </div>

      </div>
    </section>
  );
};
