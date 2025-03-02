import React, { useState, useEffect } from "react";
import { db } from "../Controlador/firebaseConfig";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import "../Vista/Pantalla_Administrador.css";
import admImage from "../assets/adm.png"; // ✅ Corregida la importación de la imagen

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
      {/* Mostrar el personaje solo en la pantalla principal */}
      {vista === null && <img src={admImage} alt="Admin" className="admin-image" />}
  
      {/* Menú principal con los botones centrados */}
      {!vista && (
        <div className="grid-menu">
          <div className="menu-item" onClick={() => setVista("vinos")}>Gestión de Vinos</div>
          <div className="menu-item" onClick={() => setVista("ordenes")}>Órdenes</div>
        </div>
      )}
  
      {/* Gestión de vinos */}
      {/* Gestión de vinos */}
{vista === "vinos" && (
  <div className="gestion-vinos">
    <h2>Gestión de Vinos</h2>

    {/* Formulario estructurado en grid */}
    <div className="vino-form">
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
      <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <input type="text" placeholder="Región" value={region} onChange={(e) => setRegion(e.target.value)} />
      <input type="text" placeholder="Imagen URL" value={imagenURL} onChange={(e) => setImagenURL(e.target.value)} />
    </div>

    {/* Botones de acción */}
    <div className="vino-actions">
      <button className="btn-add" onClick={agregarVino}>Agregar Vino</button>
      <button className="btn-back" onClick={() => setVista(null)}>Volver</button>
    </div>

    {/* Lista de vinos en grid */}
    <div className="vinos-grid">
      {vinos.map((vino) => (
        <div key={vino.id} className="vino-item">
          <img src={vino.imagenURL} alt={vino.nombre} />
          <p className="vino-nombre">{vino.nombre}</p>
          <button className="btn-delete" onClick={() => eliminarVino(vino.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  </div>
)}

  
      {/* Órdenes */}
      {vista === "ordenes" && (
  <div className="ordenes-container">
    <h2>Órdenes</h2>

    {/* Encabezado de la tabla */}
    <div className="ordenes-grid encabezado">
      <div className="orden-col">Mesa</div>
      <div className="orden-col">Orden</div>
      <div className="orden-col">Precio</div>
      <div className="orden-col">Acción</div>
      <div className="orden-col">Estado</div>
    </div>

    {/* Cuerpo de la tabla con scroll */}
    <div className="ordenes-scroll">
      {ordenes.map((pedido) => {
        const estadoPedido = pedido.finalizado ? "Finalizado" : "Activo";

        return (
          <div key={pedido.id} className={`ordenes-grid fila ${pedido.finalizado ? "finalizado" : "activo"}`}>
            <div className="orden-col">{pedido.mesa}</div>
            <div className="orden-col">{pedido.vino}</div>
            <div className="orden-col">${pedido.precio}</div>
            <div className="orden-col">
              {!pedido.finalizado && (
                <button className="btn-finalizar" onClick={() => finalizarOrden(pedido.id)}>
                  Finalizar
                </button>
              )}
            </div>
            <div className="orden-col estado">{estadoPedido}</div>
          </div>
        );
      })}
    </div>

    {/* Botón para regresar */}
    <button className="btn-volver" onClick={() => setVista(null)}>Volver</button>
  </div>
)}




    </div>
  );
  
};

export default PantallaAdministrador;
