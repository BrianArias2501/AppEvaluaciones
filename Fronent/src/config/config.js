// Configuración centralizada de la aplicación
const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: 10000, // 10 segundos
    retries: 3
  },

  // JWT Configuration
  auth: {
    tokenKey: import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token',
    userKey: import.meta.env.VITE_USER_STORAGE_KEY || 'user_data',
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    refreshThreshold: 5 * 60 * 1000 // 5 minutos antes de expirar
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Sistema de Evaluaciones',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_NODE_ENV || 'development',
    debug: import.meta.env.VITE_DEBUG === 'true' || false
  },

  // UI Configuration
  ui: {
    itemsPerPage: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    datetimeFormat: 'DD/MM/YYYY HH:mm'
  },

  // Validation Rules
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    names: {
      minLength: 2,
      maxLength: 50
    },
    project: {
      nameMinLength: 3,
      nameMaxLength: 100,
      descriptionMinLength: 10,
      descriptionMaxLength: 1000
    },
    evaluation: {
      nameMinLength: 3,
      nameMaxLength: 100,
      descriptionMinLength: 10,
      descriptionMaxLength: 1000
    }
  },

  // Grade Configuration
  grades: {
    minGrade: 0,
    maxGrade: 5,
    passingGrade: 3.0,
    goodGrade: 3.5,
    excellentGrade: 4.0,
    decimalPlaces: 2
  },

  // Roles Configuration
  roles: {
    ADMIN: 'administrador',
    EVALUATOR: 'evaluador',
    STUDENT: 'estudiante'
  },

  // Status Configuration
  status: {
    project: {
      DRAFT: 'borrador',
      ACTIVE: 'activo',
      IN_EVALUATION: 'en_evaluacion',
      COMPLETED: 'completado',
      CANCELLED: 'cancelado'
    },
    evaluation: {
      DRAFT: 'borrador',
      ACTIVE: 'activa',
      IN_PROGRESS: 'en_progreso',
      COMPLETED: 'completada',
      OVERDUE: 'vencida',
      CANCELLED: 'cancelada'
    }
  },

  // Error Messages
  errors: {
    network: 'Error de conexión. Verifique su conexión a internet.',
    unauthorized: 'No tiene permisos para realizar esta acción.',
    forbidden: 'Acceso denegado.',
    notFound: 'El recurso solicitado no fue encontrado.',
    serverError: 'Error interno del servidor. Intente nuevamente.',
    validation: 'Los datos ingresados no son válidos.',
    timeout: 'La solicitud ha excedido el tiempo límite.',
    unknown: 'Ha ocurrido un error inesperado.'
  },

  // Success Messages
  success: {
    created: 'Creado exitosamente.',
    updated: 'Actualizado exitosamente.',
    deleted: 'Eliminado exitosamente.',
    saved: 'Guardado exitosamente.',
    login: 'Inicio de sesión exitoso.',
    logout: 'Sesión cerrada exitosamente.',
    passwordChanged: 'Contraseña cambiada exitosamente.'
  },

  // Routes Configuration
  routes: {
    home: '/',
    login: '/login',
    dashboard: {
      admin: '/admin',
      evaluator: '/evaluador',
      student: '/estudiante'
    },
    projects: '/proyectos',
    evaluations: '/evaluaciones',
    grades: '/calificaciones',
    users: '/usuarios',
    reports: '/reportes',
    profile: '/perfil'
  }
};

// Función para obtener configuración por clave
export const getConfig = (key) => {
  const keys = key.split('.');
  let value = config;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = () => {
  return config.app.environment === 'development';
};

// Función para verificar si el debug está habilitado
export const isDebugEnabled = () => {
  return config.app.debug;
};

// Función para log de debug
export const debugLog = (...args) => {
  if (isDebugEnabled()) {
    console.log('[DEBUG]', ...args);
  }
};

export default config;