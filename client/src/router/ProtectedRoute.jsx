import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

export default function ProtectedRoute() {
  const { admin, loading } = useAuth();
  if (loading) return <Loader full />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
