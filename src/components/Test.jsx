<<<<<<< HEAD
import { curve, heroBackground, sampleImage } from "../assets"; // Import your additional image
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { useRef, useState, useEffect } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Conjunto de letras
=======
import { curve, heroBackground, sampleImage } from "../assets";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
<<<<<<< HEAD
  const [recognizedText, setRecognizedText] = useState("Stopped recognition.");
  const [isGameOn, setIsGameOn] = useState(false);
  const [targetLetter, setTargetLetter] = useState(""); // Letra aleatoria a reconocer
  const [score, setScore] = useState(0); // Puntaje del usuario
  const [timeLeft, setTimeLeft] = useState(5); // Estado para el temporizador
  const [gameMessage, setGameMessage] = useState(""); // Mensaje del juego
  const targetLetterRef = useRef(targetLetter); // Ref para targetLetter
  const timerRef = useRef(null); // Ref para controlar el temporizador  
=======
  const [recognizedText, setRecognizedText] = useState(
    "Reconocimiento detenido."
  );
  const [isGameOn, setIsGameOn] = useState(false);
  const [targetLetter, setTargetLetter] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameMessage, setGameMessage] = useState("");
  const targetLetterRef = useRef(targetLetter);
  const timerRef = useRef(null);
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc

  useEffect(() => {
    const video = document.getElementById("video");

    async function startCamera() {
      try {
<<<<<<< HEAD
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
=======
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        video.srcObject = stream;
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    }

    async function captureFrameAndSend() {
      if (!isRecognizing) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
<<<<<<< HEAD
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
=======
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
<<<<<<< HEAD
        const response = await fetch("https://proyecto-manos.onrender.com/recognize-sign", {
          method: "POST",
          body: formData,
        });
=======
        const response = await fetch(
          "https://proyecto-manos.onrender.com/recognize-sign",
          {
            method: "POST",
            body: formData,
          }
        );
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        const data = await response.json();
        setRecognizedText(`Recognized letter: ${data.recognized_text}`);

        if (data.recognized_text === targetLetterRef.current) {
<<<<<<< HEAD
          setIsGameOn(true);
          setScore(prevScore => prevScore + 1); // Incrementar el puntaje
          resetTimer(); // Reiniciar el temporizador cuando acierta
          generateRandomLetter(); // Generar una nueva letra
=======
          setScore((prevScore) => prevScore + 1);
          resetTimer();
          generateRandomLetter();
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        }
      } catch (error) {
        console.error("Error al enviar el fotograma:", error);
      }

<<<<<<< HEAD
      setTimeout(captureFrameAndSend, 1000); // 1 segundo entre capturas
=======
      setTimeout(captureFrameAndSend, 1000);
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
    }

    if (isRecognizing) {
      captureFrameAndSend();
    }

    startCamera();
<<<<<<< HEAD
    generateRandomLetter(); // Generar la primera letra al iniciar
=======
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
  }, [isRecognizing]);

  useEffect(() => {
    if (isGameOn) {
<<<<<<< HEAD
      startTimer(); // Iniciar el temporizador cuando comienza el reconocimiento
    } else {
      stopTimer(); // Detener el temporizador cuando se pausa el reconocimiento
    }
  }, [isGameOn]);

  // Función para iniciar el temporizador
  const startTimer = () => {
    stopTimer(); // Asegurarse de que no haya temporizadores activos previos
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setIsGameOn(false);
          setGameMessage("¡You've lost!"); // Mensaje de pérdida
          generateRandomLetter(); // Generar una nueva letra (opcional)
          return 5; // Reiniciar a 5 segundos
        }
        return prevTime - 1; // Disminuir el tiempo
      });
    }, 1000); // Ejecutar cada 1 segundo
  };

  // Función para detener el temporizador
=======
      startTimer();
    } else {
      stopTimer();
    }
  }, [isGameOn]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsGameOn(false);
          setGameMessage("You've lost!");
          generateRandomLetter();
          return 5;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

<<<<<<< HEAD
  // Función para reiniciar el temporizador
  const resetTimer = () => {
    setTimeLeft(5); // Reiniciar a 3 segundos
    stopTimer(); // Detener temporizadores previos
    startTimer(); // Comenzar el nuevo temporizador
  };

  // Función para reiniciar el juego
  const restartGame = () => {
    setScore(0); // Reiniciar el puntaje
    resetTimer();
    setGameMessage(""); // Restablecer el mensaje del juego
    generateRandomLetter(); // Generar una nueva letra
  };

  function toggleRecognition() {
    setIsRecognizing((prev) => !prev);
    setRecognizedText(isRecognizing ? "Stopped recognition." : "Recognizing...");
  }

  function toggleGameIsOn() {
    if(!isGameOn) restartGame();
    setIsGameOn((prev) => !prev);
  }
  
=======
  const resetTimer = () => {
    setTimeLeft(5);
    stopTimer();
    startTimer();
  };

  const restartGame = () => {
    setScore(0);
    resetTimer();
    setGameMessage("");
    generateRandomLetter();
  };

  const toggleGame = () => {
    if (!isGameOn) restartGame();
    setIsGameOn((prev) => !prev);
  };

>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
  function generateRandomLetter() {
    const randomIndex = Math.floor(Math.random() * letters.length);
    const letter = letters[randomIndex];
    setTargetLetter(letter);
<<<<<<< HEAD
    targetLetterRef.current = letter; // Actualizar la referencia de la letra objetivo
  }

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="simon"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Learn hand language with &nbsp;AI&nbsp;Chatting with {` `}
            <span className="inline-block relative">
              Hands AI{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Try your best to try and learn basic hand language with AI.
          </p>
          <h1 className="h1 mb-6">Simon Says!</h1>
          <h2 className="text-xl font-bold mb-4">Game Instructions:</h2>
            <ul className="list-disc list-inside mb-4">
              <li>Objective is to replicate letter showed with hand language.</li>
              <li>Make sure system is recognizing your gestures first.</li>
              <li>When you hit play, the game starts</li>
              <li>Simon will throw a random letter which you must replicate within 5 seconds.</li>
              <li>Each letter will be a point.</li>
              <li>Reach as much as you can!</li>
            </ul>
        </div>

        {/* New Flex Container for Video and Image */}
        <div className="relative flex items-center justify-center gap-8 md:max-w-5xl xl:mb-24 mx-auto">
          {/* Left Column: Camera Feed */}
          <div className="w-1/2 flex flex-col items-center mx-auto">
            <video
              id="video"
              className="w-full h-full rounded-md border border-gray-300"
=======
    targetLetterRef.current = letter;
  }

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
          Simon Dice!
        </motion.h1>
        <p className="text-lg mb-8">
          Pon a prueba tus habilidades y copia las letras en lenguaje de señas.
          ¿Puedes seguir el ritmo de Simón?
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-1/2">
            <video
              id="video"
              className="w-full rounded-lg border border-gray-300 shadow-lg"
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
              autoPlay
              playsInline
              muted
            />
            <button
<<<<<<< HEAD
              onClick={toggleRecognition}
              className="mt-2 w-full px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              {isRecognizing ? "Stop recognition" : "Start recognition"}
            </button>
            <p id="output" className="mt-2 text-center text-gray-700">
              {recognizedText}
            </p>
          </div>

          {/* Right Column: Instructions and Score Info */}
          <div className="w-1/2 mx-auto">
            
            {/* Display Target Letter in a Box */}
            <div className="text-center my-4 p-4 border-4 border-blue-500 bg-white rounded-lg">
              <p className="text-5xl font-bold text-blue-500">Simon Says!: {targetLetter}</p>
            </div>

            {/* Timer */}
            <div className="text-center my-4 p-4 border-4 border-red-500 bg-white rounded-lg">
              <p className="text-3xl font-bold text-red-700">Remaining time: {timeLeft}s</p>
            </div>

            {/* Score and Recognized Letter */}
            <div className="text-lg font-bold mb-2">Score: {score}</div>
            <div className="text-lg font-bold">Recognized letter: {recognizedText.slice(-1)}</div>
            {gameMessage && <p className="mt-2 text-center text-red-600">{gameMessage}</p>} {/* Mensaje de pérdida */}

             {/* Restart Game Button */}
             <button
              onClick={toggleGameIsOn}
              className="mt-4 w-full px-4 py-2 text-white bg-green-500 rounded-md"
            >
              {isGameOn ? "Stop the game" : "Let's play!"}
            </button>
          </div>
        </div>
        <BackgroundCircles />
=======
              onClick={() => setIsRecognizing(!isRecognizing)}
              className="mt-4 px-6 py-3 text-black bg-white hover:bg-[#100c14] hover:text-white font-bold rounded-lg shadow-md transition"
            >
              {isRecognizing
                ? "Detener reconocimiento"
                : "Iniciar reconocimiento"}
            </button>
            <p className="mt-2 text-sm">{recognizedText}</p>
          </div>
          <div className="w-full md:w-1/2 text-center">
            <div className="p-6 bg-white text-black rounded-lg shadow-md mb-4">
              <motion.p
                className="text-4xl font-bold"
                key={targetLetter}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Simon Dice: {targetLetter}
              </motion.p>
            </div>
            <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mb-4">
              <p className="text-xl font-bold">Tiempo Restante: {timeLeft}s</p>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-lg shadow-md">
              <p className="text-xl font-bold">Puntuación: {score}</p>
            </div>
            {gameMessage && (
              <motion.p
                className="mt-4 text-red-600 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {gameMessage}
              </motion.p>
            )}
            <button
              onClick={toggleGame}
              className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition"
            >
              {isGameOn ? "Detener el juego" : "Empieza a jugar!"}
            </button>
          </div>
        </div>
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
      </div>
    </Section>
  );
};

export default Hero;
