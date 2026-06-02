import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Leaf, TrendingUp, MapPin, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DestinationCard from '../components/DestinationCard';
import api from '../utils/api';

const SEASONS = [
  { value: '', label: 'All Seasons', icon: '🌍' },
  { value: 'summer', label: 'Summer', icon: '☀️' },
  { value: 'winter', label: 'Winter', icon: '❄️' },
  { value: 'monsoon', label: 'Monsoon', icon: '🌧️' },
  { value: 'all', label: 'Year-round', icon: '🌿' },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [season, setSeason] = useState(params.get('season') ?? '');
  const [trending, setTrending] = useState(params.get('trending') === 'true');
  const [lesserKnown, setLesserKnown] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, [season, trending, lesserKnown]);

  async function fetchDestinations() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (season) q.set('season', season);
      if (trending) q.set('trending', 'true');
      if (lesserKnown) q.set('lesserKnown', 'true');
      if (search) q.set('search', search);
      const res = await api.get(`/destinations?${q}`);
      setDestinations(res.data.destinations ?? []);
    } catch {}
    setLoading(false);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDestinations();
  };

  const clearFilters = () => {
    setSearch(''); setSeason(''); setTrending(false); setLesserKnown(false);
    setParams({});
  };

  const hasFilters = search || season || trending || lesserKnown;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 pt-20 pb-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 pb-6">
          <div className="flex items-center gap-2 text-primary-300 text-sm font-medium mb-3">
            <MapPin className="w-4 h-4" /> Explore India
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Find Your Next Destination</h1>
          <p className="text-white/60 text-sm">Discover handpicked local experiences across India</p>
        </div>

        {/* Search + filter bar */}
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search destinations, states, activities..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm transition-all"
                />
              </form>

              {/* Season filter */}
              <select
                value={season}
                onChange={e => setSeason(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white transition-all min-w-[140px]"
              >
                {SEASONS.map(s => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
              </select>

              {/* Filter buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setTrending(!trending)}
                  className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${trending ? 'bg-primary-500 text-white border-primary-500 shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'}`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Trending
                </button>

                <button
                  onClick={() => setLesserKnown(!lesserKnown)}
                  className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${lesserKnown ? 'bg-forest-600 text-white border-forest-600 shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-forest-400 hover:bg-forest-50'}`}
                >
                  <Leaf className="w-3.5 h-3.5" /> Hidden Gems
                </button>

                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 text-sm text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Result count + active filters */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {loading ? 'Searching...' : (
                <><span className="text-primary-500">{destinations.length}</span> destination{destinations.length !== 1 ? 's' : ''} found</>
              )}
            </h2>
            {hasFilters && !loading && (
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Filtered results
                {season && ` · ${SEASONS.find(s => s.value === season)?.label}`}
                {trending && ' · Trending'}
                {lesserKnown && ' · Hidden Gems'}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="animate-pulse bg-gray-200 h-52" />
                <div className="p-4 space-y-3">
                  <div className="animate-pulse bg-gray-200 h-4 rounded-lg w-3/4" />
                  <div className="animate-pulse bg-gray-200 h-3 rounded-lg w-1/2" />
                  <div className="animate-pulse bg-gray-200 h-3 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No destinations found</h3>
              <p className="text-gray-500 text-sm mb-6">Try different keywords or clear your filters to see all destinations</p>
              <button onClick={clearFilters} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md">
                <X className="w-4 h-4" /> Clear All Filters
              </button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {destinations.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <DestinationCard destination={d} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

