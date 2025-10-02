import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import "../../assets/styles/AdminUsuarios.css";

function AdminUsuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Ana", correo: "ana@sena.edu.co", rol: "Admin", contraseña: "123456" },
    { id: 2, nombre: "Luis", correo: "luis@sena.edu.co", rol: "Evaluador", contraseña: "abcdef" },
    { id: 3, nombre: "Sofía", correo: "sofia@sena.edu.co", rol: "Estudiante", contraseña: "qwerty" },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    rol: "Estudiante",
    contraseña: "",
  });

  const handleInputChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const crearUsuario = (e) => {
    e.preventDefault();
    const nuevo = {
      ...nuevoUsuario,
      id: usuarios.length + 1,
    };
    setUsuarios([...usuarios, nuevo]);
    setMostrarModal(false);
    setNuevoUsuario({ nombre: "", correo: "", rol: "Estudiante", contraseña: "" });
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  const editarUsuario = (id) => {
    alert(`Función para editar usuario con ID ${id}`);
  };

  return (
    <div className="admin-usuarios-container">
      <h2 className="titulo">👥 Gestión de Usuarios</h2>
      <p className="descripcion">Aquí puedes crear, editar o eliminar usuarios del sistema.</p>

      <div className="crear-container">
        <button onClick={() => setMostrarModal(true)} className="btn-crear">
          <FaPlusCircle /> Crear Usuario
        </button>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>{u.contraseña}</td>
              <td>
                <button onClick={() => editarUsuario(u.id)} className="btn-editar">
                  <FaUserEdit />
                </button>
                <button onClick={() => eliminarUsuario(u.id)} className="btn-eliminar">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>📝 Nuevo Usuario</h3>
            <form onSubmit={crearUsuario}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo"
                value={nuevoUsuario.correo}
                onChange={handleInputChange}
                required
              />
              <select name="rol" value={nuevoUsuario.rol} onChange={handleInputChange}>
                <option value="Admin">Admin</option>
                <option value="Evaluador">Evaluador</option>
                <option value="Estudiante">Estudiante</option>
              </select>
              <input
                type="password"
                name="contraseña"
                placeholder="Contraseña"
                value={nuevoUsuario.contraseña}
                onChange={handleInputChange}
                required
              />
              <div className="modal-acciones">
                <button type="submit" className="btn-crear">Guardar</button>
                <button onClick={() => setMostrarModal(false)} type="button" className="btn-cancelar">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="volver-container">
        <button className="volver-btn" onClick={() => navigate("/admin")}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default AdminUsuarios;
