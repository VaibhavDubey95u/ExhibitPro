import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, Image, Video, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import EmptyState from '@components/ui/EmptyState';
import {
  getAllProjects, upsertProject, deleteProject, toggleProjectPublish,
  uploadProjectMedia, deleteProjectMedia
} from '@services/projectsApi';

const EVENT_TYPES = ['Exhibition', 'Conference', 'Mall Activation', 'Outdoor', 'Custom Booth'];

const DEFAULT_FORM = {
  title: '', slug: '', event_type: 'Exhibition', city: '', country: 'UAE',
  year: new Date().getFullYear(), booth_size: '', description: '',
  cover_image_url: '', tags: '', services: '', is_published: false,
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [mediaProject, setMediaProject] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setProjects(await getAllProjects()); }
    catch (e) { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(DEFAULT_FORM); setEditing(null); setFormOpen(true); };
  const openEdit = (p) => {
    setForm({ ...DEFAULT_FORM, ...p, tags: (p.tags || []).join(', '), services: (p.services || []).join(', ') });
    setEditing(p);
    setFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'title' && !editing) setForm(f => ({ ...f, slug: slugify(value) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error('Title and slug are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: slugify(form.slug),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        services: form.services ? form.services.split(',').map(s => s.trim()).filter(Boolean) : [],
        year: Number(form.year),
        id: editing?.id,
      };
      await upsertProject(payload);
      toast.success(editing ? 'Project updated!' : 'Project created!');
      setFormOpen(false);
      load();
    } catch (e) { toast.error('Save failed: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its media? This cannot be undone.')) return;
    try { await deleteProject(id); toast.success('Deleted.'); load(); }
    catch (e) { toast.error('Delete failed: ' + e.message); }
  };

  const handleTogglePublish = async (id, current) => {
    try { await toggleProjectPublish(id, !current); load(); }
    catch (e) { toast.error('Failed to update publish state.'); }
  };

  const handleUploadMedia = async (e, type) => {
    if (!mediaProject) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadProjectMedia(mediaProject.id, file, type);
      toast.success('Media uploaded!');
      load();
    } catch (e) { toast.error('Upload failed: ' + e.message); }
    finally { setUploading(false); }
  };

  const handleUploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // We upload it to project-media bucket but just save the URL to form state
    // We need a temporary ID if editing is not set yet, or we can just use a generic 'covers' folder
    const pathId = editing ? editing.id : 'temp-' + Date.now();
    const ext = file.name.split('.').pop();
    const path = `covers/${pathId}/${Date.now()}.${ext}`;
    
    setUploading(true);
    try {
      const { supabase } = await import('@services/supabaseClient');
      const { error: uploadErr } = await supabase.storage
        .from('project-media')
        .upload(path, file, { upsert: false });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('project-media').getPublicUrl(path);
      setForm(f => ({ ...f, cover_image_url: urlData.publicUrl }));
      toast.success('Cover image uploaded!');
    } catch (e) {
      toast.error('Cover upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    try { await deleteProjectMedia(mediaId); toast.success('Media removed.'); load(); }
    catch (e) { toast.error('Failed to remove media.'); }
  };

  return (
    <AdminLayout title="Projects Manager" subtitle="Create, edit, publish and manage project media.">
      <div className="flex justify-end mb-6">
        <Button onClick={openNew}><Plus className="w-4 h-4" /> New Project</Button>
      </div>

      {loading && <BlockSkeleton lines={4} />}

      {!loading && projects.length === 0 && (
        <EmptyState title="No projects yet" description="Create your first project to get started." action={<Button onClick={openNew}><Plus className="w-4 h-4" /> New Project</Button>} />
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              {p.cover_image_url || (p.project_media && p.project_media.find(m => m.type === 'image')?.url) ? (
                <img 
                  src={p.cover_image_url || p.project_media.find(m => m.type === 'image')?.url} 
                  alt={p.title} 
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                  }} 
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <Image className="w-6 h-6 text-brand-400" />
                </div>
              )}
              {/* Fallback element shown by onError if the image URL is broken */}
              <div style={{ display: 'none' }} className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-900/30 items-center justify-center flex-shrink-0">
                <Image className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.title}</h3>
                <p className="text-xs text-gray-500">{p.event_type} · {p.city} · {p.year}</p>
                <div className="flex gap-1.5 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_published ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500">
                    {(p.project_media || []).length} media
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleTogglePublish(p.id, p.is_published)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-green-500 transition-colors" title={p.is_published ? 'Unpublish' : 'Publish'}>
                  {p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => setMediaProject(p)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-brand-500 transition-colors" title="Manage Media">
                  <Upload className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(p)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-brand-500 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit Project' : 'New Project'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="Project title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="form-input" placeholder="url-friendly-slug" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
              <select name="event_type" value={form.event_type} onChange={handleChange} className="form-input">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} className="form-input" placeholder="Dubai" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booth Size</label>
              <input name="booth_size" value={form.booth_size} onChange={handleChange} className="form-input" placeholder="e.g. 6x6m" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="Exhibition, Custom, Outdoor" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services Provided (comma separated)</label>
            <input name="services" value={form.services} onChange={handleChange} className="form-input" placeholder="Design, Fabrication, Logistics" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
            <div className="flex gap-2">
              <input name="cover_image_url" value={form.cover_image_url} onChange={handleChange} className="form-input flex-1" placeholder="https://..." />
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold cursor-pointer hover:bg-brand-100 transition-colors">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{uploading ? '...' : 'Upload'}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={handleUploadCover} disabled={uploading} />
              </label>
            </div>
            {form.cover_image_url && (
              <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 relative group bg-gray-100 dark:bg-white/5">
                <img 
                  src={form.cover_image_url} 
                  alt="Cover Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, cover_image_url: '' }))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="form-input resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_published" id="is_published" checked={form.is_published} onChange={handleChange}
              className="w-4 h-4 rounded accent-brand-500" />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish immediately</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Media Manager Modal */}
      <Modal isOpen={!!mediaProject} onClose={() => setMediaProject(null)} title={`Media — ${mediaProject?.title}`} size="xl">
        {mediaProject && (
          <div className="space-y-5">
            {/* Upload buttons */}
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold cursor-pointer hover:bg-brand-100 transition-colors">
                <Image className="w-4 h-4" /> Upload Image
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={e => handleUploadMedia(e, 'image')} disabled={uploading} />
              </label>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors">
                <Video className="w-4 h-4" /> Upload Video
                <input type="file" accept="video/mp4,video/webm" className="hidden"
                  onChange={e => handleUploadMedia(e, 'video')} disabled={uploading} />
              </label>
              {uploading && <span className="text-sm text-gray-500 self-center">Uploading...</span>}
            </div>

            {/* Media grid */}
            {(projects.find(p => p.id === mediaProject.id)?.project_media || []).length === 0 ? (
              <p className="text-gray-500 text-sm">No media uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {(projects.find(p => p.id === mediaProject.id)?.project_media || [])
                  .sort((a, b) => a.order - b.order)
                  .map(m => (
                    <div key={m.id} className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 aspect-square">
                      {m.type === 'image' ? (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <button onClick={() => handleDeleteMedia(m.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">{m.type}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
