import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import config, { debugLog } from '../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    const initializeAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          debugLog('User restored from storage:', currentUser?.usuario);
        }
      } catch (error) {
        debugLog('Error initializing auth:', error);
        // Limpiar datos corruptos
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: userData, token } = await authService.login(credentials);
      setUser(userData);
      
      debugLog('Login successful in context:', userData?.usuario);
      return { success: true, user: userData, token };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      setError(errorMessage);
      debugLog('Login failed in context:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      debugLog('Logout successful in context');
    } catch (error) {
      debugLog('Logout error in context:', error);
      // Forzar logout local aunque falle el servidor
      authService.clearLocalData();
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register(userData);
      debugLog('Registration successful in context:', result);
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      setError(errorMessage);
      debugLog('Registration failed in context:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      
      debugLog('Profile updated in context:', updatedUser?.usuario);
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      setError(errorMessage);
      debugLog('Profile update failed in context:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.changePassword(passwordData);
      debugLog('Password changed successfully in context');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      setError(errorMessage);
      debugLog('Password change failed in context:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Funciones de utilidad para roles
  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  const isEvaluator = () => {
    return authService.isEvaluator();
  };

  const isStudent = () => {
    return authService.isStudent();
  };

  const value = {
    // Estado
    user,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    
    // Acciones
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    clearError,
    
    // Utilidades de roles
    hasRole,
    isAdmin,
    isEvaluator,
    isStudent,
    
    // Datos del usuario
    userRole: user?.rol,
    userName: user ? `${user.nombres} ${user.apellidos}` : null,
    userEmail: user?.email
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
