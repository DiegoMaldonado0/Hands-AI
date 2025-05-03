import { curve, heroBackground, sampleImage } from "../assets";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
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

  useEffect(() => {
    const video = document.getElementById("video");

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
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
        setRecognizedText(`Recognized letter: ${data.recognized_text}`);

        if (data.recognized_text === targetLetterRef.current) {
          setScore((prevScore) => prevScore + 1);
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
          setGameMessage("You've lost!");
          generateRandomLetter();
          return 5;
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
              autoPlay
              playsInline
              muted
            />
            <button
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
      </div>
    </Section>
  );
};

export default Hero;
