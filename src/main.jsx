import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Modelo/Login.jsx";
import PantallaMesero from "./Modelo/Meseros/Pantalla_Mesero.jsx";
import PantallaAdministrador from "./Modelo/Administrador/Pantalla_Administrador.jsx";
import GestorVinos from "./Modelo/Administrador/GestorVinos.jsx";
import OrdenesAdministrador from "./Modelo/Administrador/OrdenesAdministrador.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mesero" element={<PantallaMesero />} />
        <Route path="/administrador" element={<PantallaAdministrador />} />
        <Route path="/administrador/gestor-vinos" element={<GestorVinos />} />
        <Route path="/administrador/ordenes" element={<OrdenesAdministrador />} />
      </Routes>
    </Router>
  </StrictMode>
);
