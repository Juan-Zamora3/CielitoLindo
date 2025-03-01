import React, { useState, useEffect } from "react";
import { db } from "../Controlador/firebaseConfig"; // Sin usar Storage
import { collection, addDoc, getDocs } from "firebase/firestore";
import "../Vista/Pantalla_Administrador.css";

const PantallaAdministrador = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [modalHistorial, setModalHistorial] = useState(false);

  useEffect(() => {
    const obtenerHistorial = async () => {
      const snapshot = await getDocs(collection(db, "pedidos")); // <-- Cambiado a "pedidos"
      setHistorial(snapshot.docs.map((doc) => doc.data()));
    };
    obtenerHistorial();
  }, []);
  

  // Al seleccionar imagen, generamos un preview en base64
  const manejarSeleccionImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagenFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result); // data URL base64
    };
    reader.readAsDataURL(file);
  };

  const agregarVino = async () => {
    if (!nombre || !precio || !imagenPreview) {
      return alert("Faltan datos (nombre, precio o imagen).");
    }

    // Guardar en Firestore como base64
    await addDoc(collection(db, "vinos"), {
      nombre,
      precio,
      imagenURL: imagenPreview,
    });

    // Limpiar campos
    setNombre("");
    setPrecio("");
    setImagenFile(null);
    setImagenPreview(null);

    alert("Vino agregado exitosamente (imagen guardada en base64).");
  };

  return (
    <div className="admin-container">
      <h2>
        Bienvenido, <span>Administrador</span>
      </h2>

      <div className="gestion-vinos">
        <h3>Agregar Vino</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={manejarSeleccionImagen}
        />

        {/* Vista previa de la imagen */}
        {imagenPreview && (
          <div className="preview-container">
            <img
              src={imagenPreview}
              alt="Vista previa"
              className="imagen-preview"
            />
          </div>
        )}

        <button onClick={agregarVino} className="btn-principal">
          Agregar
        </button>
      </div>

      <div className="historial-container">
        <button
          className="btn-historial"
          onClick={() => setModalHistorial(true)}
        >
          Ver Historial de Compras
        </button>
      </div>

      {modalHistorial && (
        <div className="modal">
          <div className="modal-content">
            <h3>Historial de Compras</h3>
            <ul>
              {historial.map((compra, index) => (
                <li key={index}>
                  Mesa {compra.mesa} - {compra.vino} -{" "}
                  <strong>${compra.precio}</strong>
                </li>
              ))}
            </ul>
            <button
              className="btn-cerrar"
              onClick={() => setModalHistorial(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantallaAdministrador;
