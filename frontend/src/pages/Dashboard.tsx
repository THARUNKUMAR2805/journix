import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, Award, History, Star, Gift, ChevronRight, Calendar, MapPin, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'bookings', label: 'My Bookings', icon: History },
  { key: 'rewards', label: 'Rewards', icon: Award },
  { key: 'profile', label: 'Profile', icon: User },
];

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [tab, setTab] = useState<string>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [profileForm, setProfileForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', language: user?.language ?? 'en' });
  const [redeemPoints, setRedeemPoints] = useState('');
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingRewards, setLoadingRewards] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchBookings();
    fetchRewards();
  }, [user]);

  useEffect(() => {
    if (initialTab && TABS.some(t => t.key === initialTab)) {
      setTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const onBookingCreated = () => {
      fetchBookings();
      fetchRewards();
    };
    window.addEventListener('booking:created', onBookingCreated);
    return () => window.removeEventListener('booking:created', onBookingCreated);
  }, []);

  async function fetchBookings() {
    setLoadingBookings(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.bookings ?? []);
    } catch {}
    setLoadingBookings(false);
  }

  async function fetchRewards() {
    setLoadingRewards(true);
    try {
      const res = await api.get('/rewards');
      setRewards(res.data.rewards ?? []);
      setTotalPoints(res.data.totalPoints ?? 0);
    } catch {}
    setLoadingRewards(false);
  }

  async function cancelBooking(id: string) {
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Cancellation failed');
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    }
  }

  async function handleRedeem() {
    const pts = parseInt(redeemPoints);
    if (!pts || pts < 100) { toast.error('Enter at least 100 points'); return; }
    try {
      const res = await api.post('/rewards/redeem', { points: pts });
      toast.success(`Redeemed! You got ₹${res.data.discountAmount} discount`);
      fetchRewards();
      updateUser({ loyaltyPoints: (user?.loyaltyPoints ?? 0) - pts });
      setRedeemPoints('');
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Redemption failed');
    }
  }

  if (!user) return null;

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : user.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold">{user.name}</h1>
            <p className="text-primary-100 text-sm">{user.email} · {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold">{user.loyaltyPoints}</div>
              <div className="text-xs text-primary-100">Loyalty Points</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold">{confirmedBookings}</div>
              <div className="text-xs text-primary-100">Active Bookings</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-bold">₹{totalSpent.toLocaleString()}</div>
              <div className="text-xs text-primary-100">Total Spent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSearchParams({ tab: t.key });
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium flex-1 justify-center transition-all ${tab === t.key ? 'bg-primary-500 text-white shadow' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Explore', href: '/explore', icon: MapPin, color: 'bg-blue-50 text-blue-600' },
                { label: 'Packages', href: '/packages', icon: Package, color: 'bg-green-50 text-green-600' },
                { label: 'Virtual Tour', href: '/virtual-tours', icon: Camera, color: 'bg-purple-50 text-purple-600' },
                { label: 'Write Review', href: '#', icon: Star, color: 'bg-amber-50 text-amber-600' },
              ].map(a => (
                <Link key={a.label} to={a.href} className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${a.color} hover:opacity-80 transition-opacity`}>
                  <a.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{a.label}</span>
                </Link>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">Recent Bookings</h3>
                <button onClick={() => setTab('bookings')} className="text-sm text-primary-500 flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></button>
              </div>
              {bookings.slice(0, 3).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No bookings yet</p>
                  <Link to="/packages" className="btn-primary text-sm mt-3 inline-flex">Start Exploring</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-lg">
                        {b.type === 'hotel' ? '🏨' : b.type === 'package' ? '🎒' : '🚗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {b.hotel?.name ?? b.package?.name ?? b.transport?.name ?? `${b.type} booking`}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(b.bookingDate).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-gray-900">₹{b.totalAmount.toLocaleString()}</p>
                        <span className={`badge text-xs capitalize ${STATUS_COLORS[b.status] ?? ''}`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rewards Summary */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Award className="w-8 h-8 mb-2 opacity-80" />
                  <h3 className="font-display font-bold text-xl">{totalPoints} Points</h3>
                  <p className="text-primary-100 text-sm">= ₹{(totalPoints / 10).toFixed(0)} discount available</p>
                </div>
                <button onClick={() => setTab('rewards')} className="text-sm bg-white/20 hover:bg-white/30 transition-colors px-3 py-2 rounded-xl flex items-center gap-1">
                  Redeem <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                {[
                  { label: 'Earned', value: rewards.filter(r => r.type === 'earned').reduce((s, r) => s + r.points, 0) },
                  { label: 'Bonus', value: rewards.filter(r => r.type === 'bonus').reduce((s, r) => s + r.points, 0) },
                  { label: 'Redeemed', value: Math.abs(rewards.filter(r => r.type === 'redeemed').reduce((s, r) => s + r.points, 0)) },
                ].map(s => (
                  <div key={s.label} className="bg-white/15 rounded-xl py-2">
                    <div className="font-bold">{s.value}</div>
                    <div className="text-xs text-primary-100">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-display font-bold text-xl mb-5">My Bookings</h3>
            {loadingBookings ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-700">No bookings yet</h4>
                <p className="text-gray-500 text-sm mb-4">Start exploring and book your first trip!</p>
                <Link to="/packages" className="btn-primary text-sm">Browse Packages</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
                        {b.type === 'hotel' ? '🏨' : b.type === 'package' ? '🎒' : '🚗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900 truncate">
                              {b.hotel?.name ?? b.package?.name ?? b.transport?.name ?? `${b.type} Booking`}
                            </p>
                            <p className="text-xs text-gray-500 capitalize mt-0.5">{b.type} · {b.people} guest{b.people > 1 ? 's' : ''}</p>
                          </div>
                          <span className={`badge text-xs capitalize shrink-0 ${STATUS_COLORS[b.status] ?? ''}`}>{b.status}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.bookingDate).toLocaleDateString('en-IN')}</span>
                          {b.checkIn && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Check-in: {new Date(b.checkIn).toLocaleDateString('en-IN')}</span>}
                          {b.checkOut && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Check-out: {new Date(b.checkOut).toLocaleDateString('en-IN')}</span>}
                          <span className="font-semibold text-gray-800">₹{b.totalAmount.toLocaleString()}</span>
                        </div>
                        {b.specialRequests && (
                          <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">Special request: {b.specialRequests}</p>
                        )}
                      </div>
                    </div>
                    {b.status === 'confirmed' && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                        <button onClick={() => cancelBooking(b.id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rewards Tab */}
        {tab === 'rewards' && (
          <div className="space-y-5">
            {/* Points Card */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">{totalPoints} Points</h3>
                  <p className="text-primary-100 text-sm">Worth ₹{(totalPoints / 10).toFixed(0)} in discounts</p>
                </div>
              </div>
              <p className="text-primary-100 text-xs">10 points = ₹1 discount · Minimum 100 points to redeem</p>
            </div>

            {/* Redeem */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-display font-bold text-lg mb-4">Redeem Points</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={redeemPoints}
                  onChange={e => setRedeemPoints(e.target.value)}
                  placeholder="Enter points to redeem (min. 100)"
                  min={100}
                  max={totalPoints}
                  className="input-field flex-1"
                />
                <button onClick={handleRedeem} className="btn-primary whitespace-nowrap">Redeem</button>
              </div>
              {redeemPoints && parseInt(redeemPoints) >= 100 && (
                <p className="text-sm text-forest-600 mt-2 font-medium">
                  = ₹{(parseInt(redeemPoints) / 10).toFixed(0)} discount on your next booking
                </p>
              )}
            </div>

            {/* How to Earn */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h4 className="font-semibold text-amber-900 mb-3">How to Earn Points</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
                {[
                  { emoji: '🎁', pts: '+100', label: 'Welcome Bonus' },
                  { emoji: '📦', pts: '1/₹100', label: 'Each Booking' },
                  { emoji: '✍️', pts: '+50', label: 'Write Review' },
                  { emoji: '👥', pts: '+200', label: 'Refer a Friend' },
                ].map(e => (
                  <div key={e.label} className="bg-white rounded-xl p-3">
                    <div className="text-2xl mb-1">{e.emoji}</div>
                    <div className="font-bold text-primary-600">{e.pts}</div>
                    <div className="text-xs text-gray-500">{e.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-display font-bold text-lg mb-4">Points History</h3>
              {loadingRewards ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
              ) : rewards.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No rewards history yet</p>
              ) : (
                <div className="space-y-2">
                  {rewards.map(r => (
                    <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${r.type === 'redeemed' ? 'bg-red-100' : 'bg-green-100'}`}>
                        {r.type === 'redeemed' ? '↑' : '↓'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{r.description}</p>
                        <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <span className={`font-bold text-sm ${r.points < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {r.points > 0 ? '+' : ''}{r.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-display font-bold text-xl mb-5">Edit Profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input value={user.email} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Language</label>
                <select value={profileForm.language} onChange={e => setProfileForm(f => ({ ...f, language: e.target.value }))} className="input-field">
                  {[
                    { code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'kn', label: 'ಕನ್ನಡ' },
                    { code: 'ta', label: 'தமிழ்' }, { code: 'ml', label: 'മലയാളം' }, { code: 'te', label: 'తెలుగు' },
                  ].map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => { logout(); navigate('/'); }} className="btn-secondary flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
