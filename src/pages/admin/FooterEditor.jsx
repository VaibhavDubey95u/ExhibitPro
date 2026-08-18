import { useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useContent } from '@hooks/useContent';
import { upsertBlock } from '@services/contentApi';
import Button from '@components/ui/Button';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';

export default function FooterEditor() {
  const { blocks, loading, refetch } = useContent('footer', true);
  const footerBlock = blocks.find(b => b.block === 'main');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  // Initialise form from block data once loaded
  if (!loading && footerBlock && form === null) {
    setForm(footerBlock.data);
  }

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const handleSocialChange = (i, field, value) => setForm(f => {
    const socials = [...(f.socials || [])];
    socials[i] = { ...socials[i], [field]: value };
    return { ...f, socials };
  });
  const addSocial    = () => setForm(f => ({ ...f, socials: [...(f.socials || []), { platform: '', icon: '', url: '' }] }));
  const removeSocial = (i) => setForm(f => { const s = [...(f.socials || [])]; s.splice(i,1); return {...f, socials:s}; });

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await upsertBlock({ page: 'footer', block: 'main', data: form, order: 1, is_visible: true });
      toast.success('Footer saved!');
      refetch();
    } catch (e) { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Footer Editor"><BlockSkeleton lines={6} /></AdminLayout>;

  return (
    <AdminLayout title="Footer Editor" subtitle="Edit footer company info, social links, and legal text.">
      {form && (
        <div className="max-w-2xl space-y-6">
          {/* Company info */}
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-bold text-gray-900 dark:text-white">Company Info</h3>
            {[['company_name','Company Name'],['tagline','Tagline'],['description','Description'],
              ['address','Address'],['phone','Phone'],['email','Email'],['whatsapp','WhatsApp Number']
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <input value={form[field] || ''} onChange={e => handleChange(field, e.target.value)} className="form-input" />
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-gray-900 dark:text-white">Social Media Links</h3>
              <button onClick={addSocial} className="flex items-center gap-1 text-sm text-brand-500 font-semibold">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {(form.socials || []).map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={s.platform} onChange={e => handleSocialChange(i,'platform',e.target.value)}
                  placeholder="Platform (Instagram)" className="form-input flex-1" />
                <input value={s.url} onChange={e => handleSocialChange(i,'url',e.target.value)}
                  placeholder="URL" className="form-input flex-1" />
                <button onClick={() => removeSocial(i)} className="p-2 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-bold text-gray-900 dark:text-white">Legal Text</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Privacy Policy</label>
              <textarea value={form.privacy_policy || ''} onChange={e => handleChange('privacy_policy', e.target.value)} rows={5} className="form-input resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms of Use</label>
              <textarea value={form.terms || ''} onChange={e => handleChange('terms', e.target.value)} rows={5} className="form-input resize-none" />
            </div>
          </div>

          <Button onClick={handleSave} loading={saving} size="lg">
            <Save className="w-4 h-4" /> Save Footer
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}
