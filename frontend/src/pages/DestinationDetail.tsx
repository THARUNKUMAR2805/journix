import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, ArrowLeft, Hotel, Utensils, Car, Package, Video, ExternalLink } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import api from '../utils/api';

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'food' | 'transport' | 'packages'>('overview');

  useEffect(() => {
    if (!id) return;
    api.get(`/destinations/${id}`)
      .then(r => setDestination(r.data.destination))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading destination...</p>
      </div>
    </div>
  );

  if (!destination) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h3 className="text-xl font-bold text-gray-700">Destination not found</h3>
        <Link to="/explore" className="btn-primary mt-4">Back to Explore</Link>
      </div>
    </div>
  );

  const images = (() => { try { return JSON.parse(destination.images); } catch { return [destination.coverImage]; } })();

  const TABS = [
    { key: 'overview', label: 'Overview', icon: MapPin },
    { key: 'hotels', label: `Hotels (${destination.hotels?.length ?? 0})`, icon: Hotel },
    { key: 'food', label: `Cuisine (${destination.restaurants?.length ?? 0})`, icon: Utensils },
    { key: 'transport', label: `Transport (${destination.transports?.length ?? 0})`, icon: Car },
    { key: 'packages', label: `Packages (${destination.packages?.length ?? 0})`, icon: Package },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Hero Image */}
      <div className="relative h-80 md:h-[480px]">
        <img src={destination.coverImage} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link to="/explore" className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-black/50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {destination.isTrending && <span className="badge bg-primary-500 text-white">🔥 Trending</span>}
              {destination.isLesserKnown && <span className="badge bg-forest-600 text-white">🌿 Hidden Gem</span>}
              <span className="badge bg-white/20 text-white border border-white/30 capitalize">{destination.season === 'all' ? '🌿 Year-round' : destination.season}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{destination.state}, {destination.country}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{destination.rating.toFixed(1)} ({destination.totalReviews.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-2 mt-4 rounded-2xl overflow-hidden max-h-48">
          {images.slice(0, 3).map((img: string, i: number) => (
            <img key={i} src={img} alt="" className="w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer" />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mt-6 mb-6 border-b border-gray-200 -mx-1 px-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-xl mb-3">About {destination.name}</h3>
                <p className="text-gray-600 leading-relaxed">{destination.description}</p>
              </div>
              {/* Reviews */}
              {destination.reviews?.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-xl mb-4">Recent Reviews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.reviews.map((r: any) => <TestimonialCard key={r.id} review={r} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Facts</h4>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'State', value: destination.state },
                    { label: 'Best Season', value: destination.season === 'all' ? 'Year-round' : destination.season.charAt(0).toUpperCase() + destination.season.slice(1) },
                    { label: 'Hotels', value: destination.hotels?.length ?? 0 },
                    { label: 'Restaurants', value: destination.restaurants?.length ?? 0 },
                    { label: 'Packages', value: destination.packages?.length ?? 0 },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">{f.label}</span>
                      <span className="font-medium text-gray-900 capitalize">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Virtual Tour */}
              {destination.virtualTour && (
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white">
                  <Video className="w-8 h-8 mb-3 opacity-80" />
                  <h4 className="font-bold mb-1">Virtual Tour Available</h4>
                  <p className="text-white/70 text-sm mb-3">Experience {destination.name} before you visit</p>
                  <Link to="/virtual-tours" className="flex items-center gap-2 text-sm font-semibold bg-white/20 rounded-lg px-3 py-2 hover:bg-white/30 transition-colors">
                    <ExternalLink className="w-4 h-4" /> Start Tour
                  </Link>
                </div>
              )}

              {/* Best Time */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <Calendar className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-semibold text-amber-900 mb-1">Best Time to Visit</h4>
                <p className="text-amber-700 text-sm capitalize">
                  {destination.season === 'all' ? 'This destination is beautiful year-round.' : `Best visited during ${destination.season} months.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotels' && (
          <div className="pb-12">
            {destination.hotels?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.hotels.map((h: any) => <HotelCard key={h.id} hotel={h} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">No hotels found for this destination yet.</div>
            )}
          </div>
        )}

        {activeTab === 'food' && (
          <div className="pb-12">
            {destination.restaurants?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.restaurants.map((r: any) => (
                  <div key={r.id} className="card">
                    <div className="relative h-44 overflow-hidden">
                      <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'; }} />
                      <div className="absolute top-3 left-3">
                        <span className="badge bg-amber-100 text-amber-700 capitalize">{r.cuisineType}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{r.name}</h3>
                      <p className="text-sm text-primary-600 font-medium mb-1">★ {r.speciality}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{r.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-semibold">{r.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({r.totalReviews})</span>
                        </div>
                        <span className={`badge text-xs capitalize ${r.priceRange === 'budget' ? 'bg-green-100 text-green-700' : r.priceRange === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                          {r.priceRange === 'budget' ? '₹' : r.priceRange === 'moderate' ? '₹₹' : '₹₹₹'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">No restaurants listed for this destination yet.</div>
            )}
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="pb-12">
            {destination.transports?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.transports.map((t: any) => (
                  <div key={t.id} className="card p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
                        {t.type === 'taxi' ? '🚗' : t.type === 'auto' ? '🛺' : t.type === 'boat' ? '⛵' : t.type === 'bus' ? '🚌' : '🚐'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{t.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{t.isIndividual ? '👤 Individual Owner' : '🏢 Agency'} · {t.type}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{t.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <span className="font-bold text-primary-600">₹{t.pricePerDay.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">/day</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold">{t.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">📞 {t.ownerPhone}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">No transport services listed for this destination yet.</div>
            )}
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="pb-12">
            {destination.packages?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.packages.map((p: any) => <PackageCard key={p.id} pkg={p} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">No packages available for this destination yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
