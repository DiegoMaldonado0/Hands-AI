import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("Reconocimiento detenido.");
  const [isGameOn, setIsGameOn] = useState(false);
  const [targetLetter, setTargetLetter] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameMessage, setGameMessage] = useState("");
  const targetLetterRef = useRef(targetLetter);
  const timerRef = useRef(null);

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
        setRecognizedText(`Letra reconocida: ${data.recognized_text}`);

        if (data.recognized_text === targetLetterRef.current) {
          setScore((prevScore) => prevScore + 1);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
          resetTimer();
          generateRandomLetter();
        }
      } catch (error) {
        console.error("Error al enviar el fotograma:", error);
      }

      setTimeout(captureFrameAndSend, 1000);
    }

    if (isRecognizing) {
      captureFrameAndSend();
    }

    startCamera();
  }, [isRecognizing]);

  useEffect(() => {
    if (isGameOn) {
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
          setGameMessage("¡Perdiste!");
          generateRandomLetter();
          return 10;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setTimeLeft(10);
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

  function generateRandomLetter() {
    const randomIndex = Math.floor(Math.random() * letters.length);
    const letter = letters[randomIndex];
    setTargetLetter(letter);
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
          Simón Dice!
        </motion.h1>
        <p className="text-lg mb-8">
          Pon a prueba tus habilidades y copia las letras en lenguaje de señas.
          ¿Puedes seguir el ritmo de Simón?
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="w-full md:w-1/2">
            <video
              id="video"
              className="w-3/4 sm:w-full max-w-xs md:max-w-full rounded-lg border border-gray-300 shadow-lg mx-auto"
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={() => setIsRecognizing(!isRecognizing)}
              className="mt-4 px-6 py-3 text-black bg-white hover:bg-[#100c14] hover:text-white font-bold rounded-lg shadow-md transition"
            >
              {isRecognizing ? "Detener reconocimiento" : "Iniciar reconocimiento"}
            </button>
            <p className="mt-2 text-sm">{recognizedText}</p>
          </div>
          <div className="w-full md:w-1/2 text-center">
            <div className="p-6 bg-white text-black rounded-lg shadow-md mb-4">
              <motion.p
                className="text-4xl font-bold text-black drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                key={targetLetter}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Simón dice: {targetLetter}
              </motion.p>
            </div>

            {/* Circular progress */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                  />
                  <path
                    className="text-red-500 transition-all duration-1000"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="100"
                    strokeDashoffset={(100 - (timeLeft / 5) * 100).toFixed(2)}
                    d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-600">
                  {timeLeft}s
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#6366f1] text-white rounded-lg shadow-md">
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
              className="mt-6 px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-lg shadow-md transition"
            >
              {isGameOn ? "Detener el juego" : "Empieza a jugar!"}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;