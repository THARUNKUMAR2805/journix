import { useState } from 'react';
import { X, Calendar, Users, MessageSquare, CreditCard, Award } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  type: 'hotel' | 'transport' | 'package';
  itemId: string;
  itemName: string;
  price: number;
  onClose: () => void;
}

export default function BookingModal({ type, itemId, itemName, price, onClose }: Props) {
  const { user, updateUser } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [people, setPeople] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;
  const total = type === 'hotel' ? price * nights * people : price * people;
  const pointsToEarn = Math.floor(total / 100);

  async function handleBook() {
    if (type === 'hotel' && (!checkIn || !checkOut)) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = { type, people, specialRequests };
      if (type === 'hotel') { payload.hotelId = itemId; payload.checkIn = checkIn; payload.checkOut = checkOut; }
      if (type === 'transport') payload.transportId = itemId;
      if (type === 'package') payload.packageId = itemId;

      const res = await api.post('/bookings', payload);
      toast.success(`Booking confirmed! You earned ${res.data.pointsEarned} loyalty points 🎉`);
      if (user) updateUser({ loyaltyPoints: user.loyaltyPoints + (res.data.pointsEarned ?? 0) });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Booking failed');
    }
    setLoading(false);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-gray-900">Book {itemName}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {type === 'hotel' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" />Check-in</label>
                <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" />Check-out</label>
                <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} className="input-field text-sm" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Users className="w-3 h-3" />Number of People</label>
            <input type="number" min={1} max={20} value={people} onChange={e => setPeople(Math.max(1, parseInt(e.target.value) || 1))} className="input-field text-sm" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><MessageSquare className="w-3 h-3" />Special Requests (optional)</label>
            <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} rows={2} placeholder="Any special requests or notes..." className="input-field text-sm resize-none" />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>₹{price.toLocaleString()} × {type === 'hotel' ? `${nights} night${nights > 1 ? 's' : ''} × ${people} guest${people > 1 ? 's' : ''}` : `${people} person${people > 1 ? 's' : ''}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 text-base">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary-600 text-xs font-medium pt-1">
              <Award className="w-3.5 h-3.5" />
              You'll earn {pointsToEarn} loyalty points!
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? 'Processing...' : `Confirm Booking · ₹${total.toLocaleString()}`}
          </button>
          <p className="text-xs text-gray-400 text-center">Payment will be collected at the property</p>
        </div>
      </div>
    </div>
  );
}
