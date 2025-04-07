import { useState, useEffect, useRef } from "react";

const WordBuilder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedLetter, setRecognizedLetter] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const videoRef = useRef(null);
  const captureInterval = useRef(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const response = await fetch("https://proyecto-manos-g6i1.onrender.com/recognize-sign", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setRecognizedLetter(data.recognized_text);
    } catch (error) {
      console.error("Error al enviar el fotograma:", error);
    }
  };

  const startRecognition = () => {
    setIsRecording(true);
    captureFrameAndSend(); // Ejecuta una captura inicial al hacer clic
    captureInterval.current = setInterval(captureFrameAndSend, 1000); // Captura cada segundo
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
    </div>
  );
};

export default WordBuilder;
