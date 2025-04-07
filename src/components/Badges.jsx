import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Badges = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    
    // Definir las insignias disponibles en el sistema
    const systemBadges = [
      {
        id: "01",
        name: "El inicio",
        description: "Crea una cuenta y empieza tu aventura!",
        icon: "👋",
        requirement: "REGISTRATION",
        requiredValue: 1
      },
      {
        id: "02",
        name: "Constante",
        description: "Has mantenido una racha de 3 días consecutivos",
        icon: "🔥",
        requirement: "DAYS_STREAK",
        requiredValue: 3
      },
      {
        id: "03",
        name: "Maestro del Alfabeto",
        description: "Has completado todas las letras del abecedario",
        icon: "🏆",
        requirement: "ALPHABET_MASTERY",
        requiredValue: 26
      },
      {
        id: "04",
        name: "Comunicador",
        description: "Aprendiste 10 palabras diferentes",
        icon: "💬",
        requirement: "WORDS_COMPLETED",
        requiredValue: 10
      },
      {
        id: "05",
        name: "Experto",
        description: "Completaste al menos 5 retos en Simon Says!",
        icon: "⭐",
        requirement: "EXPERT",
        requiredValue: 1
      }
    ];

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Obtener datos del usuario desde Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Datos del usuario:", userData);
            
            // Obtener las insignias del usuario (con validación)
            const userBadges = Array.isArray(userData.userBadges) ? userData.userBadges : [];
            console.log("Insignias del usuario:", userBadges);
            
            // Combinar las insignias del sistema con el estado del usuario
            const combinedBadges = systemBadges.map(badge => {
              // Buscar la insignia correspondiente en las insignias del usuario
              const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
              console.log(`Procesando insignia ${badge.id}:`, userBadge);
              
              let progress = 0;
              let earnedDate = null;
              let isEarned = false;
              
              // Verificar si la insignia está ganada
              if (userBadge && userBadge.earnedAt) {
                try {
                  // Intentar convertir la fecha a un objeto Date
                  if (typeof userBadge.earnedAt === 'object' && userBadge.earnedAt.toDate) {
                    // Es un timestamp de Firestore
                    earnedDate = userBadge.earnedAt.toDate();
                  } else if (typeof userBadge.earnedAt === 'string') {
                    // Es una cadena ISO
                    earnedDate = new Date(userBadge.earnedAt);
                  } else if (userBadge.earnedAt instanceof Date) {
                    // Ya es un objeto Date
                    earnedDate = userBadge.earnedAt;
                  }
                  
                  // Verificar si la fecha es válida
                  isEarned = earnedDate && !isNaN(earnedDate.getTime());
                } catch (error) {
                  console.error(`Error al procesar fecha de insignia ${badge.id}:`, error);
                  isEarned = false;
                }
              }
              
              // Calcular progreso según el tipo de insignia si no está ganada
              if (!isEarned) {
                switch (badge.requirement) {
                  case "DAYS_STREAK":
                    progress = userData.stats?.daysStreak || 0;
                    break;
                  case "ALPHABET_MASTERY":
                    progress = userData.stats?.lettersLearned?.length || 0;
                    break;
                  case "WORDS_COMPLETED":
                    progress = userData.stats?.wordsCompleted || 0;
                    break;
                  case "REGISTRATION":
                    // Si el usuario está registrado, el progreso es 1
                    progress = 1;
                    break;
                }
              } else {
                // Si está ganada, el progreso es el valor requerido
                progress = badge.requiredValue;
              }
              
              return {
                ...badge,
                earned: isEarned,
                date: earnedDate,
                progress: userBadge?.progress || progress,
                progressPercent: Math.min(Math.round((progress / badge.requiredValue) * 100), 100)
              };
            });
            
            setBadges(combinedBadges);
          }
        } catch (error) {
          console.error("Error al obtener datos de insignias:", error);
        }
      } else {
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
    return null;
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
                
                {badge.earned && badge.date ? (
                  <div className="mt-4 text-sm text-indigo-400">
                    Obtenida el {badge.date.toLocaleDateString()}
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progreso</span>
                      <span>{badge.progress}/{badge.requiredValue}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${badge.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;