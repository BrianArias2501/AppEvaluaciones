import { useState, useRef } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/styles/EstudianteProyectos.css";
import { FaBook, FaUpload, FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EstudianteProyectos() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [proyectos, setProyectos] = useState([
    {
      id: 1,
      nombre: "Plataforma Nova",
      descripcion: "Sistema web para la gestión de proyectos del SENA.",
      estado: "En revisión",
      ultimaModificacion: "07/03/2025",
      archivo: null,
      archivoUrl: null,
      parametros: ["Innovación", "Impacto", "Viabilidad", "Claridad"],
    },
    {
      id: 2,
      nombre: "Aplicación de Tareas",
      descripcion: "App para asignar y revisar tareas escolares.",
      estado: "Aprobado",
      ultimaModificacion: "20/06/2025",
      archivo: null,
      archivoUrl: null,
      parametros: ["Usabilidad", "Funcionalidad", "Interfaz", "Cumplimiento"],
    },
  ]);

  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(null);

  const handleSubirDocumento = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !proyectoSeleccionado) return;

    const archivoUrl = URL.createObjectURL(archivo);

    const proyectosActualizados = proyectos.map((p) =>
      p.id === proyectoSeleccionado.id
        ? {
            ...p,
            archivo: archivo.name,
            archivoUrl: archivoUrl,
            ultimaModificacion: new Date().toLocaleDateString(),
          }
        : p
    );

    setProyectos(proyectosActualizados);
    alert(`📤 Se subió "${archivo.name}" al proyecto "${proyectoSeleccionado.nombre}"`);
  };

  const eliminarDocumento = (id) => {
    const proyectosActualizados = proyectos.map((p) =>
      p.id === id ? { ...p, archivo: null, archivoUrl: null } : p
    );
    setProyectos(proyectosActualizados);
  };

  return (
    <>
      <Navbar />

      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <main className="proyectos-main">
        <div className="proyectos-header">
          <FaBook className="proyectos-icon" />
          <h2>Mis Proyectos</h2>
          <p>Sube tu documento PDF, visualízalo o elimínalo si subiste uno incorrecto.</p>
        </div>

        <div className="proyectos-lista">
          {proyectos.map((p) => (
            <div className="proyecto-card" key={p.id}>
              <h3>{p.nombre}</h3>
              <p><strong>Estado:</strong> {p.estado}</p>
              <p><strong>Última modificación:</strong> {p.ultimaModificacion}</p>

              <p>
                <strong>Archivo:</strong>{" "}
                {p.archivo ? (
                  <>
                    {p.archivo}
                    <button className="btn-eliminar" onClick={() => eliminarDocumento(p.id)}>
                      <FaTrashAlt /> Eliminar
                    </button>
                  </>
                ) : (
                  "No cargado"
                )}
              </p>

              {p.archivoUrl && (
                <embed
                  src={p.archivoUrl}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                  style={{ border: "1px solid #ccc", marginTop: "1rem", borderRadius: "8px" }}
                />
              )}

              <div className="acciones">
                <button className="btn-detalle" onClick={() => setMostrarDetalle(p)}>
                  <FaInfoCircle /> Detalle del Proyecto
                </button>
                <button className="btn-subir" onClick={() => handleSubirDocumento(p)}>
                  <FaUpload /> Subir Documento
                </button>
              </div>
            </div>
          ))}
        </div>

        {mostrarDetalle && (
          <div className="modal">
            <div className="modal-content">
              <h3>📘 Detalle del Proyecto</h3>
              <p><strong>Nombre:</strong> {mostrarDetalle.nombre}</p>
              <p><strong>Descripción:</strong> {mostrarDetalle.descripcion}</p>
              <p><strong>Estado:</strong> {mostrarDetalle.estado}</p>
              <p><strong>Última modificación:</strong> {mostrarDetalle.ultimaModificacion}</p>
              <p><strong>Parámetros:</strong></p>
              <ul>
                {mostrarDetalle.parametros.map((param, idx) => (
                  <li key={idx}>✔️ {param}</li>
                ))}
              </ul>
              <button className="btn-cancelar" onClick={() => setMostrarDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        )}

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

export default EstudianteProyectos;
