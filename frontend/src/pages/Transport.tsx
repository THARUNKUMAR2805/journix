import { useState, useEffect } from 'react';
import { Star, Users, Phone, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingModal from '../components/BookingModal';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const TRANSPORT_TYPES = [
  { value: '', label: 'All Types', icon: '🚐' },
  { value: 'taxi', label: 'Taxi / Cab', icon: '🚗' },
  { value: 'auto', label: 'Auto Rickshaw', icon: '🛺' },
  { value: 'bus', label: 'Bus', icon: '🚌' },
  { value: 'boat', label: 'Boat', icon: '⛵' },
  { value: 'bike', label: 'Bike', icon: '🏍️' },
];

const TYPE_ICON: Record<string, string> = { taxi: '🚗', auto: '🛺', boat: '⛵', bus: '🚌', bike: '🏍️' };

export default function Transport() {
  const { user } = useAuth();
  const [transports, setTransports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [individualOnly, setIndividualOnly] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);

  useEffect(() => { fetchTransports(); }, [typeFilter, individualOnly]);

  async function fetchTransports() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (typeFilter) q.set('type', typeFilter);
      if (individualOnly) q.set('isIndividual', 'true');
      const res = await api.get(`/transport?${q}`);
      setTransports(res.data.transports ?? []);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-blue-900 to-gray-950 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium mb-3">
            <Car className="w-4 h-4" /> Local Transport
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Get Around India</h1>
          <p className="text-white/60 text-sm mb-8">Verified local agencies and individual vehicle owners — affordable, authentic, trustworthy</p>

          <div className="flex flex-wrap gap-2">
            {TRANSPORT_TYPES.map(t => (
              <button key={t.value} onClick={() => setTypeFilter(t.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${typeFilter === t.value ? 'bg-white text-gray-900 border-white shadow-lg' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setIndividualOnly(!individualOnly)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${individualOnly ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'}`}
          >
            👤 Individual Owners Only
          </button>
          <span className="text-xs text-gray-400 ml-auto">{transports.length} services available</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="animate-pulse bg-gray-200 h-14 w-14 rounded-xl mb-4" />
                <div className="animate-pulse bg-gray-200 h-4 rounded-lg w-3/4 mb-2" />
                <div className="animate-pulse bg-gray-200 h-3 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : transports.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🚗</span></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No transport services found</h3>
            <button onClick={() => setIndividualOnly(false)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl mt-4">Clear Filter</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transports.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {TYPE_ICON[t.type] ?? '🚐'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{t.name}</h3>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">{t.type}</p>
                      <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${t.isIndividual ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {t.isIndividual ? '👤 Individual' : '🏢 Agency'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-primary-600 text-xl">₹{t.pricePerDay.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">/day</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{t.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Capacity: {t.capacity}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{t.rating.toFixed(1)} ({t.totalReviews})</span>
                </div>

                {t.ownerName && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-2">
                    <Phone className="w-3 h-3" />
                    <span>{t.ownerName} · {t.ownerPhone}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => user ? setSelectedTransport(t) : (window.location.href = '/login')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    {user ? 'Book Now' : 'Login to Book'}
                  </button>
                  <a href={`tel:${t.ownerPhone}`} className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedTransport && (
        <BookingModal
          type="transport"
          itemId={selectedTransport.id}
          itemName={selectedTransport.name}
          price={selectedTransport.pricePerDay}
          onClose={() => setSelectedTransport(null)}
        />
      )}
    </div>
  );
}
