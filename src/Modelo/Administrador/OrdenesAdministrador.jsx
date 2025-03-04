import React, { useState, useEffect } from "react";
import { db } from "../../Controlador/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import "../../Vista/Administrador/OrdenesAdministrador.css";

const OrdenesAdministrador = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [reporteCorte, setReporteCorte] = useState(null);
  const [totalVendido, setTotalVendido] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const ordenesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const noFinalizados = ordenesData.filter((pedido) => !pedido.finalizado);
      noFinalizados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      const finalizados = ordenesData.filter((pedido) => pedido.finalizado);

      setOrdenes([...noFinalizados, ...finalizados]);
    });

    return () => unsub();
  }, []);

  const finalizarOrden = async (id) => {
    try {
      // Actualiza el campo "finalizado" a true en la base de datos
      const ordenRef = doc(db, "pedidos", id);
      await updateDoc(ordenRef, { finalizado: true });

      // Actualiza el estado local para reflejar la orden finalizada
      setOrdenes((prevOrdenes) =>
        prevOrdenes.map((orden) =>
          orden.id === id ? { ...orden, finalizado: true } : orden
        )
      );
    } catch (error) {
      console.error("Error al finalizar la orden:", error);
    }
  };

  const generarReporteCorte = () => {
    const ventas = ordenes.filter((pedido) => pedido.finalizado);
    let reporte = [];
    let total = 0;
  
    ventas.forEach((pedido) => {
      const horaVenta = new Date(pedido.fecha).toLocaleTimeString();
      const detallesVenta = pedido.vinos?.map((vino) => ({
        nombre: vino.nombre,
        botellas: vino.botellas,
        copas: vino.copas,
        precioBotella: vino.precioBotella,
        precioCopa: vino.precioCopa,
      })) || [];
  
      const subtotal = detallesVenta.reduce((sum, vino) => 
        sum + (vino.precioBotella * vino.botellas + vino.precioCopa * vino.copas), 0
      );
  
      total += subtotal;
  
      reporte.push({
        mesa: pedido.mesa,
        hora: horaVenta,
        detalles: detallesVenta,
        subtotal: subtotal.toFixed(2),
      });
    });
  
    const totalFinal = total.toFixed(2); // Convertimos el total a dos decimales
  
    setReporteCorte(reporte);
    setTotalVendido(totalFinal);
  
    // **Definir `window.descargarExcel` correctamente**
    window.descargarExcel = () => descargarExcel(reporte, totalFinal);
  
    abrirVentanaEmergente(reporte, totalFinal);
  };
  

  const abrirVentanaEmergente = (reporte, total) => {
    const ancho = 700, alto = 500;
    const izquierda = (window.screen.width - ancho) / 2;
    const arriba = (window.screen.height - alto) / 2;
    const newWindow = window.open("", "_blank", `width=${ancho},height=${alto},top=${arriba},left=${izquierda}`);

    let htmlContent = `
      <html>
      <head>
        <title>Reporte de Corte</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #4CAF50; color: white; }
          .total { font-weight: bold; margin-top: 20px; }
          .btn { padding: 10px 20px; background: #007BFF; color: white; border: none; cursor: pointer; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h2>Reporte de Corte</h2>
        <table>
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Hora</th>
              <th>Detalles</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
    `;

    reporte.forEach((venta) => {
      htmlContent += `
        <tr>
          <td>${venta.mesa}</td>
          <td>${venta.hora}</td>
          <td>
            ${venta.detalles.map(vino => `${vino.nombre} - ${vino.botellas} Botellas, ${vino.copas} Copas`).join("<br>")}
          </td>
          <td>$${venta.subtotal}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <p class="total">Total Vendido: <strong>$${total}</strong></p>
        <button class="btn" onclick="window.opener.descargarExcel()">Descargar Excel</button>
      </body>
      </html>
    `;

    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const descargarExcel = (reporte, totalVendido) => {
    if (!reporte || reporte.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
  
    const datosExcel = reporte.map((venta) => ({
      Mesa: venta.mesa,
      Hora: venta.hora,
      Detalles: venta.detalles.map(vino => `${vino.nombre} - ${vino.botellas} Botellas, ${vino.copas} Copas`).join("; "),
      Subtotal: `$${venta.subtotal}`,
    }));
  
    // **Corrección: Agregar total de todas las ventas al final**
    datosExcel.push({
      Mesa: "TOTAL",
      Hora: "",
      Detalles: "Total de todas las ventas",
      Subtotal: `$${totalVendido}`, // 🔥 ¡Ahora sí muestra el total!
    });
  
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Corte");
    XLSX.writeFile(wb, "reporte_corte.xlsx");
    
    // Opcional: limpiar estado después de eliminar los pedidos
    setOrdenes(ordenes.filter((pedido) => !pedido.finalizado));
    setReporteCorte(null);
    setTotalVendido(0);
  };
  

  return (
    <div className="ordenes-container">
      <h2>Órdenes</h2>
      <div className="ordenes-grid encabezado">
        <div className="orden-col">Mesa</div>
        <div className="orden-col">Orden</div>
        <div className="orden-col">Precio</div>
        <div className="orden-col">Acción</div>
        <div className="orden-col">Estado</div>
      </div>
      <div className="ordenes-scroll">
        {ordenes.map((pedido) => (
          <div key={pedido.id} className={`ordenes-grid fila ${pedido.finalizado ? "finalizado" : "activo"}`}>
            <div className="orden-col">{pedido.mesa}</div>
            <div className="orden-col">
              {pedido.vinos?.map((vino, index) => (
                <div key={index}>{vino.nombre} - {vino.botellas} Botellas, {vino.copas} Copas</div>
              )) || <p>No hay vinos en la orden</p>}
            </div>
            <div className="orden-col">${parseFloat(pedido.precio).toFixed(2)}</div>
            <div className="orden-col">
              {!pedido.finalizado && (
                <button className="btn-finalizar" onClick={() => finalizarOrden(pedido.id)}>
                  Finalizar
                </button>
              )}
            </div>
            <div className="orden-col estado">{pedido.finalizado ? "Finalizado" : "Activo"}</div>
          </div>
        ))}
      </div>
      <button className="btn-cerrar-corte" onClick={generarReporteCorte}>
        Cerrar Corte
      </button>
      <button className="btn-volver" onClick={() => window.history.back()}>
        Volver
      </button>
    </div>
  );
};

export default OrdenesAdministrador;
