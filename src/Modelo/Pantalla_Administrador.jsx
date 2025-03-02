import React, { useState, useEffect } from "react";
import { db } from "../Controlador/firebaseConfig";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import "../Vista/Pantalla_Administrador.css";

const PantallaAdministrador = () => {
  const [vista, setVista] = useState(null);
  const [vinos, setVinos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [region, setRegion] = useState("");
  const [imagenURL, setImagenURL] = useState("");

  useEffect(() => {
    const obtenerVinos = async () => {
      const snapshot = await getDocs(collection(db, "vinos"));
      setVinos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    obtenerVinos();
  }, []);

  useEffect(() => {
    const obtenerOrdenes = async () => {
      const snapshot = await getDocs(collection(db, "pedidos"));
      setOrdenes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    obtenerOrdenes();
  }, []);

  const agregarVino = async () => {
    await addDoc(collection(db, "vinos"), {
      nombre,
      precio,
      descripcion,
      region,
      imagenURL,
    });
    alert("Vino agregado correctamente");
  };

  const eliminarVino = async (id) => {
    await deleteDoc(doc(db, "vinos", id));
    alert("Vino eliminado");
  };

  const finalizarOrden = async (id) => {
    await updateDoc(doc(db, "pedidos", id), { finalizado: true });
    alert("Orden marcada como finalizada");
  };

  return (
    <div className="admin-container">
      {!vista && (
        <div className="grid-menu">
          <div className="menu-item" onClick={() => setVista("vinos")}>Gestión de Vinos</div>
          <div className="menu-item" onClick={() => setVista("ordenes")}>Órdenes</div>
        </div>
      )}

      {vista === "vinos" && (
        <div className="gestion-vinos">
          <h2>Gestión de Vinos</h2>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <input type="text" placeholder="Región" value={region} onChange={(e) => setRegion(e.target.value)} />
          <input type="text" placeholder="Imagen URL" value={imagenURL} onChange={(e) => setImagenURL(e.target.value)} />
          <button onClick={agregarVino}>Agregar Vino</button>
          <div className="vinos-grid">
            {vinos.map((vino) => (
              <div key={vino.id} className="vino-item">
                <img src={vino.imagenURL} alt={vino.nombre} />
                <p>{vino.nombre}</p>
                <button onClick={() => eliminarVino(vino.id)}>Eliminar</button>
              </div>
            ))}
          </div>
          <button onClick={() => setVista(null)}>Volver</button>
        </div>
      )}

      {vista === "ordenes" && (
        <div className="ordenes-container">
          <h2>Órdenes</h2>
          <ul>
            {ordenes.map((orden) => (
              <li key={orden.id}>
                Mesa {orden.mesa} - {orden.vino} - ${orden.precio}
                {!orden.finalizado && <button onClick={() => finalizarOrden(orden.id)}>Finalizar</button>}
              </li>
            ))}
          </ul>
          <button onClick={() => setVista(null)}>Volver</button>
        </div>
      )}
    </div>
  );
};

export default PantallaAdministrador;