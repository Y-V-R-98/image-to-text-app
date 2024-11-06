import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Tesseract from "tesseract.js";
import TextRecognition from "./TextRecognition";
import WebcamCapture from "./WebcamCapture";
import { AppContainer } from "@/styles/styled-components/landingPage";
import RotatingSquares from "./RotatingSquares";
// import SpinnerOrbitsAnimation from "./SpinnerOrbitsAnimation";
// import ImageUploader from "./ImageUploader";
const ImageUploader = dynamic(() => import("./ImageUploader"), {
  ssr: false,
});

export default function LandingPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  // Use a ref to create an off-screen canvas
  const offScreenCanvasRef = useRef(document.createElement("canvas"));

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setSelectedImage(URL.createObjectURL(image));
  };

  const preprocessImage = async (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = offScreenCanvasRef.current;
        const ctx = canvas.getContext("2d");

        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        thresholdFilter(image.data, 0.5);

        // Set the canvas dimensions to the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Perform any preprocessing here if needed
        // Example: ctx.filter = 'brightness(1.2)'; // Just an example filter

        // Get image data for Tesseract
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      };
    });
  };

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        const preprocessedImage = await preprocessImage(selectedImage);
        const result = await Tesseract.recognize(preprocessedImage, "eng", {
          logger: (m) => console.log(m),
        });

        // Get Confidence score
        let confidence = result.confidence;
        console.log(confidence);

        // Get full output
        let text = result.data.text;
        setRecognizedText(text);
      }
    };
    recognizeText();
  }, [selectedImage]);

  return (
    <AppContainer>
      {!selectedImage && (
        <ImageUploader
          handleImageUpload={handleImageUpload}
          selectedImage={selectedImage}
        />
      )}
      {selectedImage && <TextRecognition recognizedText={recognizedText} />}
      {/* <WebcamCapture
        setSelectedImage={setSelectedImage}
        selectedImage={selectedImage}
      /> */}
    </AppContainer>
  );
}
