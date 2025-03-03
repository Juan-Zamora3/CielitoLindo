import React, { useState, useEffect } from "react";
import { db } from "../../Controlador/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import "../../Vista/Administrador/GestorVinos.css";

const GestorVinos = () => {
  const [vinos, setVinos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vinoSeleccionado, setVinoSeleccionado] = useState(null);
  const [nuevoVino, setNuevoVino] = useState({
    nombre: "",
    region: "",
    variedadUva: "",
    tipo: "",
    anada: "",
    notaCata: "",
    graduacion: "",
    precioBotella: "",
    precioCopa: "",
    imagenURL: ""
  });

  useEffect(() => {
    const obtenerVinos = async () => {
      const snapshot = await getDocs(collection(db, "vinos"));
      setVinos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    obtenerVinos();
  }, []);

  const agregarVino = async () => {
    await addDoc(collection(db, "vinos"), nuevoVino);
    alert("Vino agregado correctamente");
    setMostrarFormulario(false);
  };

  const eliminarVino = async (id) => {
    await deleteDoc(doc(db, "vinos", id));
    alert("Vino eliminado");
    setVinoSeleccionado(null);
  };

  const editarVino = async () => {
    if (!vinoSeleccionado) return;
    await updateDoc(doc(db, "vinos", vinoSeleccionado.id), vinoSeleccionado);
    alert("Vino actualizado correctamente");
  };

  return (
    <div className="gestion-vinos">
      <div className="busqueda-container">
        <input 
          type="text" 
          placeholder="Buscar vinos..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
        <button onClick={() => setMostrarFormulario(true)}>Agregar Vino</button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-vino">
          <input type="text" placeholder="Nombre del Vino" value={nuevoVino.nombre} onChange={(e) => setNuevoVino({ ...nuevoVino, nombre: e.target.value })} />
          <input type="text" placeholder="Región de Origen" value={nuevoVino.region} onChange={(e) => setNuevoVino({ ...nuevoVino, region: e.target.value })} />
          <input type="text" placeholder="Variedad de Uva" value={nuevoVino.variedadUva} onChange={(e) => setNuevoVino({ ...nuevoVino, variedadUva: e.target.value })} />
          <input type="text" placeholder="Tipo" value={nuevoVino.tipo} onChange={(e) => setNuevoVino({ ...nuevoVino, tipo: e.target.value })} />
          <input type="text" placeholder="Añada" value={nuevoVino.anada} onChange={(e) => setNuevoVino({ ...nuevoVino, anada: e.target.value })} />
          <input type="text" placeholder="Nota de Cata" value={nuevoVino.notaCata} onChange={(e) => setNuevoVino({ ...nuevoVino, notaCata: e.target.value })} />
          <input type="text" placeholder="Graduación Alcohólica" value={nuevoVino.graduacion} onChange={(e) => setNuevoVino({ ...nuevoVino, graduacion: e.target.value })} />
          <input type="number" placeholder="Precio por Botella" value={nuevoVino.precioBotella} onChange={(e) => setNuevoVino({ ...nuevoVino, precioBotella: e.target.value })} />
          <input type="number" placeholder="Precio por Copa" value={nuevoVino.precioCopa} onChange={(e) => setNuevoVino({ ...nuevoVino, precioCopa: e.target.value })} />
          <input type="text" placeholder="Imagen del vino URL" value={nuevoVino.imagenURL} onChange={(e) => setNuevoVino({ ...nuevoVino, imagenURL: e.target.value })} />
          <button onClick={agregarVino}>Agregar</button>
          <button onClick={() => setMostrarFormulario(false)}>Cancelar</button>
        </div>
      )}

      <div className="vinos-grid">
        {vinos.filter(vino => vino.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((vino) => (
          <div key={vino.id} className="vino-item" onClick={() => setVinoSeleccionado(vino)}>
            <img src={vino.imagenURL} alt={vino.nombre} />
            <p>{vino.nombre}</p>
          </div>
        ))}
      </div>

      {vinoSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <div className="vino-foto">
              <img src={vinoSeleccionado.imagenURL} alt={vinoSeleccionado.nombre} />
              </div>
            <div className="info-vino">
              <h3>{vinoSeleccionado.nombre}</h3>
              <p>Región: {vinoSeleccionado.region}</p>
              <p>Variedad de Uva: {vinoSeleccionado.variedadUva}</p>
              <p>Tipo: {vinoSeleccionado.tipo}</p>
              <p>Añada: {vinoSeleccionado.anada}</p>
              <p>Nota de Cata: {vinoSeleccionado.notaCata}</p>
              <p>Graduación: {vinoSeleccionado.graduacion}</p>
              <p>Precio por Botella: ${vinoSeleccionado.precioBotella}</p>
              <p>Precio por Copa: ${vinoSeleccionado.precioCopa}</p>

            </div>
            <div className="botones-vino">
              <button onClick={editarVino}>Editar</button>
              <button onClick={() => eliminarVino(vinoSeleccionado.id)}>Eliminar</button>
              <button onClick={() => setVinoSeleccionado(null)}>Cerrar</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default GestorVinos;
