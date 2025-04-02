import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Badges = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Datos de ejemplo para las insignias
  const badges = [
    {
      id: 1,
      name: "Principiante",
      description: "Completaste tu primera lección",
      icon: "🌱",
      earned: true,
      date: "2023-10-15"
    },
    {
      id: 2,
      name: "Explorador",
      description: "Completaste 5 lecciones diferentes",
      icon: "🔍",
      earned: true,
      date: "2023-10-20"
    },
    {
      id: 3,
      name: "Constante",
      description: "Mantuviste una racha de 7 días",
      icon: "🔥",
      earned: false,
      date: null
    },
    {
      id: 4,
      name: "Maestro del Alfabeto",
      description: "Dominaste todas las letras del alfabeto",
      icon: "🏆",
      earned: false,
      date: null
    },
    {
      id: 5,
      name: "Comunicador",
      description: "Aprendiste 50 palabras diferentes",
      icon: "💬",
      earned: false,
      date: null
    },
    {
      id: 6,
      name: "Experto",
      description: "Completaste todos los niveles básicos",
      icon: "⭐",
      earned: false,
      date: null
    }
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Aquí podrías cargar los datos de insignias del usuario desde Firebase
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Insignias</h1>
          <p className="text-gray-400">Colecciona insignias completando diferentes desafíos</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`p-6 rounded-lg border ${
                  badge.earned 
                    ? "bg-gray-700 border-indigo-500" 
                    : "bg-gray-800 border-gray-700 opacity-60"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{badge.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{badge.name}</h3>
                    <p className="text-gray-400 text-sm">{badge.description}</p>
                  </div>
                </div>
                
                {badge.earned ? (
                  <div className="mt-4 text-sm text-indigo-400">
                    Obtenida el {new Date(badge.date).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-500">
                    No obtenida aún
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Próximas insignias</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-4">🌟</div>
                <div>
                  <h3 className="text-white font-medium">Políglota</h3>
                  <p className="text-gray-400 text-sm">Aprende 100 palabras diferentes</p>
                </div>
                <div className="ml-auto">
                  <p className="text-indigo-400 font-medium">15/100</p>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-2xl mr-4">🏅</div>
                <div>
                  <h3 className="text-white font-medium">Dedicación</h3>
                  <p className="text-gray-400 text-sm">Mantén una racha de 30 días</p>
                </div>
                <div className="ml-auto">
                  <p className="text-indigo-400 font-medium">3/30</p>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;