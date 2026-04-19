import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/auth/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a202c',
        color: '#fff',
        fontSize: '1.1rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
