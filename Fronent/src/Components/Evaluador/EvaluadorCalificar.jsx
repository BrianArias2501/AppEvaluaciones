import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Styles/EvaluadorCalificar.css";

function EvaluadorCalificar() {
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState({
    nombre: "Sistema de Inventario",
    descripcion: "Una aplicación para gestionar productos, stock y proveedores.",
    estado: "En revisión",
    calificacion: "",
    observaciones: "",
    ficha: "",
  });

  const fichasDisponibles = [
    { grupo: "Análisis y Desarrollo de Software", ficha: "2823620" },
    { grupo: "Automatización Industrial", ficha: "2537894" },
    { grupo: "Diseño Gráfico Digital", ficha: "2914052" },
    { grupo: "Gestión Empresarial", ficha: "2745128" },
  ];

  const handleChange = (e) => {
    setProyecto({
      ...proyecto,
      [e.target.name]: e.target.value,
    });
  };

  const guardarEvaluacion = () => {
    const { calificacion, observaciones, ficha } = proyecto;

    if (!calificacion || !observaciones || !ficha) {
      alert("Por favor completa todos los campos.");
      return;
    }

    alert(`✅ Evaluación guardada correctamente:
- Ficha: ${ficha}
- Calificación: ${calificacion}/5
- Observaciones: ${observaciones}`);
    
  };

  return (
    <div className="evaluador-calificar-container">
      <h2 className="titulo-evaluacion">✅ Calificar Proyecto</h2>
      <p className="descripcion-evaluacion">Aquí podrás evaluar los proyectos asignados.</p>

      <div className="proyecto-card">
        <h3>{proyecto.nombre}</h3>
        <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
        <p><strong>Estado:</strong> {proyecto.estado}</p>

        <label>Ficha del Programa:</label>
        <select name="ficha" value={proyecto.ficha} onChange={handleChange}>
          <option value="">Selecciona una ficha</option>
          {fichasDisponibles.map((f, idx) => (
            <option key={idx} value={f.ficha}>
              {f.grupo} - Ficha {f.ficha}
            </option>
          ))}
        </select>

        <label>Calificación (1 a 5):</label>
        <select name="calificacion" value={proyecto.calificacion} onChange={handleChange}>
          <option value="">Selecciona una calificación</option>
          <option value="1">1 - Muy Bajo</option>
          <option value="2">2 - Bajo</option>
          <option value="3">3 - Aceptable</option>
          <option value="4">4 - Bueno</option>
          <option value="5">5 - Excelente</option>
        </select>

        <label>Observaciones:</label>
        <textarea
          name="observaciones"
          rows="4"
          value={proyecto.observaciones}
          onChange={handleChange}
        />

        <button className="btn-guardar" onClick={guardarEvaluacion}>
          Guardar Evaluación
        </button>
      </div>

      <div className="volver-container">
        <button className="volver-btn" onClick={() => navigate("/evaluador")}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default EvaluadorCalificar;


