import { useNavigate } from "react-router-dom";
import "../../assets/Styles/AdminReportes.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminReportes() {
  const navigate = useNavigate();

  const reportes = [
    { id: 1, usuario: "Ana López", proyecto: "Inventario", estado: "Aprobado", fecha: "10/07/2025" },
    { id: 2, usuario: "Carlos Ruiz", proyecto: "Nova", estado: "Rechazado", fecha: "08/07/2025" },
    { id: 3, usuario: "Sofía Martínez", proyecto: "ClimaApp", estado: "En revisión", fecha: "06/07/2025" },
  ];

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📊 Reporte de Evaluaciones", 105, 20, null, null, "center");

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Usuario", "Proyecto", "Estado", "Fecha"]],
      body: reportes.map((r) => [r.id, r.usuario, r.proyecto, r.estado, r.fecha]),
    });

    doc.save("Reporte_Evaluaciones.pdf");
  };

  const exportarCSV = () => {
    const encabezados = ["ID", "Usuario", "Proyecto", "Estado", "Fecha"];
    const filas = reportes.map((r) => [r.id, r.usuario, r.proyecto, r.estado, r.fecha]);

    let csv = encabezados.join(",") + "\n";
    filas.forEach((fila) => {
      csv += fila.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Reporte_Evaluaciones.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reportes-container">
      <h2 className="titulo-reportes">📊 Reportes</h2>
      <p className="descripcion-reportes">Consulta los reportes generados de actividades y evaluaciones.</p>

      <div className="acciones-reportes">
        <button onClick={exportarPDF} className="btn-exportar">Exportar a PDF</button>
        <button onClick={exportarCSV} className="btn-exportar">Exportar a Excel</button>
      </div>

      <table className="tabla-reportes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Proyecto</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.usuario}</td>
              <td>{r.proyecto}</td>
              <td>{r.estado}</td>
              <td>{r.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="volver-container">
        <button className="volver-btn" onClick={() => navigate("/admin")}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default AdminReportes;

