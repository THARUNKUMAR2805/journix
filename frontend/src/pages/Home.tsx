import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Award, Globe, Camera, Utensils, Car, Package, ArrowRight, ChevronRight, Sun, Cloud, Umbrella, Play, Compass, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';

const HERO_SLIDES = [
  { img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600', title: 'Coorg', state: 'Karnataka', sub: 'Coffee hills & morning mist', tag: '🌿 Nature Escape' },
  { img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600', title: 'Hampi', state: 'Karnataka', sub: 'Ancient ruins & timeless stories', tag: '🏛️ Heritage Site' },
  { img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600', title: 'Wayanad', state: 'Kerala', sub: 'Jungle retreats & wild wonders', tag: '🦋 Wildlife Haven' },
];

const SEASON_ICONS = { summer: Sun, winter: Cloud, monsoon: Umbrella, all: Globe };

const FEATURES = [
  { icon: MapPin, title: 'Curated Destinations', desc: 'Hand-picked hidden gems and trending spots by local experts', color: 'from-primary-500 to-orange-500', bg: 'bg-primary-50' },
  { icon: Utensils, title: 'Authentic Cuisine', desc: 'Local eateries, street food, and regional specialties awaiting you', color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50' },
  { icon: Car, title: 'Trusted Transport', desc: 'Verified local agencies and private vehicle owners at your service', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
  { icon: Camera, title: 'Virtual Tours', desc: 'Explore 360° immersive previews before you commit to a booking', color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50' },
  { icon: Package, title: 'Mini Packages', desc: 'Weekend getaways under budget — crafted for spontaneous travellers', color: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50' },
  { icon: Award, title: 'Loyalty Rewards', desc: 'Earn points on every booking and unlock exclusive travel perks', color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50' },
];

const STATS = [
  { value: '200+', label: 'Destinations', icon: Compass },
  { value: '1,500+', label: 'Hotels & Stays', icon: Shield },
  { value: '50K+', label: 'Happy Travellers', icon: Star },
  { value: '6', label: 'Languages', icon: Globe },
];

const QUICK_LINKS = [
  { label: 'Hotels', icon: '🏨', href: '/hotels', color: 'from-blue-500/20 to-blue-600/10 border-blue-200 text-blue-700' },
  { label: 'Cuisine', icon: '🍛', href: '/cuisine', color: 'from-amber-500/20 to-amber-600/10 border-amber-200 text-amber-700' },
  { label: 'Transport', icon: '🚗', href: '/transport', color: 'from-green-500/20 to-green-600/10 border-green-200 text-green-700' },
  { label: 'Packages', icon: '🎒', href: '/packages', color: 'from-purple-500/20 to-purple-600/10 border-purple-200 text-purple-700' },
  { label: 'Virtual Tour', icon: '🎥', href: '/virtual-tours', color: 'from-rose-500/20 to-rose-600/10 border-rose-200 text-rose-700' },
];

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [miniPackages, setMiniPackages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [seasonal, setSeasonal] = useState<{ destinations: any[]; currentSeason: string }>({ destinations: [], currentSeason: 'all' });

  useEffect(() => {
    const iv = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    Promise.all([
      api.get('/destinations?limit=6'),
      api.get('/destinations?trending=true&limit=4'),
      api.get('/packages?isMini=true&limit=4'),
      api.get('/reviews/testimonials'),
      api.get('/destinations/seasonal/recommendations'),
    ]).then(([d, tr, pkg, rev, sea]) => {
      setDestinations(d.data.destinations ?? []);
      setTrending(tr.data.destinations ?? []);
      setMiniPackages(pkg.data.packages ?? []);
      setTestimonials(rev.data.testimonials ?? []);
      setSeasonal(sea.data);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(search)}`);
  };

  const slide = HERO_SLIDES[heroIdx];

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background slides */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={s.img} alt={s.title} className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-900/50 to-gray-950/80" />
          </div>
        ))}

        {/* Animated grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        {/* Floating stat cards — desktop only */}
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute hidden xl:flex top-1/3 left-12 items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 z-10">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
          <div>
            <p className="text-white font-bold text-lg leading-none">50K+</p>
            <p className="text-white/60 text-xs">Happy Travellers</p>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
          className="absolute hidden xl:flex top-1/3 right-12 items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 z-10">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center"><Star className="w-5 h-5 text-white fill-white" /></div>
          <div>
            <p className="text-white font-bold text-lg leading-none">4.9 ★</p>
            <p className="text-white/60 text-xs">Average Rating</p>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Location pill */}
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm text-white text-sm px-5 py-2.5 rounded-full mb-6 border border-white/20 shadow-lg">
              <span className="text-xs">{slide.tag}</span>
              <span className="w-px h-3 bg-white/30" />
              <MapPin className="w-3.5 h-3.5 text-primary-300" />
              <span className="font-medium">{slide.title}, {slide.state}</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-5 drop-shadow-2xl">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">{t('heroSub')}</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
              <div className="flex gap-2 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/50">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="flex-1 border-0 outline-none text-gray-900 text-base placeholder-gray-400 bg-transparent"
                  />
                </div>
                <button type="submit" className="px-7 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all active:scale-95 whitespace-nowrap shadow-md">
                  Explore Now
                </button>
              </div>
            </form>

            {/* Quick category links */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {QUICK_LINKS.map(link => (
                <Link key={link.href} to={link.href}
                  className={`px-4 py-2 bg-gradient-to-br ${link.color} text-sm font-medium rounded-full border backdrop-blur-sm hover:scale-105 transition-all`}>
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Slide indicators + nav */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === heroIdx ? 'w-8 h-2 bg-primary-400' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-1 z-10">
          <span className="text-white/40 text-xs tracking-widest uppercase rotate-90 mb-2">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex justify-center mb-2 opacity-80"><s.icon className="w-5 h-5 text-white" /></div>
                <div className="text-3xl font-display font-bold text-white">{s.value}</div>
                <div className="text-white/75 text-sm mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features – Bento Grid ─────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 text-xs font-semibold px-4 py-2 rounded-full mb-4 border border-primary-100">
              <Zap className="w-3.5 h-3.5" /> Everything In One Place
            </div>
            <h2 className="section-title">Why Choose JourniX?</h2>
            <p className="section-subtitle mx-auto mt-3">India's most complete local travel platform — built for real travellers, by people who love India.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative p-7 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
              >
                <div className={`absolute inset-0 ${f.bg} opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-2xl`} />
                <div className={`relative w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${f.color} shadow-lg`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="relative font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
                <p className="relative text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <ArrowRight className="relative w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all mt-4" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Destinations ─────────────────────────────── */}
      {trending.length > 0 && (
        <section className="py-24 bg-stone-50 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-orange-400 to-amber-400" />
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-primary-200">
                  <TrendingUp className="w-3.5 h-3.5" /> Trending Now
                </div>
                <h2 className="section-title">Popular Destinations</h2>
                <p className="section-subtitle mt-2">Most loved destinations by our community this season</p>
              </div>
              <Link to="/explore?trending=true" className="hidden md:flex items-center gap-2 text-primary-500 font-semibold hover:gap-3 transition-all text-sm bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map(d => <DestinationCard key={d.id} destination={d} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Seasonal Recommendations ─────────────────────────────── */}
      {seasonal.destinations.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-amber-100">
                  {(() => { const Icon = SEASON_ICONS[seasonal.currentSeason as keyof typeof SEASON_ICONS] || Globe; return <Icon className="w-3.5 h-3.5" />; })()}
                  Best for {seasonal.currentSeason.charAt(0).toUpperCase() + seasonal.currentSeason.slice(1)}
                </div>
                <h2 className="section-title">Seasonal Highlights</h2>
                <p className="section-subtitle mt-2">Top destinations recommended for this time of year</p>
              </div>
              <Link to="/explore" className="hidden md:flex items-center gap-2 text-primary-500 font-semibold hover:gap-3 transition-all text-sm bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
                Explore all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {seasonal.destinations.slice(0, 6).map(d => <DestinationCard key={d.id} destination={d} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Mini Packages ─────────────────────────────── */}
      {miniPackages.length > 0 && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-gray-900 to-orange-950" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-white/15">
                  ⚡ Quick Getaways
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Mini Travel Packages</h2>
                <p className="text-white/60 text-base mt-2 max-w-lg">Budget-friendly 1–2 day trips — perfect weekend escapes from the city</p>
              </div>
              <Link to="/packages?isMini=true" className="hidden md:flex items-center gap-2 text-primary-300 font-semibold hover:gap-3 transition-all text-sm bg-white/10 px-4 py-2 rounded-xl border border-white/15">
                All packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {miniPackages.map(p => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Virtual Tour CTA ─────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-900/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-400/30 flex items-center justify-center mb-6 backdrop-blur-sm">
              <Play className="w-8 h-8 text-primary-300 fill-primary-300" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
              Explore Before<br />You Book
            </h2>
            <p className="text-white/65 text-lg mb-8 leading-relaxed max-w-lg">
              Immersive 360° virtual tours of India's most beautiful destinations. Watch highlight reels, explore panoramas, and travel with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/virtual-tours" className="inline-flex items-center gap-2 px-7 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-base">
                Start Virtual Tour <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/explore" className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm text-base">
                Browse Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-4 border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Real Experiences
              </div>
              <h2 className="section-title">What Travellers Say</h2>
              <p className="section-subtitle mx-auto mt-3">Authentic reviews from verified JourniX customers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {testimonials.map(r => <TestimonialCard key={r.id} review={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Rewards CTA ─────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-orange-500 rounded-3xl p-10 md:p-16 overflow-hidden">
            {/* BG decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-white/20">
                  <Award className="w-3.5 h-3.5" /> Loyalty Program
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                  Earn While You<br />Explore India
                </h2>
                <p className="text-white/75 text-base mb-8 leading-relaxed">
                  Get 100 welcome points on sign-up. Earn more on every booking, review, and referral. Redeem for exclusive discounts.
                </p>
                <Link to="/register" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl text-base">
                  Join JourniX Free <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎁', label: '100 pts', sub: 'Welcome Bonus' },
                  { icon: '✍️', label: '50 pts', sub: 'Per Review' },
                  { icon: '📦', label: '1 pt/₹100', sub: 'On Bookings' },
                  { icon: '🏷️', label: '₹1 / 10 pts', sub: 'Redemption Rate' },
                ].map(r => (
                  <div key={r.label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-6 text-center border border-white/15">
                    <div className="text-3xl mb-2">{r.icon}</div>
                    <div className="text-white font-bold text-lg">{r.label}</div>
                    <div className="text-white/60 text-xs mt-1">{r.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Multilingual Banner ─────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-forest-800 via-forest-700 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Globe className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
            Available in 6 Indian Languages
          </h2>
          <p className="text-white/65 mb-8 text-sm">
            Experience JourniX in your mother tongue — plan, book, and explore in the language you love most.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'English', flag: '🇬🇧' },
              { name: 'हिन्दी', flag: '🇮🇳' },
              { name: 'ಕನ್ನಡ', flag: '🌿' },
              { name: 'தமிழ்', flag: '🎭' },
              { name: 'മലയാളം', flag: '🌊' },
              { name: 'తెలుగు', flag: '🌺' },
            ].map(lang => (
              <span key={lang.name} className="flex items-center gap-2 px-5 py-2.5 bg-white/12 text-white rounded-full text-sm border border-white/20 font-medium hover:bg-white/20 transition-colors cursor-default">
                <span>{lang.flag}</span> {lang.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
