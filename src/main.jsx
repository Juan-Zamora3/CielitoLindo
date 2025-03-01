import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Modelo/Login";
import PantallaMesero from "./Modelo/Pantalla_Mesero";
import PantallaAdministrador from "./Modelo/Pantalla_Administrador";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mesero" element={<PantallaMesero />} />
        <Route path="/administrador" element={<PantallaAdministrador />} />
      </Routes>
    </Router>
  </StrictMode>
);
