import { useState } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useContent } from '@hooks/useContent';
import { upsertBlock } from '@services/contentApi';
import Button from '@components/ui/Button';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';
import MediaUpload from '@components/admin/MediaUpload';

/** Base Block Container */
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input name="title" value={data.title || ''} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
              <input name="subtitle" value={data.subtitle || ''} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary CTA Text</label>
              <input name="cta_primary" value={data.cta_primary || ''} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary CTA Link</label>
              <input name="cta_primary_link" value={data.cta_primary_link || ''} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary CTA Text</label>
              <input name="cta_secondary" value={data.cta_secondary || ''} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary CTA Link</label>
              <input name="cta_secondary_link" value={data.cta_secondary_link || ''} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <MediaUpload page="home" block="hero" label="Background Image/Video" currentUrl={data.background_url} onUpload={(url) => setData({ ...data, background_url: url })} />
          <Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Hero</Button>
        </div>
      )}
    </BlockContainer>
  );
}

function StatsEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { items: [] });
  const items = data.items || [];

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };
  const removeItem = (index) => setData({ ...data, items: items.filter((_, i) => i !== index) });
  const addItem = () => setData({ ...data, items: [...items, { value: '', label: '' }] });

  return (
    <BlockContainer block={block} label="Statistics" onSave={onSave}>
      {({ saving, handleSave }) => (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 items-end bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                <input value={item.value} onChange={e => updateItem(i, 'value', e.target.value)} className="form-input form-input-sm" placeholder="200+" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} className="form-input form-input-sm" placeholder="Projects Delivered" />
              </div>
              <button onClick={() => removeItem(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4" /> Add Stat</Button>
          <div className="pt-2"><Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Stats</Button></div>
        </div>
      )}
    </BlockContainer>
  );
}

function ServicesOverviewEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { services: [] });
  const services = data.services || [];
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const updateService = (index, field, value) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setData({ ...data, services: newServices });
  };
  const removeService = (index) => setData({ ...data, services: services.filter((_, i) => i !== index) });
  const addService = () => setData({ ...data, services: [...services, { icon: 'Layout', title: '', desc: '' }] });

  return (
    <BlockContainer block={block} label="Services Overview" onSave={onSave}>
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
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Services</label>
            {services.map((svc, i) => (
              <div key={i} className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 space-y-3 relative">
                <button onClick={() => removeService(i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon (Lucide name)</label>
                    <input value={svc.icon} onChange={e => updateService(i, 'icon', e.target.value)} className="form-input form-input-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input value={svc.title} onChange={e => updateService(i, 'title', e.target.value)} className="form-input form-input-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea value={svc.desc} onChange={e => updateService(i, 'desc', e.target.value)} rows={2} className="form-input form-input-sm" />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addService}><Plus className="w-4 h-4" /> Add Service</Button>
          </div>
          <div className="pt-2"><Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Services</Button></div>
        </div>
      )}
    </BlockContainer>
  );
}

function WhyChooseUsEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { points: [] });
  const points = data.points || [];
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const updatePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setData({ ...data, points: newPoints });
  };
  const removePoint = (index) => setData({ ...data, points: points.filter((_, i) => i !== index) });
  const addPoint = () => setData({ ...data, points: [...points, { title: '', desc: '' }] });

  return (
    <BlockContainer block={block} label="Why Choose Us" onSave={onSave}>
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
          <MediaUpload page="home" block="why_choose_us" label="Image" currentUrl={data.image_url} onUpload={(url) => setData({ ...data, image_url: url })} />
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Points</label>
            {points.map((pt, i) => (
              <div key={i} className="flex gap-4 items-start bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input value={pt.title} onChange={e => updatePoint(i, 'title', e.target.value)} className="form-input form-input-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea value={pt.desc} onChange={e => updatePoint(i, 'desc', e.target.value)} rows={2} className="form-input form-input-sm" />
                  </div>
                </div>
                <button onClick={() => removePoint(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-6">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addPoint}><Plus className="w-4 h-4" /> Add Point</Button>
          </div>
          <div className="pt-2"><Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Section</Button></div>
        </div>
      )}
    </BlockContainer>
  );
}

function ProcessEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { steps: [] });
  const steps = data.steps || [];
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setData({ ...data, steps: newSteps });
  };
  const removeStep = (index) => setData({ ...data, steps: steps.filter((_, i) => i !== index) });
  const addStep = () => setData({ ...data, steps: [...steps, { step: '', title: '', desc: '' }] });

  return (
    <BlockContainer block={block} label="Process" onSave={onSave}>
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
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Steps</label>
            {steps.map((st, i) => (
              <div key={i} className="flex gap-4 items-start bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Step Number</label>
                      <input value={st.step} onChange={e => updateStep(i, 'step', e.target.value)} className="form-input form-input-sm" placeholder="01" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input value={st.title} onChange={e => updateStep(i, 'title', e.target.value)} className="form-input form-input-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea value={st.desc} onChange={e => updateStep(i, 'desc', e.target.value)} rows={2} className="form-input form-input-sm" />
                  </div>
                </div>
                <button onClick={() => removeStep(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-6">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addStep}><Plus className="w-4 h-4" /> Add Step</Button>
          </div>
          <div className="pt-2"><Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Process</Button></div>
        </div>
      )}
    </BlockContainer>
  );
}

function CTABannerEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || {});
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <BlockContainer block={block} label="CTA Banner" onSave={onSave}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Text</label>
              <input name="cta_text" value={data.cta_text || ''} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Link</label>
              <input name="cta_link" value={data.cta_link || ''} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Banner</Button>
        </div>
      )}
    </BlockContainer>
  );
}

export default function HomeEditor() {
  const { blocks, loading, refetch } = useContent('home', true);

  const getEditor = (block) => {
    switch (block.block) {
      case 'hero': return <HeroEditor key={block.id} block={block} onSave={refetch} />;
      case 'stats': return <StatsEditor key={block.id} block={block} onSave={refetch} />;
      case 'services_overview': return <ServicesOverviewEditor key={block.id} block={block} onSave={refetch} />;
      case 'why_choose_us': return <WhyChooseUsEditor key={block.id} block={block} onSave={refetch} />;
      case 'process': return <ProcessEditor key={block.id} block={block} onSave={refetch} />;
      case 'cta_banner': return <CTABannerEditor key={block.id} block={block} onSave={refetch} />;
      default: return null;
    }
  };

  return (
    <AdminLayout title="Edit Home Page" subtitle="Click any block to edit its content. Changes go live when you save and set Visible.">
      {loading ? <BlockSkeleton lines={6} /> : (
        <div className="space-y-6">
          {blocks.map(getEditor)}
        </div>
      )}
    </AdminLayout>
  );
}
