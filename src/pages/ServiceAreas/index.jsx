import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';
import { useServiceAreas } from '@hooks/useServiceAreas';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import EmptyState from '@components/ui/EmptyState';
import ErrorUI from '@components/ui/ErrorUI';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

export default function ServiceAreas() {
  const { areas, loading, error } = useServiceAreas();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-transparent to-transparent" />
        <div className="section-container relative z-10 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-500/20 text-brand-300 mb-4">
            Coverage
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            Where We Operate
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto">
            From Dubai to international venues — we bring exhibitions to life wherever you need us.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card p-6"><BlockSkeleton lines={3} /></div>
              ))}
            </div>
          )}

          {error && <ErrorUI message={error} />}

          {!loading && !error && areas.length === 0 && (
            <EmptyState icon={Globe} title="Service areas coming soon" description="We are updating our coverage information. Please check back shortly." />
          )}

          {!loading && !error && areas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area, i) => (
                <motion.div
                  key={area.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="card group overflow-hidden hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-300"
                >
                  {area.image_url ? (
                    <div className="h-44 overflow-hidden relative">
                      <img src={area.image_url} alt={area.city} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Hide the broken image and show fallback
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-brand-50', 'to-brand-100', 'dark:from-brand-900/40', 'dark:to-brand-950', 'flex', 'items-center', 'justify-center');
                          const fallback = document.createElement('div');
                          fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand-300"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
                          e.target.parentElement.appendChild(fallback.firstChild);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-950 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-brand-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-brand-500" />
                      <h3 className="font-display font-bold text-gray-900 dark:text-white">{area.city}</h3>
                      {area.country && <span className="text-xs text-gray-400">· {area.country}</span>}
                    </div>
                    {area.description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{area.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
