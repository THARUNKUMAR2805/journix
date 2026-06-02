import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, ChevronDown, Award, LogOut, User, LayoutDashboard, Globe, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../utils/i18n';

const NAV_LINKS = [
  { key: 'explore', href: '/explore', label: 'Explore', icon: '🗺️' },
  { key: 'hotels', href: '/hotels', label: 'Hotels', icon: '🏨' },
  { key: 'cuisine', href: '/cuisine', label: 'Cuisine', icon: '🍛' },
  { key: 'transport', href: '/transport', label: 'Transport', icon: '🚗' },
  { key: 'packages', href: '/packages', label: 'Packages', icon: '🎒' },
  { key: 'virtualTour', href: '/virtual-tours', label: 'Virtual Tour', icon: '🎥' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  const navBg = transparent
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100/80';
  const textColor = transparent ? 'text-white' : 'text-gray-700';
  const logoColor = transparent ? 'text-white' : 'text-gray-900';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2.5 font-display font-bold text-xl ${logoColor} group`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${transparent ? 'bg-primary-500' : 'bg-primary-500'} group-hover:scale-105`}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span>JourniX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.key}
                  to={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active
                      ? transparent ? 'text-white bg-white/15' : 'text-primary-600 bg-primary-50'
                      : transparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t(link.key)}
                  {active && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${transparent ? 'bg-primary-300' : 'bg-primary-500'}`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => { setLangMenuOpen(!langMenuOpen); setUserMenuOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden xl:inline">{LANGUAGES.find(l => l.code === language)?.native}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors ${language === lang.code ? 'text-primary-500 font-semibold bg-primary-50' : 'text-gray-700'}`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-xs text-gray-400">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setLangMenuOpen(false); }}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all ${transparent ? 'bg-white/15 border border-white/20 text-white hover:bg-white/25' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'}`}
                >
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  <div className="flex items-center gap-1 bg-white/20 rounded-md px-1.5 py-0.5 text-xs">
                    <Award className="w-3 h-3" />
                    {user.loyaltyPoints}
                  </div>
                  <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-primary-600 font-medium">
                          <Award className="w-3 h-3" /> {user.loyaltyPoints} loyalty points
                        </div>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" /> {t('dashboard')}
                      </Link>
                      <Link to="/dashboard#profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4 text-gray-400" /> Profile
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> {t('logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${transparent ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                  {t('login')}
                </Link>
                <Link to="/register"
                  className="px-5 py-2 text-sm font-semibold bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-md hover:shadow-lg active:scale-95">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.key}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span>{link.icon}</span>
                    {t(link.key)}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-primary-600">{user.loyaltyPoints} points</p>
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 text-red-500 border border-red-100 rounded-xl font-medium text-sm hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-primary-500 text-white rounded-xl font-medium text-sm hover:bg-primary-600">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close dropdowns on outside click */}
      {(userMenuOpen || langMenuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserMenuOpen(false); setLangMenuOpen(false); }} />
      )}
    </nav>
  );
}

