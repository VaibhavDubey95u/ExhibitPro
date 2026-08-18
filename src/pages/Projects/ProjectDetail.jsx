import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowLeft, MapPin, Calendar, Maximize2, Tag, Wrench, ArrowRight, Play } from 'lucide-react';
import { getProjectBySlug } from '@services/projectsApi';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import ErrorUI from '@components/ui/ErrorUI';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    getProjectBySlug(slug)
      .then(setProject)
      .catch(() => setError('Project not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-32 section-container max-w-4xl">
      <BlockSkeleton lines={8} />
    </div>
  );

  if (error || !project) return (
    <div className="pt-32 section-container flex items-center justify-center">
      <ErrorUI title="Project Not Found" message="This project may have been removed or the link is incorrect." />
    </div>
  );

  const media = (project.project_media || []).sort((a, b) => a.order - b.order);
  const images = media.filter(m => m.type === 'image');
  const video  = media.find(m => m.type === 'video');

  return (
    <>
      {/* Back */}
      <div className="pt-28 pb-4">
        <div className="section-container">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </button>
        </div>
      </div>

      <section className="section-padding pt-0">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Gallery — 2/3 */}
            <div className="lg:col-span-2">
              {/* Main swiper */}
              {images.length > 0 ? (
                <>
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation
                    pagination={{ clickable: true }}
                    className="rounded-2xl overflow-hidden mb-3"
                    style={{ height: '420px' }}
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={img.id}>
                        <div className="relative h-full cursor-zoom-in" onClick={() => { setLightboxIdx(i); setLightboxOpen(true); }}>
                          <img src={img.url} alt={`${project.title} ${i+1}`} loading="lazy"
                            className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 text-white">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Thumbs */}
                  {images.length > 1 && (
                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={8}
                      slidesPerView={Math.min(images.length, 5)}
                      watchSlidesProgress
                      className="rounded-xl overflow-hidden"
                      style={{ height: '72px' }}
                    >
                      {images.map((img, i) => (
                        <SwiperSlide key={img.id} className="cursor-pointer rounded-xl overflow-hidden opacity-50 [&.swiper-slide-thumb-active]:opacity-100 transition-opacity">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </>
              ) : (
                <div className="rounded-2xl h-80 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-950 flex items-center justify-center">
                  <span className="text-brand-300 font-display font-black text-6xl">E</span>
                </div>
              )}

              {/* Video */}
              {video && (
                <div className="mt-6">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Play className="w-5 h-5 text-brand-500" /> Project Video
                  </h3>
                  <div className="rounded-2xl overflow-hidden bg-black aspect-video">
                    <video src={video.url} controls className="w-full h-full" poster={project.cover_image_url} />
                  </div>
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div className="mt-8">
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">About This Project</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar — 1/3 */}
            <div className="space-y-6">
              {/* Info card */}
              <div className="card p-6">
                <div className="mb-1">
                  <span className="tag-badge">{project.event_type}</span>
                </div>
                <h1 className="font-display font-black text-2xl text-gray-900 dark:text-white mt-3 mb-4">{project.title}</h1>
                <dl className="space-y-3">
                  {project.city && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <div>
                        <dt className="text-gray-400 text-xs">Location</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">{project.city}, {project.country}</dd>
                      </div>
                    </div>
                  )}
                  {project.year && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <div>
                        <dt className="text-gray-400 text-xs">Year</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">{project.year}</dd>
                      </div>
                    </div>
                  )}
                  {project.booth_size && (
                    <div className="flex items-center gap-3 text-sm">
                      <Maximize2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <div>
                        <dt className="text-gray-400 text-xs">Booth Size</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">{project.booth_size}</dd>
                      </div>
                    </div>
                  )}
                </dl>

                {/* Services */}
                {(project.services || []).length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      <Wrench className="w-3.5 h-3.5" /> Services Provided
                    </div>
                    <ul className="space-y-1.5">
                      {project.services.map(s => (
                        <li key={s} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {(project.tags || []).length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      <Tag className="w-3.5 h-3.5" /> Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs text-gray-600 dark:text-gray-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="card p-6 bg-gradient-to-br from-brand-500 to-brand-700 border-0">
                <h3 className="font-display font-bold text-white text-lg mb-2">Like what you see?</h3>
                <p className="text-brand-100 text-sm mb-5">Request a similar stand for your next exhibition.</p>
                <Link to={`/contact?ref=${project.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-brand-600 font-bold text-sm hover:bg-brand-50 transition-colors">
                  Request Similar Stand <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white text-sm">✕ Close</button>
          <img src={images[lightboxIdx]?.url} alt="" className="max-h-[90vh] max-w-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
