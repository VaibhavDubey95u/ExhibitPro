import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { BlockSkeleton } from '@components/ui/SkeletonLoader';

// Public pages (lazy-loaded)
const Home         = lazy(() => import('@pages/Home'));
const About        = lazy(() => import('@pages/About'));
const Services     = lazy(() => import('@pages/Services'));
const Projects     = lazy(() => import('@pages/Projects'));
const ProjectDetail= lazy(() => import('@pages/Projects/ProjectDetail'));
const ServiceAreas = lazy(() => import('@pages/ServiceAreas'));
const Contact      = lazy(() => import('@pages/Contact'));
const NotFound     = lazy(() => import('@pages/NotFound'));

// Admin pages (lazy-loaded)
const AdminLogin           = lazy(() => import('@pages/admin/Login'));
const AdminDashboard       = lazy(() => import('@pages/admin/Dashboard'));
const HomeEditor           = lazy(() => import('@pages/admin/HomeEditor'));
const AboutEditor          = lazy(() => import('@pages/admin/AboutEditor'));
const ServicesEditor       = lazy(() => import('@pages/admin/ServicesEditor'));
const ProjectsManager      = lazy(() => import('@pages/admin/ProjectsManager'));
const ServiceAreasManager  = lazy(() => import('@pages/admin/ServiceAreasManager'));
const MessagesInbox        = lazy(() => import('@pages/admin/MessagesInbox'));
const FooterEditor         = lazy(() => import('@pages/admin/FooterEditor'));
const SettingsManager      = lazy(() => import('@pages/admin/SettingsManager'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-64 space-y-3">
        <BlockSkeleton lines={4} />
      </div>
    </div>
  );
}

/** Redirects non-admins to login */
function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

/** Redirects logged-in admins away from login page */
function GuestRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAdmin ? <Navigate to="/admin/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Home />} />
        <Route path="/about"          element={<About />} />
        <Route path="/services"       element={<Services />} />
        <Route path="/projects"       element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/service-areas"  element={<ServiceAreas />} />
        <Route path="/contact"        element={<Contact />} />

        {/* Admin — guest only */}
        <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

        {/* Admin — protected */}
        <Route path="/admin/dashboard"      element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/home"           element={<ProtectedRoute><HomeEditor /></ProtectedRoute>} />
        <Route path="/admin/about"          element={<ProtectedRoute><AboutEditor /></ProtectedRoute>} />
        <Route path="/admin/services"       element={<ProtectedRoute><ServicesEditor /></ProtectedRoute>} />
        <Route path="/admin/projects"       element={<ProtectedRoute><ProjectsManager /></ProtectedRoute>} />
        <Route path="/admin/service-areas"  element={<ProtectedRoute><ServiceAreasManager /></ProtectedRoute>} />
        <Route path="/admin/messages"       element={<ProtectedRoute><MessagesInbox /></ProtectedRoute>} />
        <Route path="/admin/footer"         element={<ProtectedRoute><FooterEditor /></ProtectedRoute>} />
        <Route path="/admin/settings"       element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
