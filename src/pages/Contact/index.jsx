import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Send, Globe, MessageCircle } from 'lucide-react';
import { useContent } from '@hooks/useContent';
import { supabase } from '@services/supabaseClient';
import Button from '@components/ui/Button';

const SocialSVG = {
  Instagram: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  LinkedIn:  () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  Facebook:  () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  Twitter:   () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.254 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
};
const SOCIAL_ICONS = { ...SocialSVG, Globe: () => <Globe className="w-5 h-5" /> };

const schema = z.object({
  name:      z.string().min(2, 'Name is required'),
  email:     z.string().email('Valid email required'),
  phone:     z.string().optional(),
  subject:   z.string().optional(),
  message:   z.string().min(10, 'Message must be at least 10 characters'),
  _honeypot: z.string().max(0, ''),  // honeypot — must be empty
});

export default function Contact() {
  const { getBlock } = useContent('footer');
  const footer = getBlock('main')?.data || {};
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { _honeypot: '' },
  });

  const onSubmit = async (data) => {
    // Client-side rate limiting (extra layer)
    const lastSent = localStorage.getItem('last_msg_sent');
    if (lastSent && Date.now() - Number(lastSent) < 60000) {
      toast.error('Please wait a moment before sending another message.');
      return;
    }

    setLoading(true);
    try {
      const { _honeypot, ...payload } = data;
      
      // 1. Honeypot check
      if (_honeypot) {
        toast.success('Message sent! We\'ll get back to you soon.');
        reset();
        return;
      }

      // 2. Insert directly into Supabase
      const { error: insertError } = await supabase
        .from('messages')
        .insert([payload]);

      if (insertError) throw new Error('Database insert failed: ' + insertError.message);

      // 3. Mark as sent locally
      localStorage.setItem('last_msg_sent', String(Date.now()));
      reset();

      // 4. Try sending email via Edge Function
      const { error: fnError } = await supabase.functions.invoke('submit-message', { body: { ...payload } });
      
      if (fnError) {
        toast.success('Your message has been received successfully. We may experience a delay sending the email notification.');
      } else {
        toast.success('Message sent! We\'ll get back to you soon.');
      }

    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socials = footer.socials || [];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-transparent to-transparent" />
        <div className="section-container relative z-10 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-brand-500/20 text-brand-300 mb-4">
            Get In Touch
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            Let's Build Something
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto">
            Reach out for a free consultation and quote for your next exhibition stand.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info — 2/5 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <div className="accent-line" />
                <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">Contact Information</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Reach us through any of the channels below, or fill in the form.</p>
              </div>

              <div className="space-y-4">
                {footer.phone && (
                  <a href={`tel:${footer.phone}`} className="card flex items-center gap-4 p-4 hover:border-brand-500 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 transition-colors">
                      <Phone className="w-5 h-5 text-brand-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Phone</div>
                      <div className="text-gray-900 dark:text-white font-semibold">{footer.phone}</div>
                    </div>
                  </a>
                )}
                {footer.email && (
                  <a href={`mailto:${footer.email}`} className="card flex items-center gap-4 p-4 hover:border-brand-500 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500 transition-colors">
                      <Mail className="w-5 h-5 text-brand-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Email</div>
                      <div className="text-gray-900 dark:text-white font-semibold">{footer.email}</div>
                    </div>
                  </a>
                )}
                {footer.address && (
                  <div className="card flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Location</div>
                      <div className="text-gray-900 dark:text-white font-semibold">{footer.address}</div>
                    </div>
                  </div>
                )}
                {footer.whatsapp && (
                  <a href={`https://wa.me/${footer.whatsapp.replace(/[^0-9]/g,'')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="card flex items-center gap-4 p-4 hover:border-green-500 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">WhatsApp</div>
                      <div className="text-gray-900 dark:text-white font-semibold">Chat With Us</div>
                    </div>
                  </a>
                )}
              </div>

              {/* Social links */}
              {socials.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {socials.map(s => {
                      const Icon = SOCIAL_ICONS[s.platform] || Globe;
                      return (
                        <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl card flex items-center justify-center text-gray-500 hover:text-brand-500 hover:border-brand-500 transition-all">
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Form — 3/5 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="card p-8">
                <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {/* Honeypot — hidden from users, visible to bots */}
                  <input type="text" {...register('_honeypot')} tabIndex={-1} aria-hidden="true"
                    className="hidden" autoComplete="off" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                      <input {...register('name')} placeholder="Your name" className="form-input" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                      <input {...register('email')} type="email" placeholder="your@email.com" className="form-input" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                      <input {...register('phone')} placeholder="+971 50 000 0000" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                      <input {...register('subject')} placeholder="Exhibition stand enquiry" className="form-input" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                    <textarea {...register('message')} placeholder="Tell us about your project..." rows={5}
                      className="form-input resize-none" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" loading={loading} fullWidth size="lg">
                    <Send className="w-4 h-4" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
