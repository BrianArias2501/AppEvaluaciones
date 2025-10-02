import { apiUtils } from './api';
import config, { debugLog } from '../config/config.js';

class AuthService {
  // Iniciar sesión
  async login(credentials) {
    try {
      debugLog('Attempting login for user:', credentials.usuario);
      const response = await apiUtils.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      // Guardar token y datos del usuario
      localStorage.setItem(config.auth.tokenKey, token);
      localStorage.setItem(config.auth.userKey, JSON.stringify(user));
      
      debugLog('Login successful for user:', user.usuario);
      return { user, token };
    } catch (error) {
      debugLog('Login failed:', error.message);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  // Registrar usuario
  async register(userData) {
    try {
      const response = await apiUtils.post('/auth/register', userData);
      const { user, token } = response.data;
      
      // Guardar datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      await apiUtils.post('/auth/logout');
    } catch (error) {
      console.warn('Error al cerrar sesión en el servidor:', error.message);
    } finally {
      // Limpiar datos locales independientemente del resultado
      debugLog('Logging out user');
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.userKey);
    }
  }

  // Obtener perfil del usuario actual
  async getProfile() {
    try {
      const response = await apiUtils.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener perfil');
    }
  }

  // Verificar si el token es válido
  async verifyToken() {
    try {
      const response = await apiUtils.get('/auth/verify');
      return response.data;
    } catch (error) {
      // Si el token no es válido, limpiar datos locales
      this.clearLocalData();
      throw new Error('Token inválido');
    }
  }

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await apiUtils.patch('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  }

  // Obtener usuario actual desde localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(config.auth.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al parsear usuario desde localStorage:', error);
      return null;
    }
  }

  // Obtener token actual
  getCurrentToken() {
    return localStorage.getItem(config.auth.tokenKey);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getCurrentToken();
    const user = this.getCurrentUser();
    const isAuth = !!(token && user);
    debugLog('Authentication status:', isAuth);
    return isAuth;
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role) {
    const user = this.getCurrentUser();
    const hasRole = user?.rol === role;
    debugLog('Role check:', { userRole: user?.rol, requiredRole: role, hasRole });
    return hasRole;
  }

  // Verificar si el usuario tiene alguno de los roles especificados
  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.includes(user?.rol);
  }

  // Limpiar datos locales
  clearLocalData() {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userKey);
  }
}

// Crear instancia única del servicio
const authService = new AuthService();

export default authService;

// Exportar también los roles para facilitar su uso
export const ROLES = {
  ADMINISTRADOR: config.roles.ADMIN,
  EVALUADOR: config.roles.EVALUATOR,
  ESTUDIANTE: config.roles.STUDENT
};