import { useState, useEffect, useRef } from "react";
import { BackgroundCircles } from "./design/Hero";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Section from "./Section";
import { motion } from "framer-motion";

const WordBuilder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedLetter, setRecognizedLetter] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [user, setUser] = useState(null);
  const [completedWords, setCompletedWords] = useState([]);
  const videoRef = useRef(null);
  const captureInterval = useRef(null);

  // Efecto para autenticación de usuario
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Cargar palabras completadas
        await loadUserWords(currentUser.uid);
      } else {
        setUser(null);
        setCompletedWords([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cargar palabras completadas del usuario
  const loadUserWords = async (userId) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCompletedWords(userData.completedWords || []);
      }
    } catch (error) {
      console.error("Error al cargar palabras del usuario:", error);
    }
  };

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    }

    startCamera();

    return () => {
      if (captureInterval.current) {
        clearInterval(captureInterval.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFrameAndSend = async () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const response = await fetch(
        "https://proyecto-manos-1.onrender.com/recognize-sign",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setRecognizedLetter(data.recognized_text);
    } catch (error) {
      console.error("Error al enviar el fotograma:", error);
    }
  };

  const toggleRecognition = () => {
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const startRecognition = () => {
    setIsRecording(true);
    captureFrameAndSend();
    captureInterval.current = setInterval(captureFrameAndSend, 1000);
  };

  const stopRecognition = () => {
    setIsRecording(false);
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
  };

  const addLetterToWord = () => {
    if (recognizedLetter) {
      setCurrentWord((prevWord) => prevWord + recognizedLetter);
      setRecognizedLetter("");
    }
  };

  const resetWord = () => {
    setCurrentWord("");
    setValidationMessage("");
  };

  // Función para validar la palabra usando la API de Datamuse
  const validateWord = async () => {
    if (!currentWord) {
      setValidationMessage("Por favor, construye una palabra primero.");
      return;
    }

    setIsValidating(true);
    setValidationMessage("Validando...");

    try {
      const encodedWord = encodeURIComponent(currentWord.toLowerCase());
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${encodedWord}&v=es&max=1`
      );
      const data = await response.json();

      const isValid = 
        Array.isArray(data) && 
        data.length > 0 && 
        data[0].word.toLowerCase() === currentWord.toLowerCase();

      if (isValid) {
        setValidationMessage("¡Palabra válida! 🎉");
        // Si el usuario está autenticado, registrar la palabra completada
        if (user) {
          await registerCompletedWord();
        } else {
          setValidationMessage("¡Palabra válida! 🎉 (Inicia sesión para guardar tu progreso)");
        }
      } else {
        setValidationMessage("Palabra no válida en español. Intenta otra.");
      }
    } catch (error) {
      console.error("Error al validar la palabra:", error);
      setValidationMessage("Error al validar. Inténtalo de nuevo.");
    } finally {
      setIsValidating(false);
    }
  };

  // Función para registrar una palabra completada en Firebase
  const registerCompletedWord = async () => {
    if (!user) return;
    
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      
      // Obtener el documento actual del usuario
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentWordsCompleted = userData.stats?.wordsCompleted || 0;
        
        // Verificar si la palabra ya está registrada
        const userCompletedWords = userData.completedWords || [];
        if (userCompletedWords.includes(currentWord.toLowerCase())) {
          setValidationMessage("¡Ya has registrado esta palabra antes!");
          return;
        }
        
        // Incrementar el contador de palabras completadas
        await updateDoc(userRef, {
          "stats.wordsCompleted": currentWordsCompleted + 1,
          "completedWords": arrayUnion(currentWord.toLowerCase())
        });
        
        // Actualizar la lista local de palabras completadas
        setCompletedWords([...completedWords, currentWord.toLowerCase()]);
        
        // Verificar si el usuario ha alcanzado 10 palabras para la insignia
        if (currentWordsCompleted + 1 >= 10) {
          // Verificar si ya tiene la insignia
          const hasBadge = userData.userBadges?.some(
            badge => badge.badgeId === "04" && badge.earnedAt
          );
          
          if (!hasBadge) {
            // Buscar si existe la insignia pero sin fecha
            const badgeIndex = userData.userBadges?.findIndex(
              badge => badge.badgeId === "04"
            );
            
            if (badgeIndex >= 0) {
              // Actualizar la insignia existente
              await updateDoc(userRef, {
                [`userBadges.${badgeIndex}.earnedAt`]: new Date(),
                [`userBadges.${badgeIndex}.progress`]: 1
              });
              setValidationMessage("¡Palabra válida! 🎉 ¡Has ganado la insignia de Comunicador!");
            } else {
              // Añadir nueva insignia
              const userBadges = userData.userBadges || [];
              await updateDoc(userRef, {
                userBadges: [...userBadges, {
                  badgeId: "04",
                  earnedAt: new Date(),
                  progress: 1
                }]
              });
              setValidationMessage("¡Palabra válida! 🎉 ¡Has ganado la insignia de Comunicador!");
            }
          } else {
            setValidationMessage("¡Palabra válida! 🎉");
          }
        } else {
          setValidationMessage(`¡Palabra válida! 🎉 Has completado ${currentWordsCompleted + 1} de 10 palabras para la insignia.`);
        }
      }
    } catch (error) {
      console.error("Error al registrar palabra completada:", error);
      setValidationMessage("Error al guardar tu progreso. Inténtalo de nuevo.");
    }
  };

  const removeLastLetter = () => {
    setCurrentWord(prev => prev.slice(0, -1));
  };

  return (
    <Section className="relative pt-20 pb-10 text-white">
      <BackgroundCircles className="absolute top-0 left-0 w-full h-full -z-10" />
      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          className="text-6xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Constructor de Palabras
        </motion.h1>
        <p className="text-lg mb-8">
          Construye palabras usando el lenguaje de señas. ¡Completa 10 palabras para ganar la insignia de Comunicador!
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-1/2">
            <video
              ref={videoRef}
              className="w-full rounded-lg border border-gray-300 shadow-lg"
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={toggleRecognition}
              className={`mt-4 px-6 py-3 w-full text-black font-bold rounded-lg shadow-md transition ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-white hover:bg-[#100c14] hover:text-white"
              }`}
            >
              {isRecording ? "Detener reconocimiento" : "Iniciar reconocimiento"}
            </button>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-full mb-4">
              <h2 className="text-xl font-bold mb-2">Letra reconocida:</h2>
              <div className="text-5xl font-bold mb-4 h-16 flex items-center justify-center">
                {recognizedLetter || "-"}
              </div>
              
              <button
                onClick={addLetterToWord}
                disabled={!recognizedLetter}
                className={`px-4 py-2 rounded-lg w-full mb-2 ${
                  recognizedLetter 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Añadir letra
              </button>
            </div>
            
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-full">
              <h2 className="text-xl font-bold mb-2">Palabra actual:</h2>
              <div className="text-4xl font-bold mb-4 min-h-16 p-2 bg-gray-700 rounded-lg">
                {currentWord || "..."}
              </div>
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={removeLastLetter}
                  disabled={!currentWord}
                  className={`px-4 py-2 rounded-lg flex-1 ${
                    currentWord 
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Borrar última
                </button>
                
                <button
                  onClick={resetWord}
                  disabled={!currentWord}
                  className={`px-4 py-2 rounded-lg flex-1 ${
                    currentWord 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Reiniciar
                </button>
              </div>
              
              <button
                onClick={validateWord}
                disabled={!currentWord || isValidating}
                className={`px-4 py-2 rounded-lg w-full ${
                  currentWord && !isValidating
                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isValidating ? "Validando..." : "Validar palabra"}
              </button>
              
              {validationMessage && (
                <div className={`mt-4 p-2 rounded-lg ${
                  validationMessage.includes("válida") 
                    ? "bg-green-500/20 text-green-300" 
                    : "bg-red-500/20 text-red-300"
                }`}>
                  {validationMessage}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {user && completedWords.length > 0 && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Tus palabras completadas ({completedWords.length}):</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {completedWords.map((word, index) => (
                <div key={index} className="px-3 py-1 bg-indigo-600 rounded-full text-white">
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default WordBuilder;
