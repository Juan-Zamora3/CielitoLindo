import React, { useState, useEffect } from "react";
import { db } from "../../Controlador/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../../Vista/Meseros/Pantalla_Mesero.css";
import logo from "../../assets/logo.png";      // Logo del negocio
import mesaIcon from "../../assets/mesas.png"; // Icono para las mesas


const SeccionMeseros = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [vinoSeleccionado, setVinoSeleccionado] = useState(null);
  const [orden, setOrden] = useState([]);
  const [mostrarOrden, setMostrarOrden] = useState(false);

  const mesas = [
    { numero: 1 },
    { numero: 2 },
    { numero: 3 },
    { numero: 4 },
    { numero: 5 },
    { numero: 6 },
  ];

  const vinos = [
    { id: 1, nombre: "Vino Tinto", imagen: "ruta/vino1.png", precio: 200 },
    { id: 2, nombre: "Vino Blanco", imagen: "ruta/vino2.png", precio: 180 },
    { id: 3, nombre: "Vino Rosado", imagen: "ruta/vino3.png", precio: 190 },
  ];

  const seleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa);
  };

  const seleccionarVino = (vino) => {
    setVinoSeleccionado(vino);
  };

  const agregarAOrden = (vino, cantidadBotellas, cantidadCopas) => {
    setOrden([
      ...orden,
      { ...vino, botellas: cantidadBotellas, copas: cantidadCopas },
    ]);
    setVinoSeleccionado(null);
  };

  const eliminarDeOrden = (index) => {
    setOrden(orden.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return orden.reduce(
      (total, item) => total + item.precio * (item.botellas + item.copas * 0.5),
      0
    );
  };

  return (
    <div className="meseros-container">
      {/* Selección de mesas */}
      {!mesaSeleccionada && (
        <>
          <h2>Selecciona una Mesa</h2>
          <div className="mesas-grid">
            {mesas.map((mesa, index) => (
              <div
                key={index}
                className="mesa-item"
                onClick={() => seleccionarMesa(mesa)}
              >
                <img src={mesaIcon} alt={`Mesa ${mesa.numero}`} />
                <p>Mesa {mesa.numero}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sección de vinos (visible solo después de seleccionar una mesa) */}
      {mesaSeleccionada && (
        <>
          <h2>Mesa {mesaSeleccionada.numero}</h2>
          <div className="busqueda-container">
            <input
              type="text"
              placeholder="Buscar vino..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button onClick={() => setMostrarOrden(true)}>Orden</button>
          </div>

          <div className="vinos-grid">
            {vinos
              .filter((vino) =>
                vino.nombre.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((vino) => (
                <div
                  key={vino.id}
                  className="vino-item"
                  onClick={() => seleccionarVino(vino)}
                >
                  <img src={vino.imagen} alt={vino.nombre} />
                  <p>{vino.nombre}</p>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Vista completa del vino */}
      {vinoSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <img src={vinoSeleccionado.imagen} alt={vinoSeleccionado.nombre} />
            <h3>{vinoSeleccionado.nombre}</h3>
            <p>Precio: ${vinoSeleccionado.precio}</p>
            <div>
              <label>Botellas:</label>
              <input type="number" min="0" defaultValue="0" id="botellas" />
            </div>
            <div>
              <label>Copas:</label>
              <input type="number" min="0" defaultValue="0" id="copas" />
            </div>
            <button
              onClick={() =>
                agregarAOrden(
                  vinoSeleccionado,
                  parseInt(document.getElementById("botellas").value),
                  parseInt(document.getElementById("copas").value)
                )
              }
            >
              Agregar a orden
            </button>
            <button onClick={() => setVinoSeleccionado(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Panel de orden */}
      {mostrarOrden && (
        <div className="orden-panel">
          <h3>Orden - Mesa {mesaSeleccionada.numero}</h3>
          <ul>
            {orden.map((item, index) => (
              <li key={index}>
                {item.nombre} - {item.botellas} Botellas, {item.copas} Copas - $
                {item.precio * (item.botellas + item.copas * 0.5)}
                <button onClick={() => eliminarDeOrden(index)}>X</button>
              </li>
            ))}
          </ul>
          <p>Total: ${calcularTotal()}</p>
          <button>Ordenar</button>
          <button onClick={() => setOrden([])}>Cancelar</button>
          <button onClick={() => setMostrarOrden(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default SeccionMeseros;

