import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Vista/Administrador/Pantalla_Administrador.css";
import admImage from "../../assets/adm.png";

const PantallaAdministrador = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      {/* Mostrar imagen de administrador */}
      <img src={admImage} alt="Admin" className="admin-image" />

      {/* Menú principal con botones para acceder a cada sección */}
      <div className="grid-menu">
        <div className="menu-item" onClick={() => navigate("/administrador/gestor-vinos")}>
          Gestión de Vinos
        </div>
        <div className="menu-item" onClick={() => navigate("/administrador/ordenes")}>
          Órdenes
        </div>
      </div>
    </div>
  );
};

export default PantallaAdministrador;
