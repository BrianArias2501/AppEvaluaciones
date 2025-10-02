import { apiUtils } from './api';

class GradeService {
  // Crear nueva calificación
  async createGrade(gradeData) {
    try {
      const response = await apiUtils.post('/calificaciones', gradeData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al crear calificación');
    }
  }

  // Crear múltiples calificaciones
  async createBulkGrades(gradesData) {
    try {
      const response = await apiUtils.post('/calificaciones/bulk', gradesData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al crear calificaciones');
    }
  }

  // Obtener todas las calificaciones (solo administradores)
  async getAllGrades(filters = {}) {
    try {
      const response = await apiUtils.get('/calificaciones', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener calificaciones');
    }
  }

  // Obtener mis calificaciones (calificaciones del usuario actual)
  async getMyGrades(filters = {}) {
    try {
      const response = await apiUtils.get('/calificaciones/mis-calificaciones', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener mis calificaciones');
    }
  }

  // Obtener calificaciones por evaluación
  async getGradesByEvaluation(evaluationId, filters = {}) {
    try {
      const response = await apiUtils.get(`/calificaciones/evaluacion/${evaluationId}`, { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener calificaciones de la evaluación');
    }
  }

  // Obtener promedio por evaluación
  async getAverageByEvaluation(evaluationId) {
    try {
      const response = await apiUtils.get(`/calificaciones/evaluacion/${evaluationId}/promedio`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener promedio de evaluación');
    }
  }

  // Obtener estadísticas por evaluación
  async getStatisticsByEvaluation(evaluationId) {
    try {
      const response = await apiUtils.get(`/calificaciones/evaluacion/${evaluationId}/estadisticas`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener estadísticas de evaluación');
    }
  }

  // Obtener calificación por ID
  async getGradeById(id) {
    try {
      const response = await apiUtils.get(`/calificaciones/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener calificación');
    }
  }

  // Actualizar calificación
  async updateGrade(id, gradeData) {
    try {
      const response = await apiUtils.put(`/calificaciones/${id}`, gradeData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar calificación');
    }
  }

  // Eliminar calificación
  async deleteGrade(id) {
    try {
      const response = await apiUtils.delete(`/calificaciones/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar calificación');
    }
  }

  // Eliminar calificaciones por evaluación
  async deleteGradesByEvaluation(evaluationId) {
    try {
      const response = await apiUtils.delete(`/calificaciones/evaluacion/${evaluationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar calificaciones de la evaluación');
    }
  }

  // Validar datos de calificación
  validateGradeData(gradeData) {
    const errors = [];

    if (!gradeData.evaluacionId) {
      errors.push('Debe especificar una evaluación');
    }

    if (!gradeData.estudianteId) {
      errors.push('Debe especificar un estudiante');
    }

    if (gradeData.nota === undefined || gradeData.nota === null) {
      errors.push('Debe especificar una nota');
    } else {
      const nota = parseFloat(gradeData.nota);
      if (isNaN(nota) || nota < 0 || nota > 5) {
        errors.push('La nota debe ser un número entre 0 y 5');
      }
    }

    if (gradeData.criterios && Array.isArray(gradeData.criterios)) {
      gradeData.criterios.forEach((criterio, index) => {
        if (!criterio.nombre || criterio.nombre.trim().length === 0) {
          errors.push(`El criterio ${index + 1} debe tener un nombre`);
        }
        if (criterio.nota === undefined || criterio.nota === null) {
          errors.push(`El criterio ${index + 1} debe tener una nota`);
        } else {
          const nota = parseFloat(criterio.nota);
          if (isNaN(nota) || nota < 0 || nota > 5) {
            errors.push(`La nota del criterio ${index + 1} debe ser un número entre 0 y 5`);
          }
        }
      });
    }

    return errors;
  }

  // Calcular nota final basada en criterios
  calculateFinalGrade(criterios) {
    if (!criterios || criterios.length === 0) {
      return 0;
    }

    const totalPeso = criterios.reduce((sum, criterio) => sum + (criterio.peso || 1), 0);
    const notaPonderada = criterios.reduce((sum, criterio) => {
      const peso = criterio.peso || 1;
      const nota = parseFloat(criterio.nota) || 0;
      return sum + (nota * peso);
    }, 0);

    return totalPeso > 0 ? (notaPonderada / totalPeso) : 0;
  }

  // Formatear calificación para mostrar
  formatGradeForDisplay(grade) {
    return {
      ...grade,
      notaFormatted: this.formatGrade(grade.nota),
      fechaCalificacionFormatted: this.formatDate(grade.fechaCalificacion),
      estadoFormatted: this.getGradeStatus(grade.nota),
      colorClass: this.getGradeColor(grade.nota)
    };
  }

  // Formatear nota
  formatGrade(nota) {
    if (nota === undefined || nota === null) return 'Sin calificar';
    return parseFloat(nota).toFixed(2);
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

  // Obtener estado de la calificación
  getGradeStatus(nota) {
    if (nota === undefined || nota === null) return 'Sin calificar';
    const notaNum = parseFloat(nota);
    if (notaNum >= 3.5) return 'Aprobado';
    if (notaNum >= 3.0) return 'Aprobado (Límite)';
    return 'Reprobado';
  }

  // Obtener color para la calificación
  getGradeColor(nota) {
    if (nota === undefined || nota === null) return 'text-muted';
    const notaNum = parseFloat(nota);
    if (notaNum >= 4.0) return 'text-success';
    if (notaNum >= 3.5) return 'text-info';
    if (notaNum >= 3.0) return 'text-warning';
    return 'text-danger';
  }

  // Obtener estadísticas de un conjunto de calificaciones
  calculateStatistics(grades) {
    if (!grades || grades.length === 0) {
      return {
        total: 0,
        promedio: 0,
        aprobados: 0,
        reprobados: 0,
        porcentajeAprobacion: 0,
        notaMaxima: 0,
        notaMinima: 0
      };
    }

    const notas = grades.map(g => parseFloat(g.nota)).filter(n => !isNaN(n));
    const total = notas.length;
    const suma = notas.reduce((sum, nota) => sum + nota, 0);
    const promedio = total > 0 ? suma / total : 0;
    const aprobados = notas.filter(nota => nota >= 3.0).length;
    const reprobados = total - aprobados;
    const porcentajeAprobacion = total > 0 ? (aprobados / total) * 100 : 0;
    const notaMaxima = total > 0 ? Math.max(...notas) : 0;
    const notaMinima = total > 0 ? Math.min(...notas) : 0;

    return {
      total,
      promedio: parseFloat(promedio.toFixed(2)),
      aprobados,
      reprobados,
      porcentajeAprobacion: parseFloat(porcentajeAprobacion.toFixed(2)),
      notaMaxima: parseFloat(notaMaxima.toFixed(2)),
      notaMinima: parseFloat(notaMinima.toFixed(2))
    };
  }
}

// Crear instancia única del servicio
const gradeService = new GradeService();

export default gradeService;

// Exportar constantes de calificación
export const GRADE_CONSTANTS = {
  MIN_GRADE: 0,
  MAX_GRADE: 5,
  PASSING_GRADE: 3.0,
  GOOD_GRADE: 3.5,
  EXCELLENT_GRADE: 4.0
};