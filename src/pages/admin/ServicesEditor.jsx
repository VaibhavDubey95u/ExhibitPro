import { useState } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useContent } from '@hooks/useContent';
import { upsertBlock } from '@services/contentApi';
import Button from '@components/ui/Button';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import MediaUpload from '@components/admin/MediaUpload';

function BlockContainer({ block, label, onSave, children }) {
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(block?.is_visible !== false);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await upsertBlock({ page: block.page, block: block.block, data, order: block.order, is_visible: visible });
      toast.success(`${label} saved!`);
      onSave?.();
    } catch (err) { toast.error('Save failed: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{label}</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => setVisible(v => !v)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${visible ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {visible ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>
      {children({ saving, handleSave })}
    </div>
  );
}

function HeroEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || {});
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <BlockContainer block={block} label="Hero Section" onSave={onSave}>
      {({ saving, handleSave }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading</label>
              <input name="heading" value={data.heading || ''} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subheading</label>
              <input name="subheading" value={data.subheading || ''} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <MediaUpload page="services" block="hero" label="Background Image" currentUrl={data.image_url} onUpload={(url) => setData({ ...data, image_url: url })} />
          <Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Hero</Button>
        </div>
      )}
    </BlockContainer>
  );
}

function ServicesListEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { services: [] });
  const services = data.services || [];

  const updateService = (index, field, value) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setData({ ...data, services: newServices });
  };
  
  const updateServiceFeatures = (index, featuresString) => {
    const features = featuresString.split(',').map(f => f.trim()).filter(Boolean);
    updateService(index, 'features', features);
  };

  const removeService = (index) => setData({ ...data, services: services.filter((_, i) => i !== index) });
  const addService = () => setData({ ...data, services: [...services, { title: '', desc: '', features: [], image_url: '' }] });

  return (
    <BlockContainer block={block} label="Services List" onSave={onSave}>
      {({ saving, handleSave }) => (
        <div className="space-y-4">
          <div className="space-y-6">
            {services.map((svc, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-white/10 relative">
                <button onClick={() => removeService(i)} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input value={svc.title || ''} onChange={e => updateService(i, 'title', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea value={svc.desc || ''} onChange={e => updateService(i, 'desc', e.target.value)} rows={3} className="form-input resize-y" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (comma separated)</label>
                    <input value={(svc.features || []).join(', ')} onChange={e => updateServiceFeatures(i, e.target.value)} className="form-input" placeholder="3D renders, Structural drawings, Mood boards" />
                  </div>
                </div>
                
                <div className="w-full md:w-72 flex-shrink-0">
                  <MediaUpload page="services" block="services_list" label="Service Image" currentUrl={svc.image_url} onUpload={(url) => updateService(i, 'image_url', url)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addService}><Plus className="w-4 h-4" /> Add Service</Button>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-white/10">
            <Button onClick={() => handleSave(data)} loading={saving} size="lg"><Save className="w-5 h-5" /> Save All Services</Button>
          </div>
        </div>
      )}
    </BlockContainer>
  );
}

export default function ServicesEditor() {
  const { blocks, loading, refetch } = useContent('services', true);

  const getEditor = (block) => {
    switch (block.block) {
      case 'hero': return <HeroEditor key={block.id} block={block} onSave={refetch} />;
      case 'services_list': return <ServicesListEditor key={block.id} block={block} onSave={refetch} />;
      default: return null;
    }
  };

  return (
    <AdminLayout title="Edit Services Page" subtitle="Click any block to edit its content.">
      {loading ? <BlockSkeleton lines={6} /> : (
        <div className="space-y-6">
          {blocks.map(getEditor)}
        </div>
      )}
    </AdminLayout>
  );
}
