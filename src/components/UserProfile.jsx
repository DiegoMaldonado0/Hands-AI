import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estadísticas del usuario (podrían venir de una base de datos)
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    badges: 0,
    daysStreak: 0,
    totalPoints: 0
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Aquí podrías cargar los datos del usuario desde Firebase
        // Por ejemplo: fetchUserData(currentUser.uid);
      } else {
        // Redirigir al login si no hay usuario
        navigate("/Hands-AI/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect redirigirá al login
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Encabezado del perfil */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">{user.displayName || "Usuario"}</h1>
                <p className="text-indigo-200">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas del usuario */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Estadísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Lecciones completadas</p>
                <p className="text-3xl font-bold text-white">{stats.lessonsCompleted}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Insignias ganadas</p>
                <p className="text-3xl font-bold text-white">{stats.badges}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Racha actual</p>
                <p className="text-3xl font-bold text-white">{stats.daysStreak} días</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Puntos totales</p>
                <p className="text-3xl font-bold text-white">{stats.totalPoints}</p>
              </div>
            </div>
          </div>

          {/* Progreso reciente */}
          <div className="p-6 border-t border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Progreso reciente</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Aprendizaje básico</h3>
                    <p className="text-gray-400 text-sm">Alfabeto en lenguaje de señas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 font-medium">60%</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Palabras comunes</h3>
                    <p className="text-gray-400 text-sm">Vocabulario básico</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 font-medium">25%</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;