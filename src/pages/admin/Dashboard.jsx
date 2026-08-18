import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, MessageSquare, Globe, Layout, Settings, LogOut, ExternalLink, Mail } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { supabase } from '@services/supabaseClient';

const adminNav = [
  { icon: Layout,     label: 'Home Content',    to: '/admin/home' },
  { icon: Globe,      label: 'About Content',   to: '/admin/about' },
  { icon: Settings,   label: 'Services',        to: '/admin/services' },
  { icon: FolderOpen, label: 'Projects',        to: '/admin/projects' },
  { icon: Globe,      label: 'Service Areas',   to: '/admin/service-areas' },
  { icon: Mail,       label: 'Messages',        to: '/admin/messages' },
  { icon: Layout,     label: 'Footer',          to: '/admin/footer' },
  { icon: Settings,   label: 'Settings',        to: '/admin/settings' },
];

function StatCard({ icon: Icon, label, value, color = 'brand' }) {
  return (
    <div className="card p-6 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color === 'brand' ? 'bg-brand-50 dark:bg-brand-900/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
        <Icon className={`w-6 h-6 ${color === 'brand' ? 'text-brand-500' : 'text-red-500'}`} />
      </div>
      <div>
        <div className="text-2xl font-display font-black text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: proj }, { count: msgs }, { count: unread }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ]);
      setStats({ projects: proj || 0, messages: msgs || 0, unread: unread || 0 });
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20">
      {/* Admin header */}
      <div className="bg-white dark:bg-dark-850 border-b border-gray-100 dark:border-white/10">
        <div className="section-container py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-xl text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 transition-colors">
              <ExternalLink className="w-4 h-4" /> View Site
            </a>
            <button onClick={signOut}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon={FolderOpen} label="Total Projects" value={stats.projects} />
          <StatCard icon={MessageSquare} label="Total Messages" value={stats.messages} />
          <StatCard icon={Mail} label="Unread Messages" value={stats.unread} color={stats.unread > 0 ? 'red' : 'brand'} />
        </div>

        {/* Nav grid */}
        <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-5">Manage Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminNav.map(({ icon: Icon, label, to }, i) => (
            <motion.div key={to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={to} className="card p-5 flex items-center gap-4 hover:border-brand-500 dark:hover:border-brand-500 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                  <Icon className="w-5 h-5 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
