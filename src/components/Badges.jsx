import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
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
        requiredValue: 1,
      },
      {
        id: "02",
        name: "Constante",
        description: "Has mantenido una racha de 3 días consecutivos",
        icon: "🔥",
        requirement: "DAYS_STREAK",
        requiredValue: 3,
      },
      {
        id: "03",
        name: "Maestro del Alfabeto",
        description: "Has completado todas las letras del abecedario",
        icon: "🏆",
        requirement: "ALPHABET_MASTERY",
        requiredValue: 26,
      },
      {
        id: "04",
        name: "Comunicador",
        description: "Aprendiste 10 palabras diferentes",
        icon: "💬",
        requirement: "WORDS_COMPLETED",
        requiredValue: 10,
      },
      {
        id: "05",
        name: "Experto",
        description: "Completaste todos los niveles básicos",
        icon: "⭐",
        requirement: "EXPERT",
        requiredValue: 1,
      },
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
            const userBadges = Array.isArray(userData.userBadges)
              ? userData.userBadges
              : [];
            console.log("Insignias del usuario:", userBadges);

            // Combinar las insignias del sistema con el estado del usuario
            const combinedBadges = systemBadges.map((badge) => {
              // Buscar la insignia correspondiente en las insignias del usuario
              const userBadge = userBadges.find(
                (ub) => ub.badgeId === badge.id
              );
              console.log(`Procesando insignia ${badge.id}:`, userBadge);

              let progress = 0;
              let earnedDate = null;
              let isEarned = false;

              // Calcular progreso según el tipo de insignia
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

              // Verificar si la insignia está ganada basado en el progreso actual
              if (progress >= badge.requiredValue) {
                isEarned = true;
                
                // Si la insignia está ganada pero no está registrada en userBadges, actualizarla
                if (!userBadge || !userBadge.earnedAt) {
                  const today = new Date();
                  earnedDate = today;
                  
                  // Actualizar en Firestore (asíncrono)
                  updateUserBadge(db, currentUser.uid, badge.id, today);
                } else {
                  // Usar la fecha existente
                  try {
                    if (typeof userBadge.earnedAt === "object" && userBadge.earnedAt.toDate) {
                      earnedDate = userBadge.earnedAt.toDate();
                    } else if (typeof userBadge.earnedAt === "string") {
                      earnedDate = new Date(userBadge.earnedAt);
                    } else if (userBadge.earnedAt instanceof Date) {
                      earnedDate = userBadge.earnedAt;
                    }
                  } catch (error) {
                    console.error(`Error al procesar fecha de insignia ${badge.id}:`, error);
                    earnedDate = new Date(); // Fecha por defecto
                  }
                }
              } else if (userBadge && userBadge.earnedAt) {
                // Si hay una insignia registrada pero ya no cumple los requisitos
                // (caso raro, pero posible si los requisitos cambian)
                try {
                  if (typeof userBadge.earnedAt === "object" && userBadge.earnedAt.toDate) {
                    earnedDate = userBadge.earnedAt.toDate();
                  } else if (typeof userBadge.earnedAt === "string") {
                    earnedDate = new Date(userBadge.earnedAt);
                  } else if (userBadge.earnedAt instanceof Date) {
                    earnedDate = userBadge.earnedAt;
                  }
                  
                  // Verificar si la fecha es válida
                  isEarned = earnedDate && !isNaN(earnedDate.getTime());
                } catch (error) {
                  console.error(`Error al procesar fecha de insignia ${badge.id}:`, error);
                  isEarned = false;
                }
              }

              return {
                ...badge,
                earned: isEarned,
                date: earnedDate,
                progress: progress,
                progressPercent: Math.min(
                  Math.round((progress / badge.requiredValue) * 100),
                  100
                ),
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

  // Función para actualizar una insignia en Firestore
  const updateUserBadge = async (db, userId, badgeId, earnedDate) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userBadges = Array.isArray(userData.userBadges) ? userData.userBadges : [];
        
        // Buscar si la insignia ya existe
        const badgeIndex = userBadges.findIndex(badge => badge.badgeId === badgeId);
        
        if (badgeIndex >= 0) {
          // Actualizar la insignia existente
          userBadges[badgeIndex] = {
            ...userBadges[badgeIndex],
            earnedAt: earnedDate,
            progress: 1
          };
        } else {
          // Agregar nueva insignia
          userBadges.push({
            badgeId: badgeId,
            earnedAt: earnedDate,
            progress: 1
          });
        }
        
        // Actualizar en Firestore
        await updateDoc(userRef, {
          userBadges: userBadges
        });
        
        console.log(`Insignia ${badgeId} actualizada correctamente`);
      }
    } catch (error) {
      console.error(`Error al actualizar insignia ${badgeId}:`, error);
    }
  };

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
          <p className="text-gray-400">
            Colecciona insignias completando diferentes desafíos
          </p>
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
                    <h3 className="text-xl font-semibold text-white">
                      {badge.name}
                    </h3>
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
                      <span>
                        {badge.progress}/{badge.requiredValue}
                      </span>
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
