import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

export default function ErrorUI({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry = null,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-9 h-9 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
