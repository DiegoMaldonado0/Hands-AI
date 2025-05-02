import { useState, useEffect, useRef } from "react";
<<<<<<< HEAD
=======
import { BackgroundCircles } from "./design/Hero";
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc

const WordBuilder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedLetter, setRecognizedLetter] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const videoRef = useRef(null);
  const captureInterval = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
<<<<<<< HEAD
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
=======
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
        videoRef.current.srcObject = stream;
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
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
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
      setRecognizedLetter(data.recognized_text);
    } catch (error) {
      console.error("Error al enviar el fotograma:", error);
    }
  };

<<<<<<< HEAD
  const startRecognition = () => {
    setIsRecording(true);
    captureFrameAndSend(); // Ejecuta una captura inicial al hacer clic
    captureInterval.current = setInterval(captureFrameAndSend, 1000); // Captura cada segundo
=======
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
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
  };

  const stopRecognition = () => {
    setIsRecording(false);
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
  };

  const addLetterToWord = () => {
    setCurrentWord((prevWord) => prevWord + recognizedLetter);
    setRecognizedLetter("");
  };

  const resetWord = () => {
    setCurrentWord("");
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto text-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Word Builder</h2>
      <video
        ref={videoRef}
        className="w-1/2 h-1/2 mx-auto border rounded-md"
        autoPlay
        playsInline
        muted
      />

      <p className="text-lg mt-4">Recognized letter: {recognizedLetter || "..."}</p>

      <button onClick={startRecognition} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        Start recognition
      </button>

      <button onClick={addLetterToWord} className="ml-2 mt-2 px-4 py-2 bg-green-500 text-white rounded-md">
        Add letter
      </button>

      <button onClick={resetWord} className="ml-2 mt-2 px-4 py-2 bg-gray-500 text-white rounded-md">
        New word
      </button>

      <p className="text-xl mt-4">Built Word: {currentWord || "..."}</p>
=======
    <div className="relative flex items-center justify-center overflow-hidden">
      <BackgroundCircles />
      <div className="relative z-10 text-center container mx-auto mt-8 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Constructor de palabras
        </h2>
        <video
          ref={videoRef}
          className="w-full sm:w-1/2 h-auto mx-auto border rounded-md"
          autoPlay
          playsInline
          muted
        />

        <p className="text-base sm:text-lg mt-4">
          Letra reconocida: {recognizedLetter || "..."}
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
          <button
            onClick={toggleRecognition}
            className={`px-4 py-2 rounded-md text-base transition 
            ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white hover:bg-[#100c14] hover:text-white text-black"
            }`}
          >
            {isRecording ? "Detener reconocimiento" : "Iniciar reconocimiento"}
          </button>

          <button
            onClick={addLetterToWord}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Añadir letra
          </button>

          <button
            onClick={resetWord}
            className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
          >
            Nueva palabra
          </button>
        </div>

        <p className="text-lg sm:text-xl mt-4">
          Palabra construida: {currentWord || "..."}
        </p>
      </div>
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
    </div>
  );
};

export default WordBuilder;
