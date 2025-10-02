import { useNavigate } from "react-router-dom";
import { FaCertificate, FaFileDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "../../assets/styles/EvaluadorCertificado.css";

function EvaluadorCertificado() {
  const navigate = useNavigate();

  const proyectosCalificados = [
    { nombre: "Sistema de Inventario", ficha: "2823620", fecha: "05/06/2025" },
    { nombre: "App Clima", ficha: "2815678", fecha: "22/06/2025" },
  ];

  const generarCertificado = (proyecto) => {
    const doc = new jsPDF("landscape", "mm", "a4");

    doc.setLineWidth(2);
    doc.setDrawColor(10, 128, 70);
    doc.rect(10, 10, 277, 190);

    doc.setFont("times", "bold");
    doc.setFontSize(26);
    doc.text("SISTEMA NOVA", 148.5, 35, null, null, "center");

    doc.setFontSize(22);
    doc.text("CERTIFICADO DE EVALUACIÓN", 148.5, 50, null, null, "center");

    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.text(
      "El presente diploma certifica que el evaluador ha participado en la evaluación del proyecto:",
      148.5,
      70,
      null,
      null,
      "center"
    );

    doc.setFont("times", "bolditalic");
    doc.setFontSize(18);
    doc.text(`"${proyecto.nombre}"`, 148.5, 85, null, null, "center");

    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.text(`Ficha del grupo: ${proyecto.ficha}`, 148.5, 100, null, null, "center");
    doc.text(`Fecha de evaluación: ${proyecto.fecha}`, 148.5, 110, null, null, "center");

    doc.line(60, 150, 120, 150);
    doc.text("Firma del Coordinador", 90, 158, null, null, "center");

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Certificado generado automáticamente por el Sistema Nova",
      148.5,
      180,
      null,
      null,
      "center"
    );

    doc.save(`Certificado_Evaluador_${proyecto.nombre}.pdf`);
  };

  return (
    <div className="evaluador-certificado-container">
      <h2 className="titulo-certificado">📄 Certificado de Participación</h2>
      <p className="descripcion-certificado">
        Descarga tu certificado por cada proyecto evaluado.
      </p>

      <div className="certificados-lista">
        {proyectosCalificados.map((proyecto, idx) => (
          <div className="certificado-card" key={idx}>
            <h3>{proyecto.nombre}</h3>
            <p><strong>Ficha:</strong> {proyecto.ficha}</p>
            <p><strong>Fecha:</strong> {proyecto.fecha}</p>

            <button
              className="btn-descargar"
              onClick={() => generarCertificado(proyecto)}
            >
              <FaFileDownload /> Descargar Certificado
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

export default EvaluadorCertificado;
