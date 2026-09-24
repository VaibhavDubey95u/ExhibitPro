import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, Settings, MessageCircle } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@context/AuthContext';
import { useContent } from '@hooks/useContent';
import SideDrawer from './SideDrawer';

const navLinks = [
  { label: 'Home',          to: '/' },
  { label: 'About',         to: '/about' },
  { label: 'Services',      to: '/services' },
  { label: 'Projects',      to: '/projects' },
  { label: 'Service Areas', to: '/service-areas' },
  { label: 'Contact',       to: '/contact' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const { getBlock } = useContent('footer');
  const companyName = getBlock('main')?.data?.company_name || 'ExhibitPro';
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow"
              >
                <span className="text-white font-display font-black text-lg">{(companyName || 'E').charAt(0).toUpperCase()}</span>
              </motion.div>
              <span className={`font-display font-bold text-xl transition-colors ${scrolled || isDark ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                {companyName.replace(/Pro$/i, '')}
                {companyName.toLowerCase().endsWith('pro') && <span className="text-brand-500">Pro</span>}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/30'
                      : scrolled || isDark
                        ? 'text-gray-700 dark:text-gray-300 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-white/5'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`hidden lg:flex p-2 rounded-xl transition-colors ${
                  scrolled || isDark
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Admin icon */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/admin/login')}
                className={`hidden lg:flex p-2 rounded-xl transition-colors ${
                  scrolled || isDark
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                aria-label="Admin panel"
              >
                <Settings className="w-5 h-5" />
              </motion.button>

              {/* Get Quote — desktop */}
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-glow transition-all"
              >
                Get a Quote
              </motion.a>

              {/* Hamburger — mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDrawerOpen(true)}
                className={`p-2 rounded-xl lg:hidden transition-colors ${
                  scrolled || isDark
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} navLinks={navLinks} />
    </>
  );
}
