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
          <MediaUpload page="about" block="hero" label="Background Image" currentUrl={data.background_url} onUpload={(url) => setData({ ...data, background_url: url })} />
          <Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Hero</Button>
        </div>
      )}
    </BlockContainer>
  );
}

function StoryEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || {});
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <BlockContainer block={block} label="Our Story" onSave={onSave}>
      {({ saving, handleSave }) => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading</label>
            <input name="heading" value={data.heading || ''} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body Text</label>
            <textarea name="body" value={data.body || ''} onChange={handleChange} rows={6} className="form-input resize-y" />
          </div>
          <MediaUpload page="about" block="story" label="Story Image" currentUrl={data.image_url} onUpload={(url) => setData({ ...data, image_url: url })} />
          <Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Story</Button>
        </div>
      )}
    </BlockContainer>
  );
}

function TeamEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { members: [] });
  const members = data.members || [];
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setData({ ...data, members: newMembers });
  };
  const removeMember = (index) => setData({ ...data, members: members.filter((_, i) => i !== index) });
  const addMember = () => setData({ ...data, members: [...members, { name: '', role: '', image_url: '' }] });

  return (
    <BlockContainer block={block} label="Meet the Team" onSave={onSave}>
      {({ saving, handleSave }) => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading</label>
            <input name="heading" value={data.heading || ''} onChange={handleChange} className="form-input" />
          </div>
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</label>
            {members.map((m, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                <div className="flex-1 space-y-3 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      <input value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} className="form-input form-input-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                      <input value={m.role} onChange={e => updateMember(i, 'role', e.target.value)} className="form-input form-input-sm" />
                    </div>
                  </div>
                  <MediaUpload 
                    page="about" 
                    block="team" 
                    label="Member Photo" 
                    currentUrl={m.image_url} 
                    onUpload={(url) => updateMember(i, 'image_url', url)} 
                    accept="image/jpeg,image/png,image/webp"
                    maxSizeMB={25}
                    helperText="JPG, PNG, WEBP"
                  />
                </div>
                <button onClick={() => removeMember(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-6">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addMember}><Plus className="w-4 h-4" /> Add Team Member</Button>
          </div>
          <Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Team</Button>
        </div>
      )}
    </BlockContainer>
  );
}

function ValuesEditor({ block, onSave }) {
  const [data, setData] = useState(block?.data || { values: [] });
  const values = data.values || [];
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const updateValue = (index, field, value) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value };
    setData({ ...data, values: newValues });
  };
  const removeValue = (index) => setData({ ...data, values: values.filter((_, i) => i !== index) });
  const addValue = () => setData({ ...data, values: [...values, { title: '', desc: '' }] });

  return (
    <BlockContainer block={block} label="Our Values" onSave={onSave}>
      {({ saving, handleSave }) => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heading</label>
            <input name="heading" value={data.heading || ''} onChange={handleChange} className="form-input" />
          </div>
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Values</label>
            {values.map((v, i) => (
              <div key={i} className="flex gap-4 items-start bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input value={v.title} onChange={e => updateValue(i, 'title', e.target.value)} className="form-input form-input-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea value={v.desc} onChange={e => updateValue(i, 'desc', e.target.value)} rows={2} className="form-input form-input-sm" />
                  </div>
                </div>
                <button onClick={() => removeValue(i)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-6">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addValue}><Plus className="w-4 h-4" /> Add Value</Button>
          </div>
          <div className="pt-2"><Button onClick={() => handleSave(data)} loading={saving}><Save className="w-4 h-4" /> Save Values</Button></div>
        </div>
      )}
    </BlockContainer>
  );
}

export default function AboutEditor() {
  const { blocks, loading, refetch } = useContent('about', true);

  const getEditor = (block) => {
    switch (block.block) {
      case 'hero': return <HeroEditor key={block.id} block={block} onSave={refetch} />;
      case 'story': return <StoryEditor key={block.id} block={block} onSave={refetch} />;
      case 'team': return <TeamEditor key={block.id} block={block} onSave={refetch} />;
      case 'values': return <ValuesEditor key={block.id} block={block} onSave={refetch} />;
      default: return null;
    }
  };

  return (
    <AdminLayout title="Edit About Page" subtitle="Click any block to edit its content.">
      {loading ? <BlockSkeleton lines={6} /> : (
        <div className="space-y-6">
          {blocks.map(getEditor)}
        </div>
      )}
    </AdminLayout>
  );
}
