import { curve, heroBackground, sampleImage } from "../assets"; // Import your additional image
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { useRef, useState, useEffect } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Conjunto de letras

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("Stopped recognition.");
  const [isGameOn, setIsGameOn] = useState(false);
  const [targetLetter, setTargetLetter] = useState(""); // Letra aleatoria a reconocer
  const [score, setScore] = useState(0); // Puntaje del usuario
  const [timeLeft, setTimeLeft] = useState(5); // Estado para el temporizador
  const [gameMessage, setGameMessage] = useState(""); // Mensaje del juego
  const targetLetterRef = useRef(targetLetter); // Ref para targetLetter
  const timerRef = useRef(null); // Ref para controlar el temporizador  

  useEffect(() => {
    const video = document.getElementById("video");

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await fetch("https://proyecto-manos-1.onrender.com/recognize-sign", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setRecognizedText(`Recognized letter: ${data.recognized_text}`);

        if (data.recognized_text === targetLetterRef.current) {
          setIsGameOn(true);
          setScore(prevScore => prevScore + 1); // Incrementar el puntaje
          resetTimer(); // Reiniciar el temporizador cuando acierta
          generateRandomLetter(); // Generar una nueva letra
        }
      } catch (error) {
        console.error("Error al enviar el fotograma:", error);
      }

      setTimeout(captureFrameAndSend, 1000); // 1 segundo entre capturas
    }

    if (isRecognizing) {
      captureFrameAndSend();
    }

    startCamera();
    generateRandomLetter(); // Generar la primera letra al iniciar
  }, [isRecognizing]);

  useEffect(() => {
    if (isGameOn) {
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
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

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
  
  function generateRandomLetter() {
    const randomIndex = Math.floor(Math.random() * letters.length);
    const letter = letters[randomIndex];
    setTargetLetter(letter);
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
              autoPlay
              playsInline
              muted
            />
            <button
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
      </div>
    </Section>
  );
};

export default Hero;
