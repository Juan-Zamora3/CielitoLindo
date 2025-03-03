import React, { useState, useEffect } from "react";
import { db } from "../../Controlador/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../../Vista/Meseros/Pantalla_Mesero.css";
import mesaIcon from "../../assets/mesas.png"; // Icono para las mesas

const SeccionMeseros = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [vinoSeleccionado, setVinoSeleccionado] = useState(null);
  const [orden, setOrden] = useState([]);
  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [vinos, setVinos] = useState([]); // Estado para almacenar los vinos desde la BD

  useEffect(() => {
    const obtenerVinos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vinos"));
        const vinosDB = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVinos(vinosDB);
      } catch (error) {
        console.error("Error al obtener vinos:", error);
      }
    };

    obtenerVinos();
  }, []);

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
            {[1, 2, 3, 4, 5, 6].map((numero) => (
              <div
                key={numero}
                className="mesa-item"
                onClick={() => seleccionarMesa({ numero })}
              >
                <img src={mesaIcon} alt={`Mesa ${numero}`} />
                <p>Mesa {numero}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sección de vinos */}
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
                  className="vinomeseros-item"
                  onClick={() => seleccionarVino(vino)}
                >
                  <img src={vino.imagenURL} alt={vino.nombre} />
                  <div className="info-vino">
                    <p>{vino.nombre}</p>
                    <span>${vino.precio}</span>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Modal de selección de vino */}
      {vinoSeleccionado && (
        <div className="modal">
        <div className="modalmeseros-content">
            <img src={vinoSeleccionado.imagenURL} alt={vinoSeleccionado.nombre} />
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
        <div className="ordenmesero-panel">
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
