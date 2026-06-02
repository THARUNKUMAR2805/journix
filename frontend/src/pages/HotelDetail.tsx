import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, Mail, Wifi, Waves, Car, Utensils, Dumbbell, Trees } from 'lucide-react';
import TestimonialCard from '../components/TestimonialCard';
import BookingModal from '../components/BookingModal';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Pool': <Waves className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Restaurant': <Utensils className="w-4 h-4" />,
  'Gym': <Dumbbell className="w-4 h-4" />,
  'Garden': <Trees className="w-4 h-4" />,
};

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    api.get(`/hotels/${id}`)
      .then(r => setHotel(r.data.hotel))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!hotel) return <div className="min-h-screen flex items-center justify-center pt-16 text-gray-500">Hotel not found</div>;

  const images = (() => { try { return JSON.parse(hotel.images); } catch { return [hotel.coverImage]; } })();
  const facilities = (() => { try { return JSON.parse(hotel.facilities); } catch { return []; } })();

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Gallery */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Link to="/hotels" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Hotels
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-4">
            <img src={images[activeImg]} alt={hotel.name} className="w-full h-80 object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600'; }} />
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((img: string, i: number) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} className={`w-full h-36 object-cover rounded-xl cursor-pointer transition-opacity ${activeImg === i ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'}`} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'; }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge bg-primary-100 text-primary-700 capitalize">{hotel.type}</span>
                {!hotel.isAvailable && <span className="badge bg-red-100 text-red-700">Currently Unavailable</span>}
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{hotel.address}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{hotel.rating.toFixed(1)} ({hotel.totalReviews} reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-display font-bold text-xl mb-4">Facilities & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facilities.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
                    <span className="text-primary-500">{FACILITY_ICONS[f] ?? '✓'}</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {hotel.reviews?.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-xl mb-4">Guest Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.reviews.map((r: any) => <TestimonialCard key={r.id} review={r} />)}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-primary-600">₹{hotel.pricePerNight.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">per night</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">· {hotel.totalReviews} reviews</span>
              </div>
              {hotel.isAvailable ? (
                <button
                  onClick={() => user ? setBookingOpen(true) : window.location.href = '/login'}
                  className="w-full btn-primary justify-center text-base py-3"
                >
                  {user ? 'Book Now' : 'Login to Book'}
                </button>
              ) : (
                <button disabled className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed">Currently Unavailable</button>
              )}
              <p className="text-xs text-gray-400 text-center mt-2">You won't be charged yet</p>

              {/* Contact */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {hotel.phone && <a href={`tel:${hotel.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500"><Phone className="w-4 h-4" />{hotel.phone}</a>}
                {hotel.email && <a href={`mailto:${hotel.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500"><Mail className="w-4 h-4" />{hotel.email}</a>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && hotel && (
        <BookingModal
          type="hotel"
          itemId={hotel.id}
          itemName={hotel.name}
          price={hotel.pricePerNight}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
}
