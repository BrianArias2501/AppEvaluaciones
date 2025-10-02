import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/Styles/EstudianteNotas.css";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EstudianteNotas() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="notas-main">
        <div className="notas-header">
          <FaChartBar className="notas-icon" />
          <h2>Notas</h2>
          <p>Visualiza tus calificaciones acumuladas por proyecto.</p>
        </div>

        <div className="notas-table-container">
          <table className="notas-table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Evaluador</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>App de Clima</td>
                <td>Juan Pérez</td>
                <td>4.2</td>
              </tr>
              <tr>
                <td>Sistema Nova</td>
                <td>Laura Gómez</td>
                <td>4.8</td>
              </tr>
              <tr>
                <td>Gestión Tareas</td>
                <td>Andrés Ruiz</td>
                <td>4.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="volver-container">
          <button className="volver-btn" onClick={() => navigate("/estudiante")}>
            ← Volver
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default EstudianteNotas;
