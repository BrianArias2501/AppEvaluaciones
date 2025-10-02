import { apiUtils } from './api';

class ProjectService {
  // Crear nuevo proyecto
  async createProject(projectData) {
    try {
      const response = await apiUtils.post('/proyectos', projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al crear proyecto');
    }
  }

  // Obtener todos los proyectos (solo administradores)
  async getAllProjects(filters = {}) {
    try {
      const response = await apiUtils.get('/proyectos', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener proyectos');
    }
  }

  // Obtener mis proyectos (proyectos creados por el usuario actual)
  async getMyProjects(filters = {}) {
    try {
      const response = await apiUtils.get('/proyectos/mis-proyectos', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener mis proyectos');
    }
  }

  // Obtener proyectos asignados (para evaluadores)
  async getAssignedProjects(filters = {}) {
    try {
      const response = await apiUtils.get('/proyectos/asignados', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener proyectos asignados');
    }
  }

  // Obtener proyectos disponibles (para estudiantes)
  async getAvailableProjects() {
    try {
      const response = await apiUtils.get('/proyectos/disponibles');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener proyectos disponibles');
    }
  }

  // Obtener proyectos por estado
  async getProjectsByStatus(status) {
    try {
      const response = await apiUtils.get(`/proyectos/estado/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener proyectos por estado');
    }
  }

  // Obtener proyecto por ID
  async getProjectById(id) {
    try {
      const response = await apiUtils.get(`/proyectos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener proyecto');
    }
  }

  // Actualizar proyecto
  async updateProject(id, projectData) {
    try {
      const response = await apiUtils.put(`/proyectos/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar proyecto');
    }
  }

  // Cambiar estado del proyecto
  async changeProjectStatus(id, statusData) {
    try {
      const response = await apiUtils.put(`/proyectos/${id}/estado`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al cambiar estado del proyecto');
    }
  }

  // Asignar evaluador a proyecto (solo administradores)
  async assignEvaluator(id, evaluatorData) {
    try {
      const response = await apiUtils.put(`/proyectos/${id}/asignar-evaluador`, evaluatorData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al asignar evaluador');
    }
  }

  // Eliminar proyecto
  async deleteProject(id) {
    try {
      const response = await apiUtils.delete(`/proyectos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar proyecto');
    }
  }

  // Buscar proyectos
  async searchProjects(searchData) {
    try {
      const response = await apiUtils.post('/proyectos/buscar', searchData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al buscar proyectos');
    }
  }

  // Obtener estadísticas de proyectos
  async getProjectStatistics(filters = {}) {
    try {
      const response = await apiUtils.get('/proyectos/estadisticas', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener estadísticas');
    }
  }

  // Validar datos de proyecto
  validateProjectData(projectData) {
    const errors = [];

    if (!projectData.nombre || projectData.nombre.trim().length < 3) {
      errors.push('El nombre del proyecto debe tener al menos 3 caracteres');
    }

    if (!projectData.descripcion || projectData.descripcion.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!projectData.fechaEntrega) {
      errors.push('Debe especificar una fecha de entrega');
    } else {
      const entregaDate = new Date(projectData.fechaEntrega);
      const today = new Date();
      if (entregaDate <= today) {
        errors.push('La fecha de entrega debe ser posterior a hoy');
      }
    }

    if (projectData.criteriosEvaluacion && projectData.criteriosEvaluacion.length === 0) {
      errors.push('Debe definir al menos un criterio de evaluación');
    }

    return errors;
  }

  // Formatear proyecto para mostrar
  formatProjectForDisplay(project) {
    return {
      ...project,
      fechaEntregaFormatted: this.formatDate(project.fechaEntrega),
      fechaCreacionFormatted: this.formatDate(project.fechaCreacion),
      estadoFormatted: this.formatStatus(project.estado),
      activoFormatted: project.activo ? 'Activo' : 'Inactivo'
    };
  }

  // Formatear fecha
  formatDate(dateString) {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formatear estado
  formatStatus(status) {
    const statusMap = {
      'borrador': 'Borrador',
      'activo': 'Activo',
      'en_evaluacion': 'En Evaluación',
      'completado': 'Completado',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  // Obtener colores para estados
  getStatusColor(status) {
    const colorMap = {
      'borrador': '#6c757d',
      'activo': '#28a745',
      'en_evaluacion': '#ffc107',
      'completado': '#007bff',
      'cancelado': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  }
}

// Crear instancia única del servicio
const projectService = new ProjectService();

export default projectService;

// Exportar estados de proyecto
export const PROJECT_STATES = {
  BORRADOR: 'borrador',
  ACTIVO: 'activo',
  EN_EVALUACION: 'en_evaluacion',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
};