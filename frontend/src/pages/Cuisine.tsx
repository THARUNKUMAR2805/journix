import { useState, useEffect } from 'react';
import { Star, Search, Utensils, X } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const CUISINE_TYPES = [
  { value: '', label: 'All Cuisines', icon: '🍽️' },
  { value: 'traditional', label: 'Traditional', icon: '🍲' },
  { value: 'local', label: 'Local', icon: '🌿' },
  { value: 'fusion', label: 'Fusion', icon: '🍜' },
  { value: 'street food', label: 'Street Food', icon: '🛒' },
];

const PRICE_RANGES = [
  { value: '', label: 'Any Price' },
  { value: 'budget', label: '₹ Budget' },
  { value: 'moderate', label: '₹₹ Moderate' },
  { value: 'premium', label: '₹₹₹ Premium' },
];

const PRICE_BADGE = { budget: 'bg-green-100 text-green-700', moderate: 'bg-amber-100 text-amber-700', premium: 'bg-purple-100 text-purple-700' };
const PRICE_SYMBOL = { budget: '₹', moderate: '₹₹', premium: '₹₹₹' };

export default function Cuisine() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => { fetchRestaurants(); }, [cuisineType, priceRange]);

  async function fetchRestaurants() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (cuisineType) q.set('cuisineType', cuisineType);
      if (priceRange) q.set('priceRange', priceRange);
      const res = await api.get(`/restaurants?${q}`);
      setRestaurants(res.data.restaurants ?? []);
    } catch {}
    setLoading(false);
  }

  const filtered = search ? restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.speciality.toLowerCase().includes(search.toLowerCase())) : restaurants;
  const clearFilters = () => { setSearch(''); setCuisineType(''); setPriceRange(''); };
  const hasFilters = search || cuisineType || priceRange;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-amber-950 via-orange-900 to-red-950 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-medium mb-3">
            <Utensils className="w-4 h-4" /> Local Cuisine & Dining
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Taste India's Soul</h1>
          <p className="text-white/60 text-sm mb-8">Authentic local flavours, traditional recipes, and unforgettable dining</p>

          {/* Cuisine type pills */}
          <div className="flex flex-wrap gap-2">
            {CUISINE_TYPES.map(t => (
              <button key={t.value} onClick={() => setCuisineType(t.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${cuisineType === t.value ? 'bg-white text-gray-900 border-white shadow-lg' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants or dishes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
          </div>
          <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none bg-gray-50 focus:bg-white transition-all">
            {PRICE_RANGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} restaurants</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Signature dishes customers are ordering */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">🔥 Customers are ordering</p>
          <div className="flex flex-wrap gap-2">
            {[
              { dish: 'Pandi Curry', icon: '🍖', desc: 'Coorg spiced pork with vinegar' },
              { dish: 'Jackfruit Biryani', icon: '🍛', desc: 'Wayanad forest-style veg biryani' },
              { dish: 'Jolada Roti', icon: '🫓', desc: 'Hampi sorghum flatbread with chutney' },
              { dish: 'Filter Coffee', icon: '☕', desc: 'Estate-fresh Chikmagalur drip coffee' },
              { dish: 'Prawn Masala', icon: '🦐', desc: 'Gokarna Konkan-style coastal seafood' },
              { dish: 'Bamboo Chicken', icon: '🌿', desc: 'Slow-cooked inside bamboo over open fire' },
            ].map(item => (
              <button
                key={item.dish}
                onClick={() => setSearch(item.dish)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 hover:bg-amber-50 hover:border-amber-300 transition-all group"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.dish}</span>
                <span className="text-gray-400 group-hover:text-amber-600 hidden sm:inline">· {item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="animate-pulse bg-gray-200 h-44" />
                <div className="p-4 space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 rounded-lg w-3/4" />
                  <div className="animate-pulse bg-gray-200 h-3 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍴</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-500 text-sm mb-5">Try different search criteria</p>
            <button onClick={clearFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md">
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold capitalize">{r.cuisineType}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${PRICE_BADGE[r.priceRange as keyof typeof PRICE_BADGE] ?? 'bg-gray-100 text-gray-700'}`}>
                      {PRICE_SYMBOL[r.priceRange as keyof typeof PRICE_SYMBOL] ?? r.priceRange}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-base leading-tight">{r.name}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{r.destination?.name}, {r.destination?.state}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-primary-600 font-semibold mb-1.5">⭐ {r.speciality}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{r.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold">{r.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({r.totalReviews})</span>
                    </div>
                    {r.phone && (
                      <a href={`tel:${r.phone}`} className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg transition-colors">
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

