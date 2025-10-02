import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/styles/EstudianteCrearProyecto.css";
import { FaFolderOpen, FaSave, FaTimes } from "react-icons/fa";
import projectService from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";

function EstudianteCrearProyecto() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [proyecto, setProyecto] = useState({
    nombre: "",
    descripcion: "",
    instructores: [""],
    fechaEntrega: "",
    formato: "PDF"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProyecto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstructorChange = (index, value) => {
    const nuevosInstructores = [...proyecto.instructores];
    nuevosInstructores[index] = value;
    setProyecto(prev => ({
      ...prev,
      instructores: nuevosInstructores
    }));
  };

  const agregarInstructor = () => {
    if (proyecto.instructores.length < 5) {
      setProyecto(prev => ({
        ...prev,
        instructores: [...prev.instructores, ""]
      }));
    }
  };

  const eliminarInstructor = (index) => {
    if (proyecto.instructores.length > 1) {
      const nuevosInstructores = proyecto.instructores.filter((_, i) => i !== index);
      setProyecto(prev => ({
        ...prev,
        instructores: nuevosInstructores
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Filtrar instructores vacíos
      const instructoresFiltrados = proyecto.instructores.filter(inst => inst.trim() !== "");
      
      const proyectoData = {
        nombre: proyecto.nombre.trim(),
        descripcion: proyecto.descripcion.trim(),
        instructores: instructoresFiltrados.length > 0 ? instructoresFiltrados : undefined,
        fechaEntrega: proyecto.fechaEntrega || undefined,
        formato: proyecto.formato
      };

      const response = await projectService.createProject(proyectoData);
      
      setSuccess("¡Proyecto creado exitosamente!");
      
      // Limpiar formulario
      setProyecto({
        nombre: "",
        descripcion: "",
        instructores: [""],
        fechaEntrega: "",
        formato: "PDF"
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/estudiante/proyectos");
      }, 2000);

    } catch (err) {
      setError(err.message || "Error al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="crear-proyecto-main">
        <div className="crear-proyecto-header">
          <FaFolderOpen className="crear-proyecto-icon" />
          <h2>Crear Nuevo Proyecto</h2>
          <p>Completa la información para registrar tu proyecto académico.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <strong>Éxito:</strong> {success}
          </div>
        )}

        <form className="crear-proyecto-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Proyecto *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={proyecto.nombre}
              onChange={handleChange}
              placeholder="Ej: Sistema de Gestión de Inventario"
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción del Proyecto *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={proyecto.descripcion}
              onChange={handleChange}
              placeholder="Describe detalladamente tu proyecto, objetivos, tecnologías a usar, etc."
              required
              minLength={10}
              maxLength={2000}
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Instructores del Proyecto</label>
            {proyecto.instructores.map((instructor, index) => (
              <div key={index} className="instructor-input-group">
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => handleInstructorChange(index, e.target.value)}
                  placeholder={`Nombre del instructor ${index + 1}`}
                />
                {proyecto.instructores.length > 1 && (
                  <button
                    type="button"
                    className="btn-eliminar-instructor"
                    onClick={() => eliminarInstructor(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            {proyecto.instructores.length < 5 && (
              <button
                type="button"
                className="btn-agregar-instructor"
                onClick={agregarInstructor}
              >
                + Agregar Instructor
              </button>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fechaEntrega">Fecha de Entrega</label>
            <input
              type="date"
              id="fechaEntrega"
              name="fechaEntrega"
              value={proyecto.fechaEntrega}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="formato">Formato del Proyecto</label>
            <select
              id="formato"
              name="formato"
              value={proyecto.formato}
              onChange={handleChange}
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="PPTX">PPTX</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-crear-proyecto"
              disabled={loading}
            >
              <FaSave />
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
            
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate("/estudiante")}
              disabled={loading}
            >
              <FaTimes />
              Cancelar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export default EstudianteCrearProyecto;