import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
   // lessonsCompleted: 0,
    badges: 0,
    daysStreak: 0,
   // totalPoints: 0,
    lettersLearned: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Obtener datos del usuario desde Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Actualizar el último login y verificar racha
            const lastLogin = userData.stats?.lastLogin?.toDate() || new Date();
            const today = new Date();
            const lastLoginDate = new Date(lastLogin);
            
            // Verificar si es un nuevo día (comparando solo la fecha, no la hora)
            const isNewDay = 
              lastLoginDate.getDate() !== today.getDate() || 
              lastLoginDate.getMonth() !== today.getMonth() || 
              lastLoginDate.getFullYear() !== today.getFullYear();
            
            // Si es un nuevo día, verificar si es el día siguiente en el calendario
            let isNextDay = false;
            if (isNewDay) {
              // Crear fechas sin la hora para comparar solo las fechas
              const lastDateOnly = new Date(
                lastLoginDate.getFullYear(),
                lastLoginDate.getMonth(),
                lastLoginDate.getDate()
              );
              const todayDateOnly = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              
              // Calcular diferencia en días entre fechas (sin hora)
              const timeDiff = todayDateOnly.getTime() - lastDateOnly.getTime();
              const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
              
              if (dayDiff === 1) {
                isNextDay = true;
              }
            }
            
            // Actualizar estadísticas
            let currentStreak = userData.stats?.daysStreak || 0;
            if (isNewDay) {
              if (isNextDay) {
                // Incrementar racha si es el día siguiente
                currentStreak += 1;
              } else if (dayDiff > 1) {
                // Reiniciar racha si se saltó un día
                currentStreak = 1;
              }
              
              // Actualizar último login
              await updateDoc(doc(db, "users", currentUser.uid), {
                "stats.lastLogin": today,
                "stats.daysStreak": currentStreak
              });
            }
            
            // Contar insignias obtenidas
            // Cuando procesas las insignias en UserProfile.jsx
            const earnedBadges = userData.userBadges?.filter(badge => 
              badge.earnedAt !== null && 
              badge.earnedAt !== undefined && 
              badge.earnedAt !== ""
            ) || [];
            
            // Actualizar estado con datos del usuario
            setStats({
              lessonsCompleted: userData.stats?.wordsCompleted || 0,
              badges: earnedBadges.length,
              daysStreak: currentStreak,
              totalPoints: (userData.stats?.lettersLearned?.length || 0) * 10 + earnedBadges.length * 50,
              lettersLearned: userData.stats?.lettersLearned || []
            });
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      } else {
        navigate("/login");
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
    return null;
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
                <p className="text-gray-400 text-sm">Palabras completadas</p>
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
                    <p className="text-indigo-400 font-medium">
                      {Math.min(Math.round((stats.lettersLearned.length / 26) * 100), 100)}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(Math.round((stats.lettersLearned.length / 26) * 100), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Palabras comunes</h3>
                    <p className="text-gray-400 text-sm">Vocabulario básico</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 font-medium">
                      {Math.min(Math.round((stats.lessonsCompleted / 20) * 100), 100)}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(Math.round((stats.lessonsCompleted / 20) * 100), 100)}%` }}
                  ></div>
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
