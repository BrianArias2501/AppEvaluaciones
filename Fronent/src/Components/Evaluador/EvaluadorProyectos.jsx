import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../assets/Styles/EvaluadorProyectos.css";

function EvaluadorProyectos() {
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: "",
    descripcion: "",
    instructores: 1,
    fechaEntrega: "",
    formato: "PDF",
  });

  const handleChange = (e) => {
    setNuevoProyecto({ ...nuevoProyecto, [e.target.name]: e.target.value });
  };

  const crearProyecto = (e) => {
    e.preventDefault();
    const proyecto = {
      ...nuevoProyecto,
      id: proyectos.length + 1,
      estado: "Pendiente",
    };
    setProyectos([...proyectos, proyecto]);
    setNuevoProyecto({
      nombre: "",
      descripcion: "",
      instructores: 1,
      fechaEntrega: "",
      formato: "PDF",
    });
    setMostrarFormulario(false);
  };

  return (
    <div className="evaluador-proyectos-container">
      <h2 className="titulo-proyectos">📂 Crear Proyecto</h2>
      <p className="descripcion-proyectos">
        Registra un proyecto y define los criterios de entrega y revisión.
      </p>

      <div className="crear-container">
        <button className="btn-crear" onClick={() => setMostrarFormulario(true)}>
          + Nuevo Proyecto
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-proyecto">
          <h3>📝 Datos del Proyecto</h3>
          <form onSubmit={crearProyecto}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del proyecto"
              value={nuevoProyecto.nombre}
              onChange={handleChange}
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={nuevoProyecto.descripcion}
              onChange={handleChange}
              required
            />
            <label>Cantidad de instructores (1-10):</label>
            <input
              type="number"
              name="instructores"
              min={1}
              max={10}
              value={nuevoProyecto.instructores}
              onChange={handleChange}
              required
            />
            <label>Fecha máxima de entrega:</label>
            <input
              type="date"
              name="fechaEntrega"
              value={nuevoProyecto.fechaEntrega}
              onChange={handleChange}
              required
            />
            <label>Formato permitido:</label>
            <select
              name="formato"
              value={nuevoProyecto.formato}
              onChange={handleChange}
              required
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="PPTX">PPTX</option>
            </select>

            <div className="modal-acciones">
              <button type="submit" className="btn-crear">Guardar</button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="lista-proyectos">
        {proyectos.map((proy) => (
          <div className="proyecto-card" key={proy.id}>
            <h3>{proy.nombre}</h3>
            <p><strong>Descripción:</strong> {proy.descripcion}</p>
            <p><strong>Instructores asignados:</strong> {proy.instructores}</p>
            <p><strong>Fecha máxima de entrega:</strong> {proy.fechaEntrega}</p>
            <p><strong>Formato permitido:</strong> {proy.formato}</p>
            <p><strong>Estado:</strong> {proy.estado}</p>
            <button
              className="btn-detalle"
              onClick={() => alert("Aquí podrías mostrar más detalles o acciones")}
            >
              Ver Detalle
            </button>
          </div>
        ))}
      </div>

      <div className="volver-container">
        <button className="volver-btn" onClick={() => navigate("/evaluador")}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default EvaluadorProyectos;
