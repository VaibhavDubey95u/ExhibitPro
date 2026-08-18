import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout({ title, subtitle, backTo = '/admin/dashboard', children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-white dark:bg-dark-850 border-b border-gray-100 dark:border-white/10">
        <div className="section-container py-5">
          <Link to={backTo} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 mb-3 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="font-display font-black text-2xl text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="section-container py-8">
        {children}
      </div>
    </div>
  );
}
