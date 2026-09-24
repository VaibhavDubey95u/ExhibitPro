import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useContent } from '@hooks/useContent';
import { useProjects } from '@hooks/useProjects';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import ErrorUI from '@components/ui/ErrorUI';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

function SectionHeading({ label, title, subtitle, light = false }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 ${light ? 'bg-brand-500/20 text-brand-300' : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'}`}>
        {label}
      </span>
      <h2 className={`font-display font-bold text-3xl md:text-4xl mb-4 ${light ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        {title}
      </h2>
      {subtitle && <p className={`leading-relaxed ${light ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{subtitle}</p>}
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────
function HeroSection({ data }) {
  const bgStyle = data.background_url
    ? { backgroundImage: `url(${data.background_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={bgStyle}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950/90 via-dark-900/80 to-brand-900/40" />

      {/* Animated background shapes */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-brand-500 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-brand-700 blur-3xl"
      />

      <div className="relative z-10 section-container text-center py-32 pt-40">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-white/80 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          India's Premier Exhibition Stand Specialists
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 text-balance"
        >
          {data.title || 'We Build Exhibition Stands'}
          <br />
          <span className="gradient-text">That Win Attention</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {data.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to={data.cta_primary_link || '/projects'}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-glow transition-all hover:scale-105"
          >
            {data.cta_primary || 'View Our Projects'}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={data.cta_secondary_link || '/contact'}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl glass text-white font-bold text-base hover:bg-white/20 transition-all"
          >
            {data.cta_secondary || 'Get a Quote'}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}

// ─── STATS ──────────────────────────────────────────
function StatsSection({ data }) {
  return (
    <section className="section-padding bg-gray-50 dark:bg-dark-850">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.items || []).map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="card p-6 text-center"
            >
              <div className="font-display font-black text-4xl md:text-5xl gradient-text mb-2">{item.value}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ──────────────────────────────────────────
function ServicesSection({ data }) {
  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeading label="Services" title={data.heading} subtitle={data.subheading} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.services || []).map((svc, i) => {
            const Icon = LucideIcons[svc.icon] || LucideIcons.Star;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="card p-6 group hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4 group-hover:bg-brand-500 transition-colors">
                  <Icon className="w-6 h-6 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">{svc.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-brand-500 font-semibold hover:gap-3 transition-all">
            View All Services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── WHY CHOOSE US ──────────────────────────────────────────
function WhyUsSection({ data, companyName, projectsStat = '200+' }) {
  return (
    <section className="section-padding bg-gray-50 dark:bg-dark-850">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
              Why Choose Us
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">{data.heading}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{data.subheading}</p>
            <ul className="space-y-4">
              {(data.points || []).map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <CheckCircle className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{point.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{point.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Link to="/about" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all shadow-glow hover:scale-105">
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {data.image_url ? (
              <img src={data.image_url} alt="Why choose us" className="rounded-3xl w-full object-cover h-[450px] shadow-2xl" loading="lazy" />
            ) : (
              <div className="rounded-3xl w-full h-[450px] bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
                <span className="font-display font-black text-white text-6xl opacity-20">{(companyName || 'E').charAt(0).toUpperCase()}</span>
              </div>
            )}
            {/* Badge */}
            <div className="absolute -bottom-6 -left-6 card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">{projectsStat} Projects</div>
                <div className="text-gray-500 text-xs">Successfully Delivered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────
function ProcessSection({ data }) {
  return (
    <section className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-transparent to-transparent" />
      <div className="section-container relative z-10">
        <SectionHeading label="Process" title={data.heading} subtitle={data.subheading} light />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.steps || []).map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="relative"
            >
              <div className="glass-dark rounded-2xl p-6 h-full">
                <div className="font-display font-black text-5xl text-brand-500/20 mb-4">{step.step}</div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < (data.steps.length - 1) && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-brand-500/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED PROJECTS ──────────────────────────────────────────
function FeaturedProjects({ companyName }) {
  const { projects, loading } = useProjects({});
  const featured = projects.slice(0, 6);

  if (loading) return (
    <section className="section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 animate-pulse bg-gray-100 dark:bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    </section>
  );

  if (!featured.length) return null;

  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeading label="Portfolio" title="Featured Projects" subtitle="A glimpse of our work across exhibitions, conferences, and activations." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Link to={`/projects/${project.slug}`} className="card group block overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div className="relative h-52 bg-gray-100 dark:bg-white/5 overflow-hidden">
                  {project.cover_image_url || (project.project_media && project.project_media.length > 0) ? (
                    <img src={project.cover_image_url || project.project_media[0].url} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
                      <span className="text-white/30 font-display font-black text-4xl">{(companyName || 'E').charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className="tag-badge">{project.event_type}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.city}, {project.year}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-brand-500 text-brand-500 font-bold hover:bg-brand-500 hover:text-white transition-all">
            View All Projects <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ──────────────────────────────────────────
function CTABanner({ data }) {
  return (
    <section className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-brand-500 to-brand-700 p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
          <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4 relative z-10">{data.heading}</h2>
          <p className="text-white/80 text-lg mb-8 relative z-10">{data.subheading}</p>
          <Link
            to={data.cta_link || '/contact'}
            className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-600 font-bold hover:bg-brand-50 transition-colors shadow-lg hover:scale-105 duration-200"
          >
            {data.cta_text || 'Discuss Your Project'} <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ──────────────────────────────────────────
export default function Home() {
  const { blocks, loading: homeLoading, error: homeError, getBlock, refetch: refetchHome } = useContent('home');
  const { getBlock: getFooterBlock, loading: footerLoading, error: footerError, refetch: refetchFooter } = useContent('footer');

  const loading = homeLoading || footerLoading;
  const error = homeError || footerError;

  const refetch = () => {
    refetchHome();
    refetchFooter();
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="w-64"><BlockSkeleton lines={4} /></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorUI message={error} onRetry={refetch} />
    </div>
  );

  const hero     = getBlock('hero')?.data || {};
  const stats    = getBlock('stats')?.data || {};
  const services = getBlock('services_overview')?.data || {};
  const whyUs    = getBlock('why_choose_us')?.data || {};
  const process  = getBlock('process')?.data || {};
  const cta      = getBlock('cta_banner')?.data || {};
  
  const companyName = getFooterBlock('main')?.data?.company_name || 'ExhibitPro';
  const projectsStat = (stats.items || []).find(item => item.label?.toLowerCase().includes('project'))?.value || '200+';

  return (
    <>
      <HeroSection data={hero} />
      <StatsSection data={stats} />
      <ServicesSection data={services} />
      <WhyUsSection data={whyUs} companyName={companyName} projectsStat={projectsStat} />
      <ProcessSection data={process} />
      <FeaturedProjects companyName={companyName} />
      <CTABanner data={cta} />
    </>
  );
}
