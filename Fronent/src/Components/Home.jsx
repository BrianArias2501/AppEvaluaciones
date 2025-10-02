import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import portadaImg from "../assets/img/portada.png";
import "../assets/Styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [mostrarContacto, setMostrarContacto] = useState(false);

  const manejarContacto = () => {
    setMostrarContacto(true);
    setTimeout(() => {
      document
        .getElementById("formulario-contacto")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="home">
      {/* Hero principal */}
      <section className="home-hero">
        <div className="home-texto">
          <h1>Transformando la Evaluación Educativa</h1>
          <p>
            Plataforma especializada en la gestión de proyectos investigativos y pedagógicos.
          </p>
          <div className="botones-acciones">
            <button className="boton-principal" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
            <button className="boton-principal" onClick={manejarContacto}>
              Contáctanos
            </button>
          </div>
        </div>
        <div className="home-img">
          <img src={portadaImg} alt="Portada" />
        </div>
      </section>

      {/* Beneficios */}
      <section className="beneficios">
        <h2>Nuestros Beneficios</h2>
        <hr />
        <div className="beneficios-grid">
          <div className="beneficio">
            <span className="icono">📊</span>
            <h3>Evaluación Unificada</h3>
            <p>Sistema centralizado para todos los criterios de evaluación.</p>
          </div>
          <div className="beneficio">
            <span className="icono">⚡</span>
            <h3>Automatización</h3>
            <p>Generación automática de certificados y reportes.</p>
          </div>
          <div className="beneficio">
            <span className="icono">👁️</span>
            <h3>Transparencia</h3>
            <p>Seguimiento en tiempo real del proceso.</p>
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      {mostrarContacto && (
        <section id="formulario-contacto" className="contact-form">
          <h2>Contáctanos</h2>
          <form>
            <label>Nombre completo</label>
            <input type="text" name="nombre" required />

            <label>Correo electrónico</label>
            <input type="email" name="correo" required />

            <label>Mensaje</label>
            <textarea name="mensaje" rows="5" required />

            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              placeholder="Ejemplo: 3001234567"
              pattern="[0-9]{10}"
            />

            <label>Ciudad</label>
            <input type="text" name="ciudad" />

            <label>Preferencia de contacto</label>
            <select name="preferencia">
              <option>Correo electrónico</option>
              <option>Llamada telefónica</option>
              <option>WhatsApp</option>
            </select>

            <button type="submit" className="boton-principal">Enviar</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Home;


