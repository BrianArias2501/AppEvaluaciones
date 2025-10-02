import { apiUtils } from './api';

class EvaluationService {
  // Crear nueva evaluación
  async createEvaluation(evaluationData) {
    try {
      const response = await apiUtils.post('/evaluaciones', evaluationData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al crear evaluación');
    }
  }

  // Obtener todas las evaluaciones (solo administradores)
  async getAllEvaluations(filters = {}) {
    try {
      const response = await apiUtils.get('/evaluaciones', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluaciones');
    }
  }

  // Obtener mis evaluaciones (evaluaciones del usuario actual)
  async getMyEvaluations(filters = {}) {
    try {
      const response = await apiUtils.get('/evaluaciones/mis-evaluaciones', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener mis evaluaciones');
    }
  }

  // Obtener evaluaciones por estudiante
  async getEvaluationsByStudent(studentId, filters = {}) {
    try {
      const response = await apiUtils.get(`/evaluaciones/estudiante/${studentId}`, { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluaciones del estudiante');
    }
  }

  // Obtener evaluaciones por evaluador
  async getEvaluationsByEvaluator(evaluatorId, filters = {}) {
    try {
      const response = await apiUtils.get(`/evaluaciones/evaluador/${evaluatorId}`, { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluaciones del evaluador');
    }
  }

  // Obtener evaluaciones activas
  async getActiveEvaluations() {
    try {
      const response = await apiUtils.get('/evaluaciones/activas');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluaciones activas');
    }
  }

  // Obtener evaluaciones vencidas
  async getOverdueEvaluations() {
    try {
      const response = await apiUtils.get('/evaluaciones/vencidas');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluaciones vencidas');
    }
  }

  // Obtener evaluación por ID
  async getEvaluationById(id) {
    try {
      const response = await apiUtils.get(`/evaluaciones/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener evaluación');
    }
  }

  // Actualizar evaluación
  async updateEvaluation(id, evaluationData) {
    try {
      const response = await apiUtils.put(`/evaluaciones/${id}`, evaluationData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar evaluación');
    }
  }

  // Cambiar estado de evaluación
  async changeEvaluationStatus(id, statusData) {
    try {
      const response = await apiUtils.put(`/evaluaciones/${id}/estado`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al cambiar estado de evaluación');
    }
  }

  // Asignar estudiante a evaluación
  async assignStudent(id, studentData) {
    try {
      const response = await apiUtils.put(`/evaluaciones/${id}/asignar-estudiante`, studentData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al asignar estudiante');
    }
  }

  // Eliminar evaluación
  async deleteEvaluation(id) {
    try {
      const response = await apiUtils.delete(`/evaluaciones/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar evaluación');
    }
  }

  // Buscar evaluaciones
  async searchEvaluations(searchData) {
    try {
      const response = await apiUtils.post('/evaluaciones/buscar', searchData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al buscar evaluaciones');
    }
  }

  // Obtener estadísticas de evaluaciones
  async getEvaluationStatistics(filters = {}) {
    try {
      const response = await apiUtils.get('/evaluaciones/estadisticas', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener estadísticas');
    }
  }

  // Validar datos de evaluación
  validateEvaluationData(evaluationData) {
    const errors = [];

    if (!evaluationData.nombre || evaluationData.nombre.trim().length < 3) {
      errors.push('El nombre de la evaluación debe tener al menos 3 caracteres');
    }

    if (!evaluationData.descripcion || evaluationData.descripcion.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!evaluationData.fechaInicio) {
      errors.push('Debe especificar una fecha de inicio');
    }

    if (!evaluationData.fechaFin) {
      errors.push('Debe especificar una fecha de fin');
    }

    if (evaluationData.fechaInicio && evaluationData.fechaFin) {
      const inicioDate = new Date(evaluationData.fechaInicio);
      const finDate = new Date(evaluationData.fechaFin);
      if (finDate <= inicioDate) {
        errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    if (!evaluationData.proyectoId) {
      errors.push('Debe seleccionar un proyecto');
    }

    if (evaluationData.criterios && evaluationData.criterios.length === 0) {
      errors.push('Debe definir al menos un criterio de evaluación');
    }

    return errors;
  }

  // Formatear evaluación para mostrar
  formatEvaluationForDisplay(evaluation) {
    return {
      ...evaluation,
      fechaInicioFormatted: this.formatDate(evaluation.fechaInicio),
      fechaFinFormatted: this.formatDate(evaluation.fechaFin),
      fechaCreacionFormatted: this.formatDate(evaluation.fechaCreacion),
      estadoFormatted: this.formatStatus(evaluation.estado),
      activoFormatted: evaluation.activo ? 'Activo' : 'Inactivo',
      isOverdue: this.isOverdue(evaluation.fechaFin),
      daysRemaining: this.getDaysRemaining(evaluation.fechaFin)
    };
  }

  // Formatear fecha
  formatDate(dateString) {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formatear estado
  formatStatus(status) {
    const statusMap = {
      'borrador': 'Borrador',
      'activa': 'Activa',
      'en_progreso': 'En Progreso',
      'completada': 'Completada',
      'vencida': 'Vencida',
      'cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  // Verificar si está vencida
  isOverdue(fechaFin) {
    if (!fechaFin) return false;
    const finDate = new Date(fechaFin);
    const today = new Date();
    return finDate < today;
  }

  // Obtener días restantes
  getDaysRemaining(fechaFin) {
    if (!fechaFin) return null;
    const finDate = new Date(fechaFin);
    const today = new Date();
    const diffTime = finDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Obtener colores para estados
  getStatusColor(status) {
    const colorMap = {
      'borrador': '#6c757d',
      'activa': '#28a745',
      'en_progreso': '#ffc107',
      'completada': '#007bff',
      'vencida': '#dc3545',
      'cancelada': '#6c757d'
    };
    return colorMap[status] || '#6c757d';
  }
}

// Crear instancia única del servicio
const evaluationService = new EvaluationService();

export default evaluationService;

// Exportar estados de evaluación
export const EVALUATION_STATES = {
  BORRADOR: 'borrador',
  ACTIVA: 'activa',
  EN_PROGRESO: 'en_progreso',
  COMPLETADA: 'completada',
  VENCIDA: 'vencida',
  CANCELADA: 'cancelada'
};