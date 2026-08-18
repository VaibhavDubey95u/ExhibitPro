import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';
import AppRoutes from './routes';
import IntroLoader from '@components/ui/IntroLoader';
import WhatsAppFloat from './components/ui/WhatsAppFloat';
import { useContent } from '@hooks/useContent';

function AppShell() {
  const { getBlock } = useContent('settings');
  const settings = getBlock('global')?.data || {};
  const whatsapp = settings.whatsapp_number || '+971500000000';
  const showWA   = settings.show_whatsapp_float !== false;
  const waMsg    = settings.whatsapp_message || '';
  const { getBlock: getFooterBlock } = useContent('footer');
  const footerData = getFooterBlock('main')?.data || {};
  const companyName = footerData.company_name || 'ExhibitPro';

  useEffect(() => {
    document.title = `${companyName} — Premium Exhibition Stand Services`;
  }, [companyName]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      {showWA && <WhatsAppFloat number={whatsapp} message={waMsg} />}
    </div>
  );
}

export default function App() {
  const [introShown, setIntroShown] = useState(() => {
    return sessionStorage.getItem('intro_shown') === 'true';
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_shown', 'true');
    setIntroShown(true);
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {!introShown && <IntroLoader onComplete={handleIntroComplete} />}
          <AppShell />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-dark-800 dark:text-white',
              style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
              success: { iconTheme: { primary: '#f97316', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
