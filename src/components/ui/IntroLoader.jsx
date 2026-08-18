import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useContent } from '@hooks/useContent';

export default function IntroLoader({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit
  const { getBlock } = useContent('footer');
  const footerData = getBlock('main')?.data || {};
  const companyName = footerData.company_name || 'ExhibitPro';

  useEffect(() => {
    const holdTimer  = setTimeout(() => setPhase('hold'), 800);
    const exitTimer  = setTimeout(() => setPhase('exit'), 1800);
    const doneTimer  = setTimeout(() => onComplete?.(), 2400);
    return () => [holdTimer, exitTimer, doneTimer].forEach(clearTimeout);
  }, [onComplete]);

  const letters = companyName.split('');

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-950"
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{ background: ['radial-gradient(circle at 20% 50%, #f97316 0%, transparent 60%)', 'radial-gradient(circle at 80% 50%, #f97316 0%, transparent 60%)'] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow"
          >
            <span className="text-white font-display font-black text-2xl">{(companyName || 'E').charAt(0).toUpperCase()}</span>
          </motion.div>

          {/* Animated brand name letters */}
          <div className="flex items-center overflow-hidden">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-4xl md:text-6xl text-white leading-none"
              >
                {letter === 'P' ? (
                  <span className="text-brand-400">{letter}</span>
                ) : letter}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-4 text-gray-400 text-sm tracking-[0.3em] uppercase font-medium"
          >
            Exhibition Stand Specialists
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-brand-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
