import { useState } from "react";
<<<<<<< HEAD
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth , db } from "../firebaseconfig";
=======
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseconfig";
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Usar directamente la instancia de auth importada en lugar de crear una nueva
<<<<<<< HEAD
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
=======
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
      const user = userCredential.user;

      // Actualizar el perfil del usuario con el nombre
      await updateProfile(user, {
        displayName: name,
      });

      // Usar la instancia db importada en lugar de crear una nueva
      const currentDate = new Date();
<<<<<<< HEAD
      
      // Crear el documento con manejo de errores específico
      try {
        console.log("Intentando crear documento para usuario:", user.uid);
        
=======

      // Crear el documento con manejo de errores específico
      try {
        console.log("Intentando crear documento para usuario:", user.uid);

>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        // Crear un objeto de datos simple primero
        const userData = {
          createdAt: currentDate.toISOString(),
          displayName: name,
          email: email,
          stats: {
            daysStreak: 0,
            lastLogin: currentDate.toISOString(),
            wordsCompleted: 0,
<<<<<<< HEAD
            lettersLearned: []
=======
            lettersLearned: [],
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
          },
          userBadges: [
            {
              badgeId: "01",
              earnedAt: currentDate.toISOString(), // Aseguramos formato ISO consistente
<<<<<<< HEAD
              progress: 1
            }
          ]
        };
        
=======
              progress: 1,
            },
          ],
        };

>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        // Intentar crear el documento
        await setDoc(doc(db, "users", user.uid), userData);
        console.log("Documento de usuario creado exitosamente");
      } catch (firestoreError) {
<<<<<<< HEAD
        console.error("Error específico al crear documento en Firestore:", firestoreError);
=======
        console.error(
          "Error específico al crear documento en Firestore:",
          firestoreError
        );
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        // Mostrar detalles del error
        setMessage("Error al crear perfil: " + firestoreError.message);
        return; // Detener la ejecución si falla la creación del documento
      }

      console.log("Registro exitoso:", user);
      setMessage("Registro exitoso. Bienvenido, " + name + "!");
<<<<<<< HEAD
      
=======

>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
      // Redirigir al usuario después de un registro exitoso
      setTimeout(() => {
        navigate("/Hands-AI/profile");
      }, 1500);
    } catch (error) {
      console.error("Error en el registro:", error);
      setMessage("Error en el registro: " + error.message);
    }
  };

  // El resto del componente permanece igual
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSignUp}>
          {/* Resto del formulario sin cambios */}
          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
=======
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="name"
            >
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
=======
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
<<<<<<< HEAD
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
=======
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        {message && <p className="text-white mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default SignUp;
