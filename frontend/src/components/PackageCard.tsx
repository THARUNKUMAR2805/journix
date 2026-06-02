import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Users, CheckCircle, Zap } from 'lucide-react';

interface TravelPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  rating: number;
  totalReviews: number;
  coverImage: string;
  isMini: boolean;
  includes: string;
  highlights: string;
  maxPeople: number;
  destination?: { name: string; state: string };
}

export default function PackageCard({ pkg: p }: { pkg: TravelPackage }) {
  const includes = (() => { try { return JSON.parse(p.includes) as string[]; } catch { return []; } })();
  const highlights = (() => { try { return JSON.parse(p.highlights) as string[]; } catch { return []; } })();

  return (
    <Link to={`/packages/${p.id}`} className="group card block">
      <div className="relative overflow-hidden h-52">
        <img
          src={p.coverImage}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {p.isMini && (
            <span className="badge bg-primary-500 text-white gap-1 text-xs">
              <Zap className="w-3 h-3" /> Mini Package
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="text-white font-display font-bold text-base leading-tight line-clamp-2">{p.name}</h3>
            {p.destination && (
              <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                <MapPin className="w-3 h-3" /> {p.destination.name}
              </div>
            )}
          </div>
          <div className="text-right shrink-0 ml-2">
            <div className="text-white font-bold text-lg">₹{p.price.toLocaleString()}</div>
            <div className="text-white/70 text-xs">per person</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{p.duration} days</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {p.maxPeople}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold">{p.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {includes.slice(0, 4).map((item) => (
            <span key={item} className="flex items-center gap-1 text-xs text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-2.5 h-2.5" /> {item}
            </span>
          ))}
          {includes.length > 4 && (
            <span className="text-xs text-gray-500 px-2 py-0.5">+{includes.length - 4} more</span>
          )}
        </div>
        {highlights.length > 0 && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-1">
            ✦ {highlights.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    </Link>
  );
}
