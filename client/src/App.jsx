import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './router/ProtectedRoute';

// Public
import Home from './pages/Home';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageHero from './pages/admin/ManageHero';
import ManageAbout from './pages/admin/ManageAbout';
import ManageStats from './pages/admin/ManageStats';
import ManageServices from './pages/admin/ManageServices';
import ManageProjects from './pages/admin/ManageProjects';
import ManageTools from './pages/admin/ManageTools';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageContacts from './pages/admin/ManageContacts';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e1e1e',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#e51515', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/hero" element={<ManageHero />} />
                <Route path="/admin/about" element={<ManageAbout />} />
                <Route path="/admin/stats" element={<ManageStats />} />
                <Route path="/admin/services" element={<ManageServices />} />
                <Route path="/admin/projects" element={<ManageProjects />} />
                <Route path="/admin/tools" element={<ManageTools />} />
                <Route path="/admin/testimonials" element={<ManageTestimonials />} />
                <Route path="/admin/contacts" element={<ManageContacts />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
