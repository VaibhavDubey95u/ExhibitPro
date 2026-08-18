import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Calendar } from 'lucide-react';
import { useProjects } from '@hooks/useProjects';
import { ProjectCardSkeleton } from '@components/ui/SkeletonLoader';
import EmptyState from '@components/ui/EmptyState';
import ErrorUI from '@components/ui/ErrorUI';
import { FolderOpen } from 'lucide-react';

function FilterBar({ options, filters, onChange, onReset }) {
  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="card p-4 mb-10">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Event Type */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Event Type</label>
          <select value={filters.eventType || ''} onChange={e => onChange('eventType', e.target.value)}
            className="form-input py-2 text-sm">
            <option value="">All Types</option>
            {options.eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* City */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">City</label>
          <select value={filters.city || ''} onChange={e => onChange('city', e.target.value)}
            className="form-input py-2 text-sm">
            <option value="">All Cities</option>
            {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Year</label>
          <select value={filters.year || ''} onChange={e => onChange('year', e.target.value ? Number(e.target.value) : '')}
            className="form-input py-2 text-sm">
            <option value="">All Years</option>
            {options.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Reset */}
        {hasActive && (
          <button onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const media = (project.project_media || []).sort((a, b) => a.order - b.order);
  const thumb = project.cover_image_url || media.find(m => m.type === 'image')?.url;

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Link to={`/projects/${project.slug}`} className="card group block overflow-hidden hover:scale-[1.02] transition-transform duration-300">
        <div className="relative h-56 bg-gray-100 dark:bg-white/5 overflow-hidden">
          {thumb ? (
            <img src={thumb} alt={project.title} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
              <span className="text-white/20 font-display font-black text-5xl">E</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="tag-badge">{project.event_type}</span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-white text-sm font-semibold">View Project →</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">{project.title}</h3>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.city}</span>
            {project.year && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.year}</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(project.tags || []).slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects() {
  const [filters, setFilters] = useState({});
  const { projects, filterOptions, loading, error, refetch } = useProjects(filters);

  const handleFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value || undefined }));
  const resetFilters = () => setFilters({});

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-transparent to-transparent" />
        <div className="section-container relative z-10 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-500/20 text-brand-300 mb-4">
            Our Work
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            Project Portfolio
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto">
            Browse our completed exhibitions, conferences and activations across the UAE and beyond.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          {/* Filter bar */}
          {!loading && (filterOptions.eventTypes.length > 0 || filterOptions.cities.length > 0) && (
            <FilterBar options={filterOptions} filters={filters} onChange={handleFilter} onReset={resetFilters} />
          )}

          {/* Results count */}
          {!loading && projects.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <ProjectCardSkeleton key={i} />)}
            </div>
          )}

          {/* Error */}
          {error && <ErrorUI message={error} onRetry={refetch} />}

          {/* Empty */}
          {!loading && !error && projects.length === 0 && (
            <EmptyState
              icon={FolderOpen}
              title="No projects found"
              description="Try adjusting your filters or check back later for new projects."
              action={
                Object.keys(filters).length > 0
                  ? <button onClick={resetFilters} className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold">Clear Filters</button>
                  : null
              }
            />
          )}

          {/* Grid */}
          {!loading && !error && projects.length > 0 && (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
