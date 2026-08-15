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
import { BANGLADESH_DIVISIONS } from '../data/mockData';

// Advanced Interactive 3D Holographic Constellation Sphere with Orbital Rings & Mouse Tilt
const Interactive3DConstellation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = 560);
    let height = (canvas.height = 560);

    // Dynamic Nodes & Coordinates
    const numPoints = 48;
    const points = [];
    const radius = 170;

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

    // Orbital Ring Points
    const ringPoints = [];
    const ringRadius = 210;
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      ringPoints.push({
        x: ringRadius * Math.cos(angle),
        y: 0,
        z: ringRadius * Math.sin(angle),
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.003;
    let targetRotY = 0.004;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - width / 2) / (width / 2);
      const y = (e.clientY - rect.top - height / 2) / (height / 2);
      mouseX = x * 0.015;
      mouseY = y * 0.015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let angleX = 0.003;
    let angleY = 0.004;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      angleX += (mouseY + 0.0025 - angleX) * 0.05;
      angleY += (mouseX + 0.0035 - angleY) * 0.05;

      // 1. Rotate Sphere Nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.pulse += 0.03;

        // Rotate Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      // 2. Rotate Orbital Ring
      for (let i = 0; i < ringPoints.length; i++) {
        const p = ringPoints[i];
        const cosY = Math.cos(angleY * 0.8);
        const sinY = Math.sin(angleY * 0.8);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const cosX = Math.cos(angleX * 1.2 + 0.4);
        const sinX = Math.sin(angleX * 1.2 + 0.4);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      // 3. Draw Outer Orbital Ring Line
      ctx.beginPath();
      for (let i = 0; i < ringPoints.length; i++) {
        const p = ringPoints[i];
        const next = ringPoints[(i + 1) % ringPoints.length];
        const alpha = Math.max(0.1, (p.z + ringRadius) / (2 * ringRadius));
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + p.x, centerY + p.y);
        ctx.lineTo(centerX + next.x, centerY + next.y);
        ctx.stroke();
      }

      // 4. Draw Interconnected Constellation Mesh
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dz = points[i].z - points[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 85) {
            const avgZ = (points[i].z + points[j].z) / 2;
            const depthFactor = (avgZ + radius) / (2 * radius);
            const alpha = (1 - dist / 85) * (0.15 + depthFactor * 0.35);

            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(centerX + points[i].x, centerY + points[i].y);
            ctx.lineTo(centerX + points[j].x, centerY + points[j].y);
            ctx.stroke();
          }
        }
      }

      // 5. Draw Glowing Holographic Nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const scale = (p.z + radius) / (2 * radius);
        const nodeSize = 1.2 + scale * 3.2;
        const pulseEffect = Math.sin(p.pulse) * 0.5 + 0.5;
        const alpha = 0.25 + scale * 0.75;

        // Radial Glow Halo for foreground nodes
        if (p.z > 20) {
          const grad = ctx.createRadialGradient(
            centerX + p.x, centerY + p.y, 0,
            centerX + p.x, centerY + p.y, nodeSize * 4
          );
          grad.addColorStop(0, `rgba(245, 158, 11, ${alpha * 0.6})`);
          grad.addColorStop(0.5, `rgba(245, 158, 11, ${alpha * 0.2})`);
          grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(centerX + p.x, centerY + p.y, nodeSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core Node
        ctx.fillStyle = p.z > 50 ? '#FFFFFF' : `rgba(245, 158, 11, ${alpha})`;
        ctx.beginPath();
        ctx.arc(centerX + p.x, centerY + p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Divisional Telemetry Tag on Key Foreground Nodes
        if (i === 4 && p.z > 40) {
          ctx.font = '9px monospace';
          ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
          ctx.fillText('23.81° N, 90.41° E [DHAKA]', centerX + p.x + 8, centerY + p.y - 4);
        }
        if (i === 12 && p.z > 40) {
          ctx.font = '9px monospace';
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fillText('22.35° N, 91.78° E [CHAT]', centerX + p.x + 8, centerY + p.y - 4);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full opacity-80 pointer-events-none"
      width={560}
      height={560}
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

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

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
      {/* Dynamic Cursor Sheen Gradient Overlay */}
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
              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
              : color === 'indigo'
              ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/30'
              : 'bg-gold-500/15 text-gold-500 border border-gold-500/30'
          }`}>
            <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {badge}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-950 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom status indicator bar */}
      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Protocol</span>
        </span>
        <span className="text-gold-600 dark:text-gold-400 font-bold flex items-center gap-1">
          <span>Synced</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </motion.div>
  );
};

export const HeroSection = () => {
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
    <section className="relative pt-12 pb-20 overflow-hidden cyber-grid-bg transition-colors duration-300">
      
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/3 w-[650px] h-[650px] bg-gold-500/12 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-1/2 right-1/4 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header Area with Constellation Node Canvas */}
        <div className="relative min-h-[420px] flex flex-col items-center justify-center text-center">
          
          {/* Animated Interactive 3D Constellation Sphere floating on the left / behind */}
          <div className="absolute -left-12 sm:left-2 top-1/2 -translate-y-1/2 w-80 h-80 sm:w-[480px] sm:h-[480px] pointer-events-none z-0 hidden md:block">
            <Interactive3DConstellation />
          </div>

          {/* Top Pill Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-[11px] font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-6 shadow-sm backdrop-blur-md relative z-10"
          >
            <Radio className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
            <span>Non-monetary Academic & Hospitality Dining Protocol</span>
          </motion.div>

          {/* Main Hero Headline matching reference style */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white uppercase leading-[1.06] max-w-5xl relative z-10"
          >
            RESERVE A TABLE. <br />
            GET A TABLE. <span className="font-light italic text-slate-600 dark:text-slate-400 normal-case">Save the Night.</span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mt-5 leading-relaxed relative z-10"
          >
            Your city's premier dining spots already survived the rush. Discover verified table allocations, 
            rate culinary experiences, and reserve across all 8 Bangladesh divisions.
          </motion.p>

          {/* Pill Action Buttons matching reference style */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 relative z-10"
          >
            <button
              onClick={() => {
                const gridElement = document.getElementById('restaurant-grid-section');
                if (gridElement) gridElement.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-full bg-slate-950 dark:bg-white/10 hover:bg-gold-500 dark:hover:bg-gold-500 text-white hover:text-slate-950 dark:hover:text-slate-950 font-extrabold text-xs tracking-wider uppercase border border-slate-800 dark:border-white/20 transition-all flex items-center gap-2 shadow-xl hover:shadow-glow-gold hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Dining Bazaar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsHostPortalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-slate-200 font-bold text-xs tracking-wider uppercase border border-slate-300 dark:border-white/15 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              Host Stand Scanner
            </button>
          </motion.div>

          {/* Holographic Telemetry HUD Bar */}
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono text-slate-500 dark:text-slate-400 relative z-10">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>8 DIVISIONS ACTIVE</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span>0% BOOKING CONFLICTS</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
              <span>4.9 DINER RATING</span>
            </span>
          </div>
        </div>

        {/* Resy-Style Interactive Quick Slot Engine Bar */}
        <div className="mt-12 max-w-5xl mx-auto p-3.5 sm:p-4 rounded-3xl glass-panel-gold border border-gold-500/40 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            
            {/* 1. Division Selector */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-200/90 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 dark:text-gold-400 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600 dark:text-gold-400 block">
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
            <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-200/90 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 dark:text-gold-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600 dark:text-gold-400 block">
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
            <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-200/90 border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 dark:text-gold-400 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-600 dark:text-gold-400 block">
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
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Available Tables</span>
              <ArrowDown className="w-4 h-4 text-slate-950 animate-bounce" />
            </button>

          </div>
        </div>

        {/* 3 Bottom Minimalist 3D Tilt Feature Cards (Matching reference design) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Card 1: Division Dining Protocol */}
          <Interactive3DCard
            icon={BookOpen}
            title="Division Dining Protocol"
            description="Curated dining venues structured across 8 administrative divisions with real-time floor availability and VIP seating areas."
            badge="01 / REGION_MATRIX"
            color="gold"
          />

          {/* Card 2: Cryptographic Host Pass */}
          <Interactive3DCard
            icon={ShieldCheck}
            title="Cryptographic Host Pass"
            description="High-entropy cryptographic verification passes and dynamic QR codes eliminate double-bookings and ensure instant seating."
            badge="02 / CRYPTO_GUARD"
            color="emerald"
          />

          {/* Card 3: Verified Diner Community */}
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
