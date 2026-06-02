import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Waves } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  type: string;
  coverImage: string;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  address: string;
  facilities: string;
  destination?: { name: string; state: string };
}

const facilityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'Pool': <Waves className="w-3 h-3" />,
  'Parking': <Car className="w-3 h-3" />,
  'Restaurant': <Utensils className="w-3 h-3" />,
};

const typeColors: Record<string, string> = {
  resort: 'bg-purple-100 text-purple-700',
  hotel: 'bg-blue-100 text-blue-700',
  hostel: 'bg-green-100 text-green-700',
  homestay: 'bg-amber-100 text-amber-700',
};

export default function HotelCard({ hotel: h }: { hotel: Hotel }) {
  const facilities = (() => { try { return JSON.parse(h.facilities); } catch { return []; } })();

  return (
    <Link to={`/hotels/${h.id}`} className="group card block">
      <div className="relative overflow-hidden h-48">
        <img
          src={h.coverImage}
          alt={h.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'; }}
        />
        <div className="absolute top-3 left-3">
          <span className={`badge text-xs capitalize ${typeColors[h.type] || 'bg-gray-100 text-gray-600'}`}>
            {h.type}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
          <span className="text-primary-600 font-bold text-sm">₹{h.pricePerNight.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">/night</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{h.name}</h3>
        {h.destination && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3" /> {h.destination.name}, {h.destination.state}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold">{h.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({h.totalReviews})</span>
          </div>
          <div className="flex gap-1.5">
            {facilities.slice(0, 4).map((f: string) => (
              facilityIcons[f] ? (
                <span key={f} title={f} className="text-gray-400 hover:text-primary-500 transition-colors">
                  {facilityIcons[f]}
                </span>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
