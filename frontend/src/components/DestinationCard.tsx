import { Link } from 'react-router-dom';
import { MapPin, Star, TrendingUp, Leaf } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  state: string;
  shortDesc: string;
  coverImage: string;
  rating: number;
  totalReviews: number;
  season: string;
  isTrending: boolean;
  isLesserKnown: boolean;
  virtualTour?: { id: string } | null;
  _count?: { hotels: number; restaurants: number; packages: number };
}

interface Props {
  destination: Destination;
}

const seasonColors: Record<string, string> = {
  summer: 'bg-amber-100 text-amber-700',
  winter: 'bg-blue-100 text-blue-700',
  monsoon: 'bg-teal-100 text-teal-700',
  all: 'bg-gray-100 text-gray-600',
};

export default function DestinationCard({ destination: d }: Props) {
  return (
    <Link to={`/destinations/${d.id}`} className="group card block">
      <div className="relative overflow-hidden h-52">
        <img
          src={d.coverImage}
          alt={d.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'; }}
        />
        <div className="absolute inset-0 bg-card-gradient" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {d.isTrending && (
            <span className="badge bg-primary-500 text-white gap-1">
              <TrendingUp className="w-3 h-3" /> Trending
            </span>
          )}
          {d.isLesserKnown && (
            <span className="badge bg-forest-600 text-white gap-1">
              <Leaf className="w-3 h-3" /> Hidden Gem
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`badge text-xs font-medium ${seasonColors[d.season] || seasonColors.all}`}>
            {d.season === 'all' ? 'Year-round' : d.season.charAt(0).toUpperCase() + d.season.slice(1)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-display font-bold text-lg leading-tight">{d.name}</h3>
          <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
            <MapPin className="w-3 h-3" /> {d.state}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{d.shortDesc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{d.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({d.totalReviews.toLocaleString()})</span>
          </div>
          {d._count && (
            <div className="flex gap-3 text-xs text-gray-500">
              <span>{d._count.hotels} hotels</span>
              <span>{d._count.packages} packages</span>
            </div>
          )}
        </div>
        {d.virtualTour && (
          <div className="mt-2 text-xs text-primary-500 font-medium flex items-center gap-1">
            ▶ Virtual tour available
          </div>
        )}
      </div>
    </Link>
  );
}
