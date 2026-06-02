import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Users, CheckCircle, MapPin } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import TestimonialCard from '../components/TestimonialCard';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function PackageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/packages/${id}`)
      .then(r => setPkg(r.data.package))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!pkg) return <div className="min-h-screen flex items-center justify-center pt-16 text-gray-500">Package not found</div>;

  const includes = (() => { try { return JSON.parse(pkg.includes); } catch { return []; } })();
  const highlights = (() => { try { return JSON.parse(pkg.highlights); } catch { return []; } })();

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img src={pkg.coverImage} alt={pkg.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <Link to="/packages" className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black/30 px-3 py-2 rounded-lg text-sm hover:bg-black/50">
          <ArrowLeft className="w-4 h-4" /> Packages
        </Link>
        <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto">
          <div className="flex gap-2 mb-2">
            {pkg.isMini && <span className="badge bg-primary-500 text-white text-xs">⚡ Mini Package</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{pkg.name}</h1>
          {pkg.destination && (
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="w-4 h-4" /> {pkg.destination.name}, {pkg.destination.state}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock, label: 'Duration', value: `${pkg.duration} Days` },
                { icon: Users, label: 'Max People', value: pkg.maxPeople },
                { icon: Star, label: 'Rating', value: `${pkg.rating.toFixed(1)} (${pkg.totalReviews})` },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <s.icon className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                  <div className="font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl mb-3">About This Package</h3>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl mb-4">What's Included</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {includes.map((item: string) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700 bg-forest-50 rounded-xl p-3">
                    <CheckCircle className="w-4 h-4 text-forest-600 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-xl mb-4">Trip Highlights</h3>
                <div className="space-y-2">
                  {highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-700 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-primary-500 font-bold shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {pkg.reviews?.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl mb-4">Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.reviews.map((r: any) => <TestimonialCard key={r.id} review={r} />)}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-primary-600">₹{pkg.price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">per person</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration} days</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {pkg.maxPeople}</span>
              </div>
              {pkg.isAvailable ? (
                <button
                  onClick={() => user ? setBookingOpen(true) : window.location.href = '/login'}
                  className="w-full btn-primary justify-center text-base py-3 mb-3"
                >
                  {user ? 'Book This Package' : 'Login to Book'}
                </button>
              ) : (
                <button disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed mb-3">Unavailable</button>
              )}
              <p className="text-xs text-gray-400 text-center">Free cancellation up to 48 hours before departure</p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                <p className="font-medium text-gray-800 mb-2">Package Includes:</p>
                <ul className="space-y-1">
                  {includes.slice(0, 4).map((item: string) => (
                    <li key={item} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-forest-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && pkg && (
        <BookingModal type="package" itemId={pkg.id} itemName={pkg.name} price={pkg.price} onClose={() => setBookingOpen(false)} />
      )}
    </div>
  );
}
