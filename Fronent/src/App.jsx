import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import EvaluadorDashboard from "./Components/Evaluador/EvaluadorDashboard";
import EstudianteDashboard from "./Components/Estudiante/EstudianteDashboard";
import AdminDashboard from "./Components/Administrador/AdminDashboard";
import EvaluadorProyectos from "./Components/Evaluador/EvaluadorProyectos";
import EvaluadorCalificar from "./Components/Evaluador/EvaluadorCalificar";
import EvaluadorHistorial from "./Components/Evaluador/EvaluadorHistorial";
import EvaluadorCertificado from "./Components/Evaluador/EvaluadorCertificado";
import EstudianteProyectos from "./Components/Estudiante/EstudianteProyectos";
import EstudianteCrearProyecto from "./Components/Estudiante/EstudianteCrearProyecto";
import EstudianteEvaluaciones from "./Components/Estudiante/EstudianteEvaluaciones";
import EstudianteNotas from "./Components/Estudiante/EstudianteNotas";
import EstudianteCertificado from "./Components/Estudiante/EstudianteCertificado";
import AdminUsuarios from "./Components/Administrador/AdminUsuarios";
import AdminReportes from "./Components/Administrador/AdminReportes";
import AdminRoles from "./Components/Administrador/AdminRoles";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route path="/evaluador" element={<EvaluadorDashboard />} />
          <Route path="/estudiante" element={<EstudianteDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          
          <Route path="/evaluador/proyectos" element={<EvaluadorProyectos />} />
          <Route path="/evaluador/calificar" element={<EvaluadorCalificar />} />
          <Route path="/evaluador/historial" element={<EvaluadorHistorial />} />
          <Route path="/evaluador/certificado" element={<EvaluadorCertificado />} />

          
          <Route path="/estudiante/proyectos" element={<EstudianteProyectos />} />
          <Route path="/estudiante/crear-proyecto" element={<EstudianteCrearProyecto />} />
          <Route path="/estudiante/evaluaciones" element={<EstudianteEvaluaciones />} />
          <Route path="/estudiante/notas" element={<EstudianteNotas />} />
          <Route path="/estudiante/certificado" element={<EstudianteCertificado />} />

         
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/reportes" element={<AdminReportes />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

