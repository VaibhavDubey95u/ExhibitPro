import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Phone, Mail, MapPin, Globe, ArrowUpRight } from 'lucide-react';
import { useContent } from '@hooks/useContent';
import Modal from '@components/ui/Modal';

// Inline social SVGs (lucide-react doesn't include brand icons)
const SocialIcons = {
  Instagram: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  LinkedIn:  () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  Facebook:  () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  Twitter:   () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.254 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Youtube:   () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  Whatsapp:  () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

const SOCIAL_ICONS = { ...SocialIcons, Website: Globe };

const quickLinks = [
  { label: 'Home',          to: '/' },
  { label: 'About',         to: '/about' },
  { label: 'Services',      to: '/services' },
  { label: 'Projects',      to: '/projects' },
  { label: 'Service Areas', to: '/service-areas' },
  { label: 'Contact',       to: '/contact' },
];

export default function Footer() {
  const { getBlock, loading } = useContent('footer');
  const footerData = getBlock('main')?.data || {};
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const {
    company_name = 'ExhibitPro',
    tagline = 'Premium Exhibition Stand Design & Build',
    description = 'End-to-end exhibition stand specialists serving the UAE and international markets.',
    address = 'Dubai, UAE',
    phone = '+971 50 000 0000',
    email = 'info@exhibitpro.ae',
    socials = [],
    privacy_policy = '',
    terms = '',
  } = footerData;

  return (
    <footer className="bg-dark-950 text-gray-300">
      {/* Top CTA bar */}
      <div className="bg-brand-600">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-semibold text-white text-lg">Ready to make your next exhibition unforgettable?</p>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors"
          >
            Discuss Your Project <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white font-display font-black text-lg">{(company_name || 'E').charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                {company_name}
              </span>
            </Link>
            <p className="text-brand-400 text-sm font-medium mb-3">{tagline}</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">{description}</p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform] || Globe;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-brand-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    aria-label={s.platform}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-brand-400 text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-3 text-sm text-gray-400 hover:text-brand-400 transition-colors group">
                  <Phone className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-sm text-gray-400 hover:text-brand-400 transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  {email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
                  {address}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {company_name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-brand-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setTermsOpen(true)} className="hover:text-brand-400 transition-colors">
              Terms of Use
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{privacy_policy}</p>
      </Modal>
      <Modal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Use">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{terms}</p>
      </Modal>
    </footer>
  );
}
