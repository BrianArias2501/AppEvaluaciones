import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

// Componente para rutas protegidas que requieren autenticación
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para rutas que requieren roles específicos
export const RoleProtectedRoute = ({ children, allowedRoles, fallbackPath = '/login' }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  const hasRequiredRole = allowedRoles.some(role => hasRole(role));
  
  if (!hasRequiredRole) {
    // Redirigir a la página apropiada según el rol del usuario
    const userRole = user?.rol;
    let redirectPath = fallbackPath;
    
    switch (userRole) {
      case config.roles.ADMIN:
        redirectPath = '/admin';
        break;
      case config.roles.EVALUATOR:
        redirectPath = '/evaluador';
        break;
      case config.roles.STUDENT:
        redirectPath = '/estudiante';
        break;
      default:
        redirectPath = '/login';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Componente específico para rutas de administrador
export const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={[config.roles.ADMIN]}>
      {children}
    </RoleProtectedRoute>
  );
};

// Componente específico para rutas de evaluador
export const EvaluatorRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={[config.roles.EVALUATOR, config.roles.ADMIN]}>
      {children}
    </RoleProtectedRoute>
  );
};

// Componente específico para rutas de estudiante
export const StudentRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={[config.roles.STUDENT]}>
      {children}
    </RoleProtectedRoute>
  );
};

// Componente para rutas que solo pueden acceder usuarios no autenticados (como login)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, redirigir según su rol
  if (isAuthenticated && user) {
    const userRole = user.rol;
    
    switch (userRole) {
      case config.roles.ADMIN:
        return <Navigate to="/admin" replace />;
      case config.roles.EVALUATOR:
        return <Navigate to="/evaluador" replace />;
      case config.roles.STUDENT:
        return <Navigate to="/estudiante" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Hook personalizado para verificar permisos
export const usePermissions = () => {
  const { user, hasRole, isAdmin, isEvaluator, isStudent } = useAuth();

  const canManageUsers = () => isAdmin();
  const canManageProjects = () => isAdmin() || isEvaluator();
  const canManageEvaluations = () => isAdmin() || isEvaluator();
  const canGradeEvaluations = () => isEvaluator();
  const canViewReports = () => isAdmin() || isEvaluator();
  const canManageRoles = () => isAdmin();
  
  const canAccessProject = (project) => {
    if (isAdmin()) return true;
    if (isEvaluator()) {
      // Los evaluadores pueden acceder a proyectos asignados a ellos
      return project?.evaluadorId === user?.id;
    }
    if (isStudent()) {
      // Los estudiantes pueden acceder a sus propios proyectos
      return project?.estudianteId === user?.id;
    }
    return false;
  };
  
  const canAccessEvaluation = (evaluation) => {
    if (isAdmin()) return true;
    if (isEvaluator()) {
      // Los evaluadores pueden acceder a evaluaciones asignadas a ellos
      return evaluation?.evaluadorId === user?.id;
    }
    if (isStudent()) {
      // Los estudiantes pueden acceder a evaluaciones donde están asignados
      return evaluation?.estudianteId === user?.id;
    }
    return false;
  };

  return {
    canManageUsers,
    canManageProjects,
    canManageEvaluations,
    canGradeEvaluations,
    canViewReports,
    canManageRoles,
    canAccessProject,
    canAccessEvaluation,
    userRole: user?.rol,
    isAdmin,
    isEvaluator,
    isStudent
  };
};

export default ProtectedRoute;