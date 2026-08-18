import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useContent } from '@hooks/useContent';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import ErrorUI from '@components/ui/ErrorUI';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Services() {
  const { getBlock, loading, error, refetch } = useContent('services');

  if (loading) return <div className="pt-32 section-container"><BlockSkeleton lines={6} /></div>;
  if (error)   return <ErrorUI message={error} onRetry={refetch} />;

  const hero     = getBlock('hero')?.data          || {};
  const { services = [] } = getBlock('services_list')?.data || {};

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-dark-900 overflow-hidden">
        {hero.image_url && (
          <div className="absolute inset-0 z-0">
            <img src={hero.image_url} alt="Services Hero" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-dark-900/50" />
          </div>
        )}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-transparent to-transparent" />
        <div className="section-container relative z-10 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-500/20 text-brand-300 mb-4">
            What We Offer
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            {hero.heading || 'Our Services'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto">
            {hero.subheading}
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="space-y-16">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Text */}
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 mb-4">
                    <span className="font-display font-black text-brand-500 text-sm">0{i + 1}</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">{svc.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{svc.desc}</p>
                  {svc.features?.length > 0 && (
                    <ul className="space-y-2 mb-8">
                      {svc.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all shadow-glow">
                    Enquire Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Image */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  {svc.image_url ? (
                    <img src={svc.image_url} alt={svc.title} className="rounded-3xl w-full h-80 object-cover shadow-xl" loading="lazy" />
                  ) : (
                    <div className="rounded-3xl w-full h-80 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-950 border border-brand-100 dark:border-brand-800 flex items-center justify-center">
                      <span className="font-display font-black text-brand-200 dark:text-brand-800 text-7xl">0{i+1}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50 dark:bg-dark-850">
        <div className="section-container text-center">
          <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-4">Need a custom solution?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">We tailor every project to your specific requirements and budget.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow transition-all hover:scale-105">
            Discuss Your Project <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
