import { curve, heroBackground, sampleImage } from "../assets"; 
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { useRef, useState, useEffect } from "react";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("Stopped recognition.");

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
        const response = await fetch("https://proyecto-manos.onrender.com/recognize-sign", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setRecognizedText(`Recognized letter: ${data.recognized_text}`);
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
    setRecognizedText(isRecognizing ? "Stopped recognition." : "Recognizing...");
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
        </div>

        {/* New Flex Container for Video and Image */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:max-w-5xl mx-auto">
          {/* Left Column: Camera Feed */}
          <div className="w-full md:w-2/3 flex flex-col items-center mx-auto">
            <video
              id="video"
              className="w-full h-full rounded-md border border-gray-300 shadow-lg"
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={toggleRecognition}
              className={`mt-2 w-full px-4 py-2 text-black rounded-md relative z-10 transition 
                ${isRecognizing ? "bg-red-500 hover:bg-red-600" : "bg-white hover:bg-[#100c14] hover:text-white"}`}
            >
              {isRecognizing ? "Stop recognition" : "Start recognition"}
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
            />
          </div>
        </div>
        <BackgroundCircles />
      </div>
    </Section>
  );
};

export default Hero;
