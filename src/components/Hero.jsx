<<<<<<< HEAD
import { curve, heroBackground, sampleImage } from "../assets"; // Import your additional image
=======
import { curve, heroBackground, sampleImage } from "../assets";
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { useRef, useState, useEffect } from "react";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
<<<<<<< HEAD
  const [recognizedText, setRecognizedText] = useState("Stopped recognition.");
=======
  const [recognizedText, setRecognizedText] = useState(
    "Reconocimiento detenido."
  );
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
        const data = await response.json();
        setRecognizedText(`Recognized letter: ${data.recognized_text}`);
=======
        const response = await fetch(
          "https://proyecto-manos.onrender.com/recognize-sign",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        setRecognizedText(`Letra reconocida: ${data.recognized_text}`);
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
      } catch (error) {
        console.error("Error al enviar el fotograma:", error);
      }

      setTimeout(captureFrameAndSend, 1000); // 1 segundo entre capturas
    }

    if (isRecognizing) {
      captureFrameAndSend();
    }

    startCamera();
  }, [isRecognizing]);

  function toggleRecognition() {
    setIsRecognizing((prev) => !prev);
<<<<<<< HEAD
    setRecognizedText(isRecognizing ? "Stopped recognition." : "Recognizing...");
=======
    setRecognizedText(
      isRecognizing ? "Reconocimiento detenido." : "Reconociendo..."
    );
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
  }

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
<<<<<<< HEAD
            Learn hand language with &nbsp;AI&nbsp;Chatting with {` `}
=======
            Aprende lenguaje de señas con {` `}
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
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
<<<<<<< HEAD
            Try your best to try and learn basic hand language with AI.
=======
            Intenta hacer tu mejor esfuerzo para aprender el lenguaje de señas
            básico.
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
          </p>
        </div>

        {/* New Flex Container for Video and Image */}
<<<<<<< HEAD
        <div className="relative flex items-center justify-center gap-8 md:max-w-5xl xl:mb-24 mx-auto">
          {/* Left Column: Camera Feed */}
          <div className="w-1/2 flex flex-col items-center mx-auto">
            <video
              id="video"
              className="w-full h-full rounded-md border border-gray-300"
=======
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:max-w-5xl mx-auto">
          {/* Left Column: Camera Feed */}
          <div className="w-full md:w-2/3 flex flex-col items-center mx-auto">
            <video
              id="video"
              className="w-full h-full rounded-md border border-gray-300 shadow-lg"
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={toggleRecognition}
<<<<<<< HEAD
              className="mt-2 w-full px-4 py-2 text-white bg-blue-500 rounded-md relative z-10"
            >
              {isRecognizing ? "Stop recognition" : "Start recognition"}
            </button>
            <p id="output" className="mt-2 text-center text-gray-700">
              {recognizedText}
            </p>
          </div>

          {/* Right Column: Image */}
          <div className="w-1/2 mx-auto">
            <img
              src={sampleImage}
              alt="Sample"
              className="w-full h-full rounded-md shadow-lg"
=======
              className={`mt-2 w-full px-4 py-2 text-black rounded-md relative z-10 transition 
                ${
                  isRecognizing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white hover:bg-[#100c14] hover:text-white"
                }`}
            >
              {isRecognizing
                ? "Detener reconocimiento"
                : "Empezar reconocimiento"}
            </button>
            <div className="mt-2 flex items-center justify-center gap-2">
              {isRecognizing && (
                <div className="loader border-t-4 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
              )}
              <p
                id="output"
                className={`mt-2 text-center ${
                  isRecognizing ? "text-white" : "text-gray-700"
                }`}
              >
                {recognizedText}
              </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full md:w-1/3 mx-auto flex justify-center items-center relative md:-top-8">
            <img
              src={sampleImage}
              alt="Sample"
              className="w-4/5 h-auto md:w-full rounded-md shadow-lg transition-transform hover:scale-105"
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
            />
          </div>
        </div>
        <BackgroundCircles />
      </div>
    </Section>
  );
};

export default Hero;
