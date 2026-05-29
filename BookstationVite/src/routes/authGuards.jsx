import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Helper function MUST return a boolean (true/false)
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; 
    
    return decoded.exp < currentTime; 
  } catch (error) {
    return true; 
  }
};

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); 
    return <Navigate to="/login" replace />; 
  }
  
  return <Outlet />;
};

export const AdminRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); 
    return <Navigate to="/login" replace />; // <-- This is where the navigation belongs
  }

  try {
    const decodedUser = jwtDecode(token);
    const adminRoleIds = [3, 4];
    
    if (!adminRoleIds.includes(decodedUser.roleId)) {
      return <Navigate to="/unauthorized" replace />; 
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};