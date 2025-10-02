import { apiUtils } from './api';

class UserService {
  // Obtener todos los usuarios (solo administradores)
  async getAllUsers() {
    try {
      const response = await apiUtils.get('/usuarios');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener usuarios');
    }
  }

  // Crear nuevo usuario (solo administradores)
  async createUser(userData) {
    try {
      const response = await apiUtils.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al crear usuario');
    }
  }

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      const response = await apiUtils.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener usuario');
    }
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await apiUtils.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }

  // Eliminar usuario (solo administradores)
  async deleteUser(id) {
    try {
      const response = await apiUtils.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar usuario');
    }
  }

  // Obtener perfil del usuario actual
  async getProfile() {
    try {
      const response = await apiUtils.get('/usuarios/perfil');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener perfil');
    }
  }

  // Obtener evaluadores (solo administradores)
  async getEvaluators() {
    try {
      const response = await apiUtils.get('/usuarios/evaluadores');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluadores');
    }
  }

  // Obtener estudiantes (administradores y evaluadores)
  async getStudents() {
    try {
      const response = await apiUtils.get('/usuarios/estudiantes');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener estudiantes');
    }
  }

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await apiUtils.put('/usuarios/cambiar-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  }

  // Validar datos de usuario antes de enviar
  validateUserData(userData) {
    const errors = [];

    if (!userData.nombres || userData.nombres.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!userData.apellidos || userData.apellidos.trim().length < 2) {
      errors.push('Los apellidos deben tener al menos 2 caracteres');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('El email debe tener un formato válido');
    }

    if (!userData.rol || !['administrador', 'evaluador', 'estudiante'].includes(userData.rol)) {
      errors.push('Debe seleccionar un rol válido');
    }

    if (userData.password && userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return errors;
  }

  // Validar formato de email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Formatear datos de usuario para mostrar
  formatUserForDisplay(user) {
    return {
      ...user,
      nombreCompleto: `${user.nombres} ${user.apellidos}`,
      rolFormatted: this.formatRole(user.rol),
      estadoFormatted: user.activo ? 'Activo' : 'Inactivo'
    };
  }

  // Formatear rol para mostrar
  formatRole(role) {
    const roleMap = {
      'administrador': 'Administrador',
      'evaluador': 'Evaluador',
      'estudiante': 'Estudiante'
    };
    return roleMap[role] || role;
  }
}

// Crear instancia única del servicio
const userService = new UserService();

export default userService;