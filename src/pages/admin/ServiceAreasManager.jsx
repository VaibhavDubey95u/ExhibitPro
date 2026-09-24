import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import EmptyState from '@components/ui/EmptyState';
import { getAllServiceAreas, upsertServiceArea, deleteServiceArea } from '@services/serviceAreasApi';
import { Globe } from 'lucide-react';

const DEFAULT = { city: '', country: 'UAE', description: '', image_url: '', is_active: true, order: 0 };

export default function ServiceAreasManager() {
  const [areas, setAreas]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState(DEFAULT);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const path = `service-areas/${Date.now()}.${ext}`;
    setUploading(true);
    try {
      const { supabase } = await import('@services/supabaseClient');
      const { error: uploadErr } = await supabase.storage
        .from('project-media')
        .upload(path, file, { upsert: false });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from('project-media').getPublicUrl(path);
      setForm(f => ({ ...f, image_url: urlData.publicUrl }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    try { setAreas(await getAllServiceAreas()); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(DEFAULT); setEditing(null); setOpen(true); };
  const openEdit = (a) => { setForm(a); setEditing(a); setOpen(true); };

  const handleSave = async () => {
    if (!form.city) { toast.error('City is required.'); return; }
    setSaving(true);
    try {
      await upsertServiceArea({ ...form, id: editing?.id });
      toast.success('Saved!'); setOpen(false); load();
    } catch (e) { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service area?')) return;
    try { await deleteServiceArea(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  return (
    <AdminLayout title="Service Areas" subtitle="Manage cities and regions where you operate.">
      <div className="flex justify-end mb-6">
        <Button onClick={openNew}><Plus className="w-4 h-4" /> Add Area</Button>
      </div>
      {!loading && areas.length === 0 && <EmptyState icon={Globe} title="No service areas" action={<Button onClick={openNew}><Plus className="w-4 h-4" /> Add Area</Button>} />}
      <div className="space-y-3">
        {areas.map(a => (
          <div key={a.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white">{a.city}</h3>
              <p className="text-xs text-gray-500">{a.country} · {a.is_active ? '✅ Active' : '⛔ Hidden'}</p>
              {a.description && <p className="text-sm text-gray-500 mt-1 truncate">{a.description}</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-brand-500 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit Area' : 'New Area'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
              <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} className="form-input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="form-input resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} className="form-input flex-1" placeholder="https://..." />
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold cursor-pointer hover:bg-brand-100 transition-colors">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{uploading ? '...' : 'Upload'}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={handleUploadImage} disabled={uploading} />
              </label>
            </div>
            {form.image_url && (
              <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 relative group">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f => ({...f, is_active: e.target.checked}))} className="w-4 h-4 accent-brand-500" />
            <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">Active (visible on website)</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
