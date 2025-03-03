import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../Controlador/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import "../../Vista/Administrador/GestorVinos.css";

const GestorVinos = () => {
  const navigate = useNavigate();
  const [vinos, setVinos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vinoSeleccionado, setVinoSeleccionado] = useState(null);
  const [archivoCSV, setArchivoCSV] = useState(null);
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

  // Obtener lista de vinos desde Firestore
  const obtenerVinos = async () => {
    const snapshot = await getDocs(collection(db, "vinos"));
    setVinos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    obtenerVinos();
  }, []);

  // Resetear el formulario después de cualquier acción
  const resetearFormulario = () => {
    setNuevoVino({
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
    setMostrarFormulario(false);
    setModoEdicion(false);
    setVinoSeleccionado(null);
  };

  const agregarVino = async () => {
    await addDoc(collection(db, "vinos"), nuevoVino);
    alert("Vino agregado correctamente");
    resetearFormulario();
    obtenerVinos();
  };

  const eliminarVino = async (id) => {
    await deleteDoc(doc(db, "vinos", id));
    alert("Vino eliminado");
    setVinoSeleccionado(null);
    obtenerVinos();
  };

  const editarVino = async () => {
    if (!vinoSeleccionado) return;
    await updateDoc(doc(db, "vinos", vinoSeleccionado.id), vinoSeleccionado);
    alert("Vino actualizado correctamente");
    resetearFormulario();
    obtenerVinos();
  };

  const abrirEdicion = () => {
    setModoEdicion(true);
    setNuevoVino(vinoSeleccionado);
  };

  const manejarArchivoCSV = (e) => {
    setArchivoCSV(e.target.files[0]);
  };

  const procesarCSV = async () => {
    if (!archivoCSV) return alert("Por favor, selecciona un archivo CSV");
    
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const contenido = target.result;
      const lineas = contenido.split("\n").slice(1); // Ignorar encabezados
      
      for (let linea of lineas) {
        const [nombre, region, variedadUva, tipo, anada, notaCata, graduacion, precioBotella, precioCopa, imagenURL] = linea.split(",");
        if (!nombre) continue;
        await addDoc(collection(db, "vinos"), {
          nombre,
          region,
          variedadUva,
          tipo,
          anada,
          notaCata,
          graduacion,
          precioBotella,
          precioCopa,
          imagenURL
        });
      }
      alert("Vinos agregados desde CSV correctamente");
      obtenerVinos(); // Actualiza la lista de vinos
    };
    reader.readAsText(archivoCSV);
  };

  return (
    
    <div className="gestion-vinos">
      <button className="btn-volver" onClick={() => navigate("/administrador")}> Volver</button>
      <div className="busqueda-container">
        <input 
          type="text" 
          placeholder="Buscar vinos..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
        <button onClick={() => { setMostrarFormulario(true); setModoEdicion(false); }}>Agregar Vino</button>
      </div>

      {(mostrarFormulario || modoEdicion) && (
        <div className="modal">
          <div className="modal-agregar-vinos">
            <h2>{modoEdicion ? "Editar Vino" : "Agregar Vino"}</h2>
            <div className="formulario-vino">
              {Object.keys(nuevoVino).map((key) => (
                key !== "id" && ( // No mostrar ni editar el ID
                  <input 
                    key={key}
                    type={key.includes("precio") ? "number" : "text"} 
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)} 
                    value={modoEdicion ? vinoSeleccionado[key] || "" : nuevoVino[key]} 
                    onChange={(e) => {
                      if (modoEdicion) {
                        setVinoSeleccionado({ ...vinoSeleccionado, [key]: e.target.value });
                      } else {
                        setNuevoVino({ ...nuevoVino, [key]: e.target.value });
                      }
                    }} 
                  />
                )
              ))}
              <button onClick={modoEdicion ? editarVino : agregarVino}>{modoEdicion ? "Guardar Cambios" : "Agregar"}</button>
              <input className="input-csv" type="file" accept=".csv" onChange={manejarArchivoCSV} />
              <button onClick={procesarCSV}>Agregar desde CSV</button>
              <button onClick={resetearFormulario}>Cancelar</button>
            </div>
          </div>
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

      {vinoSeleccionado && !modoEdicion && (
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
            </div>
            <div className="botones-vino">
              <button onClick={abrirEdicion}>Editar</button>
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
