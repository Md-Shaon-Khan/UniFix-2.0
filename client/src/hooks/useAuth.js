import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Hook to access the real authentication state
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Safety Check: Ensure this component is wrapped in <AuthProvider>
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Default export for backward compatibility with your existing code
export default useAuth;