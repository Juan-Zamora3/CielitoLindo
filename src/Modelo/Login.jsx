import React, { useState } from "react";
import { auth, db } from "../Controlador/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../Vista/Login.css";
import logo from "../assets/logo.png";
import logovino from "../assets/logovino.png";
import wineee from "../assets/wineee.png";
import rellenoColor2 from "../assets/rellenoColor2.png";
import fondo from "../assets/fondo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mesero");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Activar animación

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRoleCollection = role === "mesero" ? "meseros" : "administradores";
        await setDoc(doc(collection(db, userRoleCollection), user.uid), {
          email,
          role,
        });

        setTimeout(() => {
          navigate(role === "mesero" ? "/mesero" : "/administrador");
        }, 2000);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const meseroRef = doc(db, "meseros", user.uid);
        const adminRef = doc(db, "administradores", user.uid);

        const meseroSnap = await getDoc(meseroRef);
        const adminSnap = await getDoc(adminRef);

        setTimeout(() => {
          if (meseroSnap.exists()) {
            navigate("/mesero");
          } else if (adminSnap.exists()) {
            navigate("/administrador");
          } else {
            setError("Usuario no encontrado en ninguna colección.");
            setIsLoading(false); // Desactivar animación si hay error
          }
        }, 2000);
      }
    } catch (err) {
      setError("Error en la autenticación, revisa los datos ingresados.");
      setIsLoading(false); // Desactivar animación si hay error
    }
  };

  return (
    <div 
      className={`login-container ${isLoading ? "fade-out" : ""}`} 
      style={{
        backgroundImage: `url(${fondo})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw"
      }}
    >
      {isLoading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      )}

      {/* Imágenes adicionales */}
      <img src={rellenoColor2} alt="Relleno Color" className="relleno-color" />
      <img src={wineee} alt="Vino" className="wineee-logo" />

      <div className="left-panel">
        <div className="logo-container">
          <img src={logovino} alt="Vino" className="logovino" />
          <img src={logo} alt="Cielito Lindo" className="logo" />
        </div>
        <form onSubmit={handleAuth}>
          {error && <p className="error">{error}</p>}
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {isRegistering && (
            <div className="role-selection">
              <button type="button" className={`role-btn ${role === "mesero" ? "active" : ""}`} onClick={() => setRole("mesero")}>
                Mesero
              </button>
              <button type="button" className={`role-btn ${role === "administrador" ? "active" : ""}`} onClick={() => setRole("administrador")}>
                Administrador
              </button>
            </div>
          )}

          <button type="submit" className="btn">{isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}</button>
        </form>
        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle">
          {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </p>
      </div>
    </div>
  );
};

export default Login;
