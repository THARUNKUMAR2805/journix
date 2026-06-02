import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Zap, Package, X } from 'lucide-react';
import { motion } from 'framer-motion';
import PackageCard from '../components/PackageCard';
import api from '../utils/api';

export default function Packages() {
  const [params] = useSearchParams();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMini, setIsMini] = useState(params.get('isMini') === 'true');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDays, setMaxDays] = useState('');

  useEffect(() => { fetchPackages(); }, [isMini, maxPrice, maxDays]);

  async function fetchPackages() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (isMini) q.set('isMini', 'true');
      if (maxPrice) q.set('maxPrice', maxPrice);
      if (maxDays) q.set('maxDays', maxDays);
      const res = await api.get(`/packages?${q}`);
      setPackages(res.data.packages ?? []);
    } catch {}
    setLoading(false);
  }

  const hasFilters = isMini || maxPrice || maxDays;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-950 via-orange-950 to-gray-900 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-primary-300 text-sm font-medium mb-3">
            <Package className="w-4 h-4" /> Travel Packages
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Your Next Adventure Awaits</h1>
          <p className="text-white/60 text-sm mb-8">Curated packages from quick weekend escapes to immersive multi-day adventures</p>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setIsMini(!isMini)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                isMini ? 'bg-white text-gray-900 border-white shadow-lg' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
              }`}>
              <Zap className="w-3.5 h-3.5" /> ⚡ Mini Packages (1-2 days)
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all">
            <option value="">Any Budget</option>
            <option value="3000">Under ₹3,000</option>
            <option value="6000">Under ₹6,000</option>
            <option value="10000">Under ₹10,000</option>
            <option value="20000">Under ₹20,000</option>
          </select>
          <select value={maxDays} onChange={e => setMaxDays(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all">
            <option value="">Any Duration</option>
            <option value="1">1 Day</option>
            <option value="2">Up to 2 Days</option>
            <option value="4">Up to 4 Days</option>
            <option value="7">Up to 7 Days</option>
          </select>
          {hasFilters && (
            <button onClick={() => { setIsMini(false); setMaxPrice(''); setMaxDays(''); }}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <span className="text-xs text-gray-400 ml-auto">{packages.length} packages</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="animate-pulse bg-gray-200 h-52" />
                <div className="p-4 space-y-2"><div className="animate-pulse bg-gray-200 h-4 rounded-lg w-3/4" /></div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🎒</span></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No packages found</h3>
            <p className="text-gray-500 text-sm mb-5">Try adjusting your filters</p>
            <button onClick={() => { setIsMini(false); setMaxPrice(''); setMaxDays(''); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md">
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <PackageCard pkg={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
