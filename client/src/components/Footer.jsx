import React from 'react';
import { UtensilsCrossed, Heart, Sparkles, MapPin, PhoneCall, ShieldCheck, Mail } from 'lucide-react';
import { BANGLADESH_DIVISIONS } from '../data/mockData';
import { useReservation } from '../context/ReservationContext';

export const Footer = () => {
  const { setSelectedDivision, setSelectedSubZone, setIsHostPortalOpen } = useReservation();

  return (
    <footer className="mt-20 border-t border-white/10 bg-surface-400 pt-14 pb-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-glow-gold text-slate-950">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display text-xl font-extrabold text-white">
                  Table<span className="text-gold-500">Turn</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider ml-1 px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  Bangladesh
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              The premier restaurant discovery and table reservation engine engineered specifically for Bangladesh across all 8 administrative divisions.
            </p>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time Host Stand Synced Slots</span>
            </div>
          </div>

          {/* Col 2: 8 Divisions Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Divisional Hubs
            </h4>
            <ul className="space-y-2">
              {BANGLADESH_DIVISIONS.map((div) => (
                <li key={div}>
                  <button
                    onClick={() => {
                      setSelectedDivision(div);
                      setSelectedSubZone('All');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-gold-400 transition-colors text-left"
                  >
                    {div} Division Dining
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Regional Culinary Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Regional Specialties
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Dhaka • Shahi Dum Kacchi & Robata</li>
              <li>Chattogram • Authentic Mezban Beef</li>
              <li>Sylhet • Wild Shatkora & Seven-Layer Tea</li>
              <li>Khulna • Chuknagar Chui Jhal Mutton</li>
              <li>Barishal • Kirtankhola Shorshe Ilish</li>
              <li>Rajshahi • Padma Hilsa & Fazli Glaze</li>
              <li>Rangpur • Haribhanga Charcoal Grills</li>
              <li>Mymensingh • Muktagacha Monda Soufflé</li>
            </ul>
          </div>

          {/* Col 4: Partner Helpline & Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Diner & Host Support
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Need assistance with group bookings or managing your restaurant floor?
            </p>
            <div className="p-3 rounded-xl bg-surface-100 border border-white/5 space-y-1">
              <p className="text-xs font-bold text-white">Concierge Hotline (BD):</p>
              <a 
                href="tel:01571284636"
                className="font-mono text-xs text-gold-400 font-bold hover:text-gold-300 transition-colors block"
              >
                +880 1571-284636 (01571284636)
              </a>
              <p className="text-[10px] text-slate-400">Daily: 10:00 AM – 11:30 PM</p>
            </div>
            <button
              onClick={() => setIsHostPortalOpen(true)}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Launch Host Partner Portal</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 TableTurn Bangladesh Ltd. Inspired by Resy UX architecture.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <button
              onClick={() => setIsHostPortalOpen(true)}
              className="hover:text-gold-400 text-gold-400/90 font-semibold cursor-pointer underline"
            >
              Host Partner Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
