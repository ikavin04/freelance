import { Navigate } from 'react-router-dom';
import { authHelpers } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
