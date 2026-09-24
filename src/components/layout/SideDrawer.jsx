import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, Moon, Sun, Settings } from 'lucide-react';
import { useContent } from '@hooks/useContent';
import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@context/AuthContext';

export default function SideDrawer({ isOpen, onClose, navLinks }) {
  const location = useLocation();
  const { getBlock } = useContent('footer');
  const footerData = getBlock('main')?.data || {};
  const companyName = footerData.company_name || 'ExhibitPro';
  const { isDark, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-dark-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
              <Link to="/" onClick={onClose} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <span className="text-white font-display font-black text-base">{(companyName || 'E').charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  {companyName.replace(/Pro$/i, '')}
                  {companyName.toLowerCase().endsWith('pro') && <span className="text-brand-500">Pro</span>}
                </span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Navigation</p>
              <ul className="space-y-1">
                {navLinks.map(({ label, to }, i) => (
                  <motion.li
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      to={to}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(to)
                          ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-brand-500'
                      }`}
                    >
                      {isActive(to) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      )}
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Preferences */}
              <div className="mt-8 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Settings</p>
                <div className="flex items-center gap-3">
                  <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="text-sm">{isDark ? 'Light' : 'Dark'}</span>
                  </button>
                  <Link to={isAdmin ? '/admin/dashboard' : '/admin/login'} onClick={onClose} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Admin</span>
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 space-y-3">
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all shadow-glow"
                >
                  Discuss Your Project
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-white/10">
              <div className="space-y-3">
                {footerData.phone && (
                  <a href={`tel:${footerData.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                    <Phone className="w-4 h-4 text-brand-500" />
                    {footerData.phone}
                  </a>
                )}
                {footerData.email && (
                  <a href={`mailto:${footerData.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                    <Mail className="w-4 h-4 text-brand-500" />
                    {footerData.email}
                  </a>
                )}
                {footerData.whatsapp && (
                  <a
                    href={`https://wa.me/${footerData.whatsapp.replace(/[^0-9]/g,'')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-green-600 hover:text-green-500 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
