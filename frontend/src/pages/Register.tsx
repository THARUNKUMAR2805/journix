import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin, ArrowRight, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LANGUAGES } from '../utils/i18n';

const BG_IMG = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200';

const STEPS = [
  { icon: '🗺️', title: 'Explore Destinations', desc: '200+ curated local spots' },
  { icon: '🎁', title: 'Earn 100 Points', desc: 'Instant welcome bonus' },
  { icon: '🌐', title: 'Multi-Language', desc: '6 regional languages' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', language: 'en' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Registration failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel – Hero ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img src={BG_IMG} alt="India travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-primary-950/70 to-gray-900/60" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-white">JourniX</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary-300" />
              <span className="text-primary-200 text-xs font-medium">Join 50,000+ Travellers</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white leading-tight mb-4">
              Start Your<br />
              <span className="text-primary-400">India Journey</span><br />
              Today
            </h1>
            <p className="text-white/65 text-sm leading-relaxed mb-10 max-w-xs">
              Create a free account and unlock access to 200+ local destinations, authentic cuisines, and exclusive travel packages.
            </p>

            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{s.title}</p>
                    <p className="text-white/55 text-xs">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Welcome bonus badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-4 bg-gradient-to-r from-primary-500/30 to-amber-500/20 backdrop-blur-md border border-primary-400/30 rounded-2xl p-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">🎉 Welcome Bonus</p>
              <p className="text-white/70 text-xs">Get <span className="text-primary-300 font-bold">100 Loyalty Points</span> instantly on sign-up — redeemable on any booking!</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel – Form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] py-6"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900">JourniX</span>
          </div>

          {/* Mobile bonus banner */}
          <div className="flex items-center gap-3 bg-primary-500 rounded-xl p-3.5 text-white mb-6 lg:hidden">
            <Award className="w-5 h-5 opacity-80 shrink-0" />
            <p className="text-sm font-medium">Get <strong>100 Loyalty Points</strong> instantly on sign-up!</p>
          </div>

          <div className="mb-7">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Create account</h2>
            <p className="text-gray-500 text-sm">Join thousands of Indian travellers</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Priya Sharma"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                    autoComplete="new-password" placeholder="Min. 6 characters"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all pr-12" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Language</label>
                <select name="language" value={form.language} onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all">
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.native} — {l.label}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : (
                <>Create Account & Get 100 Points <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
              Sign in
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            By creating an account you agree to JourniX's{' '}
            <span className="underline cursor-pointer hover:text-gray-600">Terms</span> &{' '}
            <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

