import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Building2, Bed, Palmtree, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import HotelCard from '../components/HotelCard';
import api from '../utils/api';

const TYPES = [
  { value: '', label: 'All Types', icon: '🏘️' },
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'hostel', label: 'Hostel', icon: '🛏️' },
  { value: 'resort', label: 'Resort', icon: '🏝️' },
  { value: 'homestay', label: 'Homestay', icon: '🏡' },
];

const PRICE_OPTS = [
  { value: '', label: 'Any Price' },
  { value: '1000', label: 'Under ₹1,000' },
  { value: '3000', label: 'Under ₹3,000' },
  { value: '6000', label: 'Under ₹6,000' },
  { value: '10000', label: 'Under ₹10,000' },
];

export default function Hotels() {
  const [params] = useSearchParams();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(params.get('type') ?? '');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => { fetchHotels(); }, [type, maxPrice]);

  async function fetchHotels() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (type) q.set('type', type);
      if (maxPrice) q.set('maxPrice', maxPrice);
      const res = await api.get(`/hotels?${q}`);
      setHotels(res.data.hotels ?? []);
    } catch {}
    setLoading(false);
  }

  const filtered = search
    ? hotels.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.destination?.name.toLowerCase().includes(search.toLowerCase()))
    : hotels;

  const clearFilters = () => { setSearch(''); setType(''); setMaxPrice(''); };
  const hasFilters = search || type || maxPrice;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-950 via-gray-900 to-primary-950 pt-20 pb-12">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium mb-3">
            <Building2 className="w-4 h-4" /> Hotels & Stays
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Find Your Perfect Stay</h1>
          <p className="text-white/60 text-sm mb-8">Luxury resorts, budget hostels, and authentic homestays across India</p>

          {/* Type pills */}
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setType(t.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${type === t.value ? 'bg-white text-gray-900 border-white shadow-lg' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotels, destinations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
          </div>
          <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-400 transition-all">
            {PRICE_OPTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} stays found</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="animate-pulse bg-gray-200 h-48" />
                <div className="p-4 space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 rounded-lg w-3/4" />
                  <div className="animate-pulse bg-gray-200 h-3 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h3>
            <p className="text-gray-500 text-sm mb-5">Try adjusting your filters</p>
            <button onClick={clearFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md">
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <HotelCard hotel={h} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

