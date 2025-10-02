import { useNavigate } from "react-router-dom";
import "../../assets/Styles/EvaluadorHistorial.css";

function EvaluadorHistorial() {
  const navigate = useNavigate();

  const evaluaciones = [
    {
      id: 1,
      proyecto: "Sistema de Inventario",
      fecha: "2025-06-15",
      nota: 5,
      observaciones: "Buen desarrollo y documentación clara.",
    },
    {
      id: 2,
      proyecto: "App de Citas Médicas",
      fecha: "2025-05-30",
      nota: 2,
      observaciones: "Falta implementación de seguridad.",
    },
  ];

  return (
    <div className="evaluador-historial-container">
      <h2 className="titulo-historial">📜 Historial de Evaluaciones</h2>
      <p className="descripcion-historial">
        Consulta aquí los proyectos que ya has evaluado.
      </p>

      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Fecha</th>
            <th>Nota</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.proyecto}</td>
              <td>{ev.fecha}</td>
              <td>{ev.nota}/5</td>
              <td>{ev.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="volver-container">
        <button className="volver-btn" onClick={() => navigate("/evaluador")}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default EvaluadorHistorial;

