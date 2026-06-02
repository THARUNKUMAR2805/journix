import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-white font-display font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              JourniX
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your all-in-one local travel platform. Explore India affordably with authentic experiences, local cuisines, and budget-friendly packages.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Destinations', '/explore'],
                ['Hotels & Hostels', '/hotels'],
                ['Local Cuisine', '/cuisine'],
                ['Transport', '/transport'],
                ['Travel Packages', '/packages'],
                ['Virtual Tours', '/virtual-tours'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['About Us', '#'],
                ['Our Story', '#'],
                ['Careers', '#'],
                ['Press', '#'],
                ['Partner With Us', '#'],
                ['Become a Guide', '#'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-primary-400 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>Tharun Kumar, JourniX HQ, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="mailto:tharundondapati982@gmail.com" className="hover:text-primary-400 transition-colors">tharundondapati982@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="tel:+916305302510" className="hover:text-primary-400 transition-colors">+91 63053 02510</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500" autoComplete="off" />
                <button className="px-3 py-2 bg-primary-500 rounded-lg text-sm font-medium text-white hover:bg-primary-600 transition-colors">Go</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 JourniX by Tharun Kumar. All rights reserved. Made with ❤️ in India.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
