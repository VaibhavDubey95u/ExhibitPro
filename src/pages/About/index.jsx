import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useContent } from '@hooks/useContent';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import ErrorUI from '@components/ui/ErrorUI';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

export default function About() {
  const { getBlock, loading, error, refetch } = useContent('about');

  if (loading) return (
    <div className="pt-32 section-container">
      <div className="max-w-2xl mx-auto space-y-4"><BlockSkeleton lines={6} /></div>
    </div>
  );
  if (error) return <ErrorUI message={error} onRetry={refetch} />;

  const hero   = getBlock('hero')?.data   || {};
  const story  = getBlock('story')?.data  || {};
  const values = getBlock('values')?.data || {};

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-transparent to-transparent" />
        <div className="section-container relative z-10 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-500/20 text-brand-300 mb-4">
            About Us
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            {hero.heading || 'About ExhibitPro'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto">
            {hero.subheading}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="accent-line" />
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-6">{story.heading}</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">{story.body}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all shadow-glow">
                Work With Us <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {story.image_url ? (
                <img src={story.image_url} alt="Our story" className="rounded-3xl w-full h-[450px] object-cover shadow-2xl" loading="lazy" />
              ) : (
                <div className="rounded-3xl w-full h-[450px] bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-950 flex items-center justify-center">
                  <span className="font-display font-black text-brand-300 text-8xl">10+</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50 dark:bg-dark-850">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="accent-line mx-auto" />
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">{values.heading || 'Our Values'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(values.values || []).map((v, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="card p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="section-container text-center">
          <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-4">Ready to build something extraordinary?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Let's discuss your next exhibition stand.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow transition-all hover:scale-105">
            Get In Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
