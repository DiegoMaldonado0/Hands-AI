// src/pages/Login.js
import { useState } from "react";
import { auth } from "../firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Actualizar último inicio de sesión en Firestore
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      
      // Verificar si el documento existe
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const today = new Date();
        await updateDoc(userRef, {
          "stats.lastLogin": today
        });
      }
      
=======

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Actualizar último inicio de sesión en Firestore
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      // Verificar si el documento existe
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const today = new Date();
        await updateDoc(userRef, {
          "stats.lastLogin": today,
        });
      }

>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
      alert("Login successful!");
      navigate("/Hands-AI/profile");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Log In
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
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
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
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
              disabled={loading}
<<<<<<< HEAD
              className={`w-full ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
=======
              className={`w-full ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
            >
              {loading ? "Iniciando sesión..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
