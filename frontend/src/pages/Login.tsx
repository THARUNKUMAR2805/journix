import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200', place: 'Coorg, Karnataka', desc: 'Coffee Hills & Morning Mist' },
  { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200', place: 'Hampi, Karnataka', desc: 'Ancient Ruins & Timeless Stories' },
  { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200', place: 'Wayanad, Kerala', desc: 'Jungle Retreats & Wild Wonders' },
];

const PERKS = [
  'Explore 200+ hand-picked local destinations',
  'Earn loyalty points on every booking',
  '6 regional languages supported',
  'Real reviews from local travellers',
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [heroIdx] = useState(() => Math.floor(Math.random() * HERO_IMAGES.length));

  const hero = HERO_IMAGES[heroIdx];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel – Hero ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        <img src={hero.url} alt={hero.place} className="absolute inset-0 w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-primary-900/50" />
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-wide">JourniX</span>
          </Link>

          {/* Main copy */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs px-4 py-2 rounded-full border border-white/20 mb-6">
              <MapPin className="w-3.5 h-3.5 text-primary-300" />
              {hero.place} — {hero.desc}
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4">
              Discover India<br />
              <span className="text-primary-400">One Journey</span> at a Time
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-sm">
              Your all-in-one platform for authentic local travel — hotels, cuisine, transport, and hidden gems.
            </p>
            <div className="space-y-3">
              {PERKS.map(p => (
                <div key={p} className="flex items-center gap-3 text-white/80 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" />
                  {p}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-white/90 text-sm italic leading-relaxed mb-3">
              "JourniX made my trip to Coorg absolutely seamless. Found the best local stay and authentic food in minutes!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-bold">P</div>
              <div>
                <p className="text-white text-xs font-semibold">Priya Sharma</p>
                <p className="text-white/50 text-xs">Verified Traveller, Bengaluru</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel – Form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900">JourniX</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs text-primary-500 hover:text-primary-600 font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
              Create one free
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">Demo credentials</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 space-y-1.5">
            <p className="font-semibold text-amber-900">🧪 Try a demo account</p>
            <div className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2 cursor-pointer hover:bg-white transition-colors"
              onClick={() => { setEmail('tharundondapati982@gmail.com'); setPassword('admin123'); }}>
              <span>Admin account</span>
              <span className="font-mono text-amber-700">admin123</span>
            </div>
            <div className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2 cursor-pointer hover:bg-white transition-colors"
              onClick={() => { setEmail('priya@example.com'); setPassword('user123'); }}>
              <span>User account</span>
              <span className="font-mono text-amber-700">user123</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By signing in you agree to JourniX's{' '}
            <span className="underline cursor-pointer hover:text-gray-600">Terms</span> &{' '}
            <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

