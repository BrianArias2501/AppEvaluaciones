import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/Styles/EstudianteCertificado.css";
import { FaFileDownload, FaCertificate } from "react-icons/fa";
import jsPDF from "jspdf";

function EstudianteCertificado() {
  const navigate = useNavigate();

  
  const proyectos = [
    { nombre: "Sistema de Inventario", estado: "Aprobado", fecha: "10/05/2025" },
    { nombre: "Plataforma Nova", estado: "Rechazado", fecha: "25/06/2025" },
    { nombre: "App Clima", estado: "En revisión", fecha: "08/07/2025" },
  ];

  const proyectosElegibles = proyectos.filter(
    (p) => p.estado === "Aprobado" || p.estado === "Rechazado"
  );

  const descargarCertificado = (proyecto) => {
    const doc = new jsPDF("landscape", "mm", "a4");

    
    doc.setLineWidth(2);
    doc.setDrawColor(10, 128, 70);
    doc.rect(10, 10, 277, 190);

  
    doc.setFont("times", "bold");
    doc.setFontSize(26);
    doc.text("SISTEMA NOVA", 148.5, 35, null, null, "center");

    doc.setFontSize(22);
    doc.text("CERTIFICADO DE PARTICIPACIÓN", 148.5, 50, null, null, "center");

    
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.text(
      "El presente diploma certifica que el estudiante ha participado en el proyecto:",
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
    doc.text(`Estado del proyecto: ${proyecto.estado}`, 148.5, 100, null, null, "center");
    doc.text(`Fecha de evaluación: ${proyecto.fecha}`, 148.5, 110, null, null, "center");

  
    doc.line(60, 150, 120, 150);
    doc.text("Firma del evaluador", 90, 158, null, null, "center");

    
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

    doc.save(`Certificado_${proyecto.nombre}.pdf`);
  };

  return (
    <>
      <Navbar />
      <main className="certificado-main">
        <div className="certificado-header">
          <FaCertificate className="certificado-icon" />
          <h2>Certificados de Proyectos</h2>
          <p>Descarga tu certificado si tu proyecto fue aprobado o rechazado.</p>
        </div>

        <div className="certificados-lista">
          {proyectosElegibles.map((p, idx) => (
            <div className="certificado-card" key={idx}>
              <h3>{p.nombre}</h3>
              <p><strong>Estado:</strong> {p.estado}</p>
              <p><strong>Fecha:</strong> {p.fecha}</p>
              <button className="btn-descargar" onClick={() => descargarCertificado(p)}>
                <FaFileDownload /> Descargar Certificado
              </button>
            </div>
          ))}
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

export default EstudianteCertificado;

