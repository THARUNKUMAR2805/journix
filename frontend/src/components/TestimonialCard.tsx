import { Star, Quote } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  type: string;
  createdAt: string;
  user: { name: string; avatar?: string };
}

export default function TestimonialCard({ review: r }: { review: Review }) {
  const initials = r.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <Quote className="w-8 h-8 text-primary-200" />
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1">{r.comment}</p>
      <div className="flex items-center gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100'}`} />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center text-sm">
          {r.user.avatar ? (
            <img src={r.user.avatar} alt={r.user.name} className="w-full h-full rounded-full object-cover" />
          ) : initials}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{r.user.name}</p>
          <p className="text-xs text-gray-400">
            {r.type.charAt(0).toUpperCase() + r.type.slice(1)} review · {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
