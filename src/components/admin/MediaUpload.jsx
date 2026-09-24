import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadContentMedia } from '@services/contentApi';

export default function MediaUpload({ page, block, currentUrl, onUpload, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Supported types: JPG, PNG, WEBP, MP4, WEBM');
      return;
    }

    // Validate size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 100MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadContentMedia(page, block, file);
      onUpload(url);
      toast.success('Media uploaded successfully');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      
      {currentUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 group aspect-video max-w-sm border border-gray-200 dark:border-white/10">
          {currentUrl.match(/\.(mp4|webm)$/i) ? (
            <video src={currentUrl} className="w-full h-full object-cover" controls />
          ) : (
            <img src={currentUrl} alt="" className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onUpload('')}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            title="Remove media"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <svg className="animate-spin h-8 w-8 text-brand-500 mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{uploading ? 'Uploading...' : 'Click to upload'}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, WEBP, MP4, WEBM (Max 100MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  );
}
