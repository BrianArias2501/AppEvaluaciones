import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';
import "../assets/Styles/Login.css";
import senaLogo from "../assets/img/sena-logo.png";

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const user = JSON.parse(localStorage.getItem(config.auth.userKey));
      redirectByRole(user?.rol);
    }
  }, [isAuthenticated, loading, navigate]);

  // Limpiar errores cuando cambian los campos
  useEffect(() => {
    if (error || errorMessage) {
      clearError();
      setErrorMessage('');
    }
  }, [usuario, contrasena, rol]);

  const redirectByRole = (role) => {
    switch(role) {
      case config.roles.ADMIN:
        navigate('/admin');
        break;
      case config.roles.EVALUATOR:
        navigate('/evaluador');
        break;
      case config.roles.STUDENT:
        navigate('/estudiante');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!usuario.trim()) {
      setErrorMessage('Por favor ingrese su usuario');
      return;
    }
    
    if (!contrasena.trim()) {
      setErrorMessage('Por favor ingrese su contraseña');
      return;
    }
    
    if (!rol) {
      setErrorMessage('Por favor seleccione su rol');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const credentials = {
        usuario: usuario.trim(),
        contrasena: contrasena,
        rol: rol
      };
      
      const result = await login(credentials);
      
      if (result.success) {
        // El redireccionamiento se maneja en el useEffect
        redirectByRole(result.user.rol);
      } else {
        setErrorMessage(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setErrorMessage('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si está inicializando la autenticación
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="loading-message">
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={senaLogo} alt="Logo SENA" className="logo-sena" /> {/* Logo */}
        
        <div className="login-header">
          <h1>Bienvenido a Nova</h1>
          <p>Plataforma de gestión de proyectos</p>
        </div>

        {(errorMessage || error) && (
          <div className="error-message">
            {errorMessage || error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            className="input-field"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          <select
            className="input-field"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="">Seleccione su rol</option>
            <option value={config.roles.STUDENT}>Aprendiz</option>
            <option value={config.roles.EVALUATOR}>Evaluador</option>
            <option value={config.roles.ADMIN}>Administrador</option>
          </select>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !usuario.trim() || !contrasena.trim() || !rol}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="register-link">
          <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>

        <div className="login-footer">
          <p>© 2025 Plataforma Nova - SENA</p>
          <p><small>Versión {config.app.version}</small></p>
        </div>
      </div>
    </div>
  );
}

export default Login;


