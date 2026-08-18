import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useContent } from '@hooks/useContent';
import toast from 'react-hot-toast';
import Button from '@components/ui/Button';

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
});

export default function AdminLogin() {
  const { signIn } = useAuth();
  const { getBlock } = useContent('footer');
  const companyName = getBlock('main')?.data?.company_name || 'ExhibitPro';
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 items-center justify-center mb-4 shadow-glow">
            <span className="text-white font-display font-black text-2xl">{(companyName || 'E').charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="font-display font-black text-white text-2xl">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your website</p>
        </div>

        <div className="card bg-dark-800 border-white/10 p-8 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="admin@exhibitpro.ae"
                className="form-input" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  className="form-input pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" loading={loading} fullWidth>
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
