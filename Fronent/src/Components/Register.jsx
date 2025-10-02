import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';
import "../assets/Styles/Login.css";
import senaLogo from "../assets/img/sena-logo.png";

function Register() {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    nombre: '',
    apellidos: '',
    rol: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensajes cuando el usuario escriba
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.correo.trim()) {
      setErrorMessage('Por favor ingrese su correo electrónico');
      return;
    }
    
    if (!formData.contraseña.trim()) {
      setErrorMessage('Por favor ingrese su contraseña');
      return;
    }
    
    if (formData.contraseña.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (formData.contraseña !== formData.confirmarContraseña) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
    
    if (!formData.nombre.trim()) {
      setErrorMessage('Por favor ingrese su nombre');
      return;
    }
    
    if (!formData.rol) {
      setErrorMessage('Por favor seleccione su rol');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const userData = {
        correo: formData.correo.trim(),
        contraseña: formData.contraseña,
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        rol: formData.rol
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setSuccessMessage('Usuario registrado exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(result.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setErrorMessage('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={senaLogo} alt="Logo SENA" className="logo-sena" />
        
        <div className="login-header">
          <h1>Registro en Nova</h1>
          <p>Crear nueva cuenta</p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message" style={{color: '#28a745', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>
            {successMessage}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            className="input-field"
            value={formData.correo}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="input-field"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos (opcional)"
            className="input-field"
            value={formData.apellidos}
            onChange={handleChange}
            disabled={isLoading}
          />
          
          <select
            name="rol"
            className="input-field"
            value={formData.rol}
            onChange={handleChange}
            disabled={isLoading}
            required
          >
            <option value="">Seleccione su rol</option>
            <option value={config.roles.STUDENT}>Aprendiz</option>
            <option value={config.roles.EVALUATOR}>Evaluador</option>
            <option value={config.roles.ADMIN}>Administrador</option>
          </select>
          
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            className="input-field"
            value={formData.contraseña}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          
          <input
            type="password"
            name="confirmarContraseña"
            placeholder="Confirmar contraseña"
            className="input-field"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login" style={{color: '#007bff', textDecoration: 'none'}}>Iniciar sesión</Link>
          </p>
          <p>© 2025 Plataforma Nova - SENA</p>
          <p><small>Versión {config.app.version}</small></p>
        </div>
      </div>
    </div>
  );
}

export default Register;