import React, { useState, useEffect } from "react";
import { db } from "../../Controlador/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "../../Vista/Administrador/OrdenesAdministrador.css";

const OrdenesAdministrador = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const obtenerOrdenes = async () => {
      const snapshot = await getDocs(collection(db, "pedidos"));
      setOrdenes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    obtenerOrdenes();
  }, []);

  const finalizarOrden = async (id) => {
    await updateDoc(doc(db, "pedidos", id), { finalizado: true });
    alert("Orden marcada como finalizada");
  };

  return (
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
      <button className="btn-volver" onClick={() => window.history.back()}>Volver</button>
    </div>
  );
};

export default OrdenesAdministrador;
