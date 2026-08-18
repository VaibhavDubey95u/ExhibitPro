import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import { useContent } from '@hooks/useContent';
import { upsertBlock } from '@services/contentApi';
import Button from '@components/ui/Button';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';

export default function SettingsManager() {
  const { blocks, loading, refetch } = useContent('settings', true);
  const settingsBlock = blocks.find(b => b.block === 'global');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!loading && settingsBlock && form === null) {
    setForm(settingsBlock.data);
  }

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await upsertBlock({ page: 'settings', block: 'global', data: form, order: 1, is_visible: true });
      toast.success('Settings saved!');
      refetch();
    } catch (e) { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Settings"><BlockSkeleton lines={4} /></AdminLayout>;

  return (
    <AdminLayout title="Site Settings" subtitle="Global settings for the website.">
      {form && (
        <div className="max-w-xl space-y-6">
          <div className="card p-6 space-y-4">
            {[
              ['site_name',          'Site Name'],
              ['whatsapp_number',    'WhatsApp Number (with country code, e.g. +971500000000)'],
              ['whatsapp_message',   'Default WhatsApp Message'],
              ['notification_email', 'Notification Email (receives contact form alerts)'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <input value={form[field] || ''} onChange={e => setForm(f => ({...f, [field]: e.target.value}))} className="form-input" />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="show_wa" checked={!!form.show_whatsapp_float}
                onChange={e => setForm(f => ({...f, show_whatsapp_float: e.target.checked}))}
                className="w-4 h-4 accent-brand-500" />
              <label htmlFor="show_wa" className="text-sm text-gray-700 dark:text-gray-300">Show WhatsApp floating button</label>
            </div>
          </div>
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save className="w-4 h-4" /> Save Settings
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}
