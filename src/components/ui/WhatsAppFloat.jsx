import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat({ number, message }) {
  const clean = number.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${clean}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-xl transition-colors"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
      {/* Pulse ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" />
    </motion.a>
  );
}
