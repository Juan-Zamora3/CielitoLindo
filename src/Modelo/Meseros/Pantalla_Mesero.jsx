import React, { useState, useEffect } from "react";
import { db } from "../../Controlador/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore"; // Asegúrate de importar addDoc
import "../../Vista/Meseros/Pantalla_Mesero.css";
import mesaIcon from "../../assets/mesas.png"; // Icono para las mesas

const SeccionMeseros = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [vinoSeleccionado, setVinoSeleccionado] = useState(null);
  const [orden, setOrden] = useState([]);
  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [vinos, setVinos] = useState([]); // Estado para almacenar los vinos desde la BD

  // Función para obtener los vinos desde Firestore
  useEffect(() => {
    const obtenerVinos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vinos"));
        const vinosDB = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          precioBotella: parseFloat(doc.data().precioBotella) || 0, // Asegura que sea número
          precioCopa: parseFloat(doc.data().precioCopa) || 0,
        }));
        setVinos(vinosDB);
      } catch (error) {
        console.error("Error al obtener vinos:", error);
      }
    };

    obtenerVinos();
  }, []);

  // Función para seleccionar la mesa
  const seleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa);
  };

  // Función para seleccionar el vino
  const seleccionarVino = (vino) => {
    setVinoSeleccionado(vino);
  };

  // Función para agregar vino a la orden
  const agregarAOrden = (vino, cantidadBotellas, cantidadCopas) => {
    setOrden([
      ...orden,
      {
        ...vino,
        botellas: cantidadBotellas || 0,
        copas: cantidadCopas || 0,
        precioBotella: vino.precioBotella,
        precioCopa: vino.precioCopa,
      },
    ]);
    setVinoSeleccionado(null);
  };

  // Función para eliminar un item de la orden
  const eliminarDeOrden = (index) => {
    setOrden(orden.filter((_, i) => i !== index));
  };

  // Función para calcular el total de la orden
  const calcularTotal = () => {
    return orden.reduce((total, vino) => {
      const precioBotella = parseFloat(vino.precioBotella) || 0;
      const precioCopa = parseFloat(vino.precioCopa) || 0;
      const botellas = parseInt(vino.botellas) || 0;
      const copas = parseInt(vino.copas) || 0;
      return total + precioBotella * botellas + precioCopa * copas;
    }, 0).toFixed(2); // Redondea a 2 decimales
  };

  // Función para crear un pedido y guardarlo en Firestore
  const crearPedido = async () => {
    const fecha = new Date().toLocaleString(); // Fecha actual
    const precioTotal = calcularTotal(); // Calcula el precio total
    const vinosPedido = orden.map((item) => ({
      nombre: item.nombre,
      botellas: item.botellas,
      copas: item.copas,
      precioBotella: item.precioBotella,
      precioCopa: item.precioCopa,
    }));

    try {
      // Guardar en la colección "pedidos"
      const docRef = await addDoc(collection(db, "pedidos"), {
        fecha: fecha,
        finalizado: false, // El pedido no está finalizado
        mesa: mesaSeleccionada.numero,
        precio: precioTotal,
        vinos: vinosPedido, // Vinos y sus cantidades
      });

      console.log("Pedido guardado con ID:", docRef.id);
      // Resetear orden y mostrar la selección de mesas
      setOrden([]);
      setMesaSeleccionada(null);  
      setVinoSeleccionado(null);
      setMostrarOrden(false); // Regresa a la vista de selección de mesa
    } catch (e) {
      console.error("Error al guardar el pedido:", e);
    }
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
                onClick={() => {
                  seleccionarMesa({ numero });
                  setMostrarOrden(true); // Cambia el estado de mostrarOrden a true
                }}
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
            <img
              className="imagenvinomeseros"
              src={vinoSeleccionado.imagenURL}
              alt={vinoSeleccionado.nombre}
            />
            <h3>{vinoSeleccionado.nombre}</h3>
            <p>Region : {vinoSeleccionado.region}</p>
            <p>Variedad de Uva : {vinoSeleccionado.variedadUva}</p>
            <p>Tipo : {vinoSeleccionado.tipo}</p>
            <p>Añada : {vinoSeleccionado.anada}</p>
            <p>Nota Cata : {vinoSeleccionado.notaCata}</p>
            <p>Graduacion : {vinoSeleccionado.graduacion}</p>
            <p>Precio por botella: ${vinoSeleccionado.precioBotella}</p>
            <p>Precio por copa: ${vinoSeleccionado.precioCopa}</p>

            <div>
              <label>Botellas:</label>
              <input type="number" min="0" defaultValue="0" id="botellas" />
            </div>
            <div>
              <label>Copas:</label>
              <input type="number" min="0" defaultValue="0" id="copas" />
            </div>
            <button
              onClick={() => {
                agregarAOrden(
                  vinoSeleccionado,
                  parseInt(document.getElementById("botellas").value) || 0,
                  parseInt(document.getElementById("copas").value) || 0
                );
                calcularTotal();
              }}
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
            {orden.map((item, index) => {
              const subtotal =
                item.precioBotella * item.botellas + item.precioCopa * item.copas;
              return (
                <li key={index}>
                  {item.nombre} - {item.botellas} Botellas, {item.copas} Copas -
                  <strong> ${subtotal.toFixed(2)}</strong>
                  <button onClick={() => eliminarDeOrden(index)}>X</button>
                </li>
              );
            })}
          </ul>

          <div className="botones-container">
            <p>Total: ${calcularTotal()}</p>

            <button onClick={crearPedido}>Ordenar</button>
            <button onClick={() => setOrden([])}>Cancelar</button>
            <button
              onClick={() => {
                setOrden([]);
                setMesaSeleccionada(null); // Limpiar la selección de mesa
                setVinoSeleccionado(null); // Limpiar la selección de vino
                setMostrarOrden(false); // Regresar a la selección de mesa
              }}
            >
              Regresar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionMeseros;
