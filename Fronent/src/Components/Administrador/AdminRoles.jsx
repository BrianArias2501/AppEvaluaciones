import { useNavigate } from "react-router-dom";
import "../../assets/Styles/AdminRoles.css";

function AdminRoles() {
  const navigate = useNavigate();

  return (
    <div className="admin-roles-container">
      <h2 className="titulo-roles">🔐 Control de Roles</h2>
      <p className="descripcion-roles">
        Asigna permisos y roles a cada usuario según su perfil.
      </p>

      <div className="roles-tabla">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol Actual</th>
              <th>Nuevo Rol</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>Estudiante</td>
              <td>
                <select>
                  <option>Estudiante</option>
                  <option>Evaluador</option>
                  <option>Admin</option>
                  <option>Inactivo</option>
                </select>
              </td>
              <td>
                <button className="btn-asignar">Asignar</button>
              </td>
            </tr>
            <tr>
              <td>Laura Gómez</td>
              <td>Evaluador</td>
              <td>
                <select>
                  <option>Estudiante</option>
                  <option>Evaluador</option>
                  <option>Admin</option>
                  <option>Inactivo</option>
                </select>
              </td>
              <td>
                <button className="btn-asignar">Asignar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="volver-container">
        <button className="volver-btn" onClick={() => navigate("/admin")}>
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default AdminRoles;


