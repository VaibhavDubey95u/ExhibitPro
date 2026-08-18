import { Inbox, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'Nothing here yet',
  description = '',
  action = null,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
        <Icon className="w-9 h-9 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-500 max-w-sm mb-6">{description}</p>}
      {action}
    </motion.div>
  );
}
