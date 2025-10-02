import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/styles/EstudianteEvaluaciones.css";
import { FaClipboardCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

function EstudianteEvaluaciones() {
  const navigate = useNavigate(); 

  return (
    <>
      <Navbar />

      <main className="evaluaciones-main">
        <div className="evaluaciones-header">
          <FaClipboardCheck className="evaluaciones-icon" />
          <h2>Evaluaciones</h2>
          <p>Consulta los comentarios y notas de los evaluadores sobre tus proyectos.</p>
        </div>

        <div className="evaluaciones-content">
          <div className="evaluacion-card">
            <h3>Proyecto: App de Clima</h3>
            <p><strong>Evaluador:</strong> Juan Pérez</p>
            <p><strong>Comentario:</strong> Buen uso de APIs, faltó validación de errores.</p>
            <p><strong>Nota:</strong> 4.2 / 5.0</p>
          </div>

          <div className="evaluacion-card">
            <h3>Proyecto: Sistema Nova</h3>
            <p><strong>Evaluador:</strong> Laura Gómez</p>
            <p><strong>Comentario:</strong> Excelente interfaz y funcionalidad.</p>
            <p><strong>Nota:</strong> 4.8 / 5.0</p>
          </div>

          <div className="volver-container">
            <button
              className="volver-btn"
              onClick={() => navigate("/estudiante")}  
            >
              ← Volver
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default EstudianteEvaluaciones;
