import React, { useState, useEffect } from "react";
import { db } from "../Controlador/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../Vista/Pantalla_Mesero.css";
import logo from "../assets/logo.png";      // Logo del negocio
import mesaIcon from "../assets/mesas.png"; // Icono para las mesas

const PantallaMesero = () => {
  // Array estático de 6 mesas (no se leen de Firestore)
  const mesasEstaticas = [
    { numero: 1 },
    { numero: 2 },
    { numero: 3 },
    { numero: 4 },
    { numero: 5 },
    { numero: 6 },
  ];

  const [vinos, setVinos] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [vinoSeleccionado, setVinoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar la lista de vinos desde Firestore
  useEffect(() => {
    const obtenerVinos = async () => {
      const snapshot = await getDocs(collection(db, "vinos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVinos(data);
    };
    obtenerVinos();
  }, []);

  // Al presionar una mesa
  const seleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa);
  };

  // Al presionar un vino (abrir modal con detalles)
  const seleccionarVino = (vino) => {
    setVinoSeleccionado(vino);
    setMostrarModal(true);
  };

  // Confirmar la compra y guardarla en "pedidos"
  const confirmarCompra = async () => {
    if (!mesaSeleccionada || !vinoSeleccionado) return;

    await addDoc(collection(db, "pedidos"), {
      mesa: mesaSeleccionada.numero,
      vino: vinoSeleccionado.nombre,
      precio: vinoSeleccionado.precio,
      fecha: new Date().toISOString(),
    });

    alert(`Compra realizada: ${vinoSeleccionado.nombre} para la mesa ${mesaSeleccionada.numero}`);
    setMostrarModal(false);
  };

  return (
    <div className="mesero-container">
      {/* Logo en la parte superior */}
      <header className="mesero-header">
        <img src={logo} alt="Cielito Lindo" className="logo-negocio" />
      </header>

      {/* Grid de Mesas si aún no se ha seleccionado una */}
      {!mesaSeleccionada && (
        <>
          <h2>Selecciona una Mesa</h2>
          <div className="mesas-grid">
            {mesasEstaticas.map((mesa, index) => (
              <div
                key={index}
                className="mesa-item"
                onClick={() => seleccionarMesa(mesa)}
              >
                <img src={mesaIcon} alt="Mesa" />
                <p>Mesa {mesa.numero}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lista de vinos si se seleccionó una mesa */}
      {mesaSeleccionada && (
        <>
          <h2>Mesa {mesaSeleccionada.numero}</h2>
          <h3>Selecciona un Vino</h3>
          <div className="vinos-grid">
            {vinos.map((vino) => (
              <div
                key={vino.id}
                className="vino-item"
                onClick={() => seleccionarVino(vino)}
              >
                {/* imagenURL puede ser base64 o una URL normal */}
                <img src={vino.imagenURL} alt={vino.nombre} />
                <p>{vino.nombre}</p>
                <span>${vino.precio}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal con detalles del vino y botón de compra */}
      {mostrarModal && vinoSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <img
              src={vinoSeleccionado.imagenURL}
              alt={vinoSeleccionado.nombre}
              className="vino-detalle-img"
            />
            <h3>{vinoSeleccionado.nombre}</h3>
            
            
            <p>
              <strong>Precio:</strong> ${vinoSeleccionado.precio}
            </p>

            <button onClick={confirmarCompra} className="btn-confirm">
              Comprar
            </button>
            <button
              onClick={() => setMostrarModal(false)}
              className="btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantallaMesero;
