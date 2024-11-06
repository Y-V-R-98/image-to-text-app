import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Tesseract from "tesseract.js";
import TextRecognition from "./TextRecognition";
import WebcamCapture from "./WebcamCapture";
import {
  AppContainer,
  StyledButton,
} from "@/styles/styled-components/landingPage";
import RotatingSquares from "./RotatingSquares";
import {
  blurARGB,
  dilate,
  invertColors,
  thresholdFilter,
} from "../utils/preprocess";
import {
  CloseButton,
  ModalContent,
  ModalOverlay,
} from "@/styles/styled-components/textRecognition";
// import SpinnerOrbitsAnimation from "./SpinnerOrbitsAnimation";
// import ImageUploader from "./ImageUploader";
const ImageUploader = dynamic(() => import("./ImageUploader"), {
  ssr: false,
});

export default function LandingPage() {
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [imageHistory, setImageHistory] = useState([]);
  const [recognizedWords, setRecognizedWords] = useState([]); 
  const [redoStack, setRedoStack] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [isProcessing, setIsProcessing] = useState("");
  const [isSelectingImage, setIsSelectingImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRedHighlights, setShowRedHighlights] = useState(false)
  // Use a ref to create an off-screen canvas
  const offScreenCanvasRef = useRef(document.createElement("canvas"));

  console.log("isSelectingImage:", isSelectingImage);

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    const imageUrl = URL.createObjectURL(image);
    // setIsProcessing(true)
    setOriginalImage(imageUrl);
    setImageHistory([imageUrl]);
    setRedoStack([]);
    setIsSelectingImage(false);
  };

  useEffect(() => {
    originalImage && setSelectedImage(originalImage);
  }, [originalImage]);

  const applyFilter = (filterFunction, filterName) => {
    const canvas = offScreenCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = selectedImage;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      filterFunction(imageData.data, canvas);
      ctx.putImageData(imageData, 0, 0);

      // Updating selected image with new transformed image
      const transformedImageUrl = canvas.toDataURL("image/jpeg");

      // Tracking image history
      setImageHistory((prevHistory) => [...prevHistory, transformedImageUrl]);
      setRedoStack([]);
      setSelectedImage(transformedImageUrl);

      setAppliedFilters((prevFilters) => [...prevFilters, filterName]);
    };
  };

  // Button Handlers
  const handleBlur = () =>
    applyFilter((data, canvas) => blurARGB(data, canvas, 1), "blur");
  const handleDilate = () =>
    applyFilter((data, canvas) => dilate(data, canvas), "dilate");
  const handleInvert = () => applyFilter(invertColors, "invert");
  const handleThreshold = () =>
    applyFilter((data) => thresholdFilter(data, 0.4), "threshold");
  const resetImage = () => {
    setSelectedImage(originalImage);
    setImageHistory([originalImage]);
    setRedoStack([]);
    setAppliedFilters([]);
  };
  const undoLastAction = () => {
    if (imageHistory.length > 1) {
      const newHistory = [...imageHistory];
      const lastImage = newHistory.pop();
      setRedoStack((prevRedo) => [lastImage, ...prevRedo]);
      setSelectedImage(newHistory[newHistory.length - 1]);
      setImageHistory(newHistory);
      setAppliedFilters((prevFilters) => prevFilters.slice(0, -1));
    }
  };
  const redoLastAction = () => {
    if (redoStack.length > 0) {
      const lastRedo = redoStack[0];
      setRedoStack(redoStack.slice(1));
      setImageHistory((prevHistory) => [...prevHistory, lastRedo]);
      setSelectedImage(lastRedo);
      // Optionally: Re-apply the last removed filter
    }
  };
  const saveFilterSequence = () => {
    localStorage.setItem("filterSequence", JSON.stringify(appliedFilters));
  };

  const applySavedSequence = async () => {
    const savedFilters = JSON.parse(localStorage.getItem("filterSequence"));
    
    if (savedFilters && savedFilters.length > 0) {
      let currentImage = originalImage; // Start with the original image
      
      for (const filter of savedFilters) {
        switch (filter) {
          case "blur":
            currentImage = await applyFilterSequence((data, canvas) => blurARGB(data, canvas, 1), "blur", currentImage);
            break;
          case "dilate":
            currentImage = await applyFilterSequence((data, canvas) => dilate(data, canvas), "dilate", currentImage);
            break;
          case "invert":
            currentImage = await applyFilterSequence(invertColors, "invert", currentImage);
            break;
          case "threshold":
            currentImage = await applyFilterSequence((data) => thresholdFilter(data, 0.4), "threshold", currentImage);
            break;
          default:
            break;
        }
      }
    }
  };
  

  const applyFilterSequence = (filterFunction, filterName, imageToProcess) => {
    return new Promise((resolve) => {
      const canvas = offScreenCanvasRef.current;
      const ctx = canvas.getContext("2d");
  
      const img = new Image();
      img.src = imageToProcess; 
  
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        filterFunction(imageData.data, canvas); 
        ctx.putImageData(imageData, 0, 0);
  
        const transformedImageUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(transformedImageUrl);
        setImageHistory((prevHistory) => [...prevHistory, transformedImageUrl]); 
        
        setTimeout(() => resolve(transformedImageUrl), 200);
      };
    });
  };

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        const result = await Tesseract.recognize(selectedImage, "eng");

        // Get Confidence score
        let confidence = result.confidence;
        console.log("confidence:", confidence);
        
        // Get full output
        let text = result.data.text;
        console.log("result.data:", result.data);
        setRecognizedText(text);
        setRecognizedWords(result.data.words.map(word => ({
          text: word.text,
          boundingBox: {
            x0: Math.round(word.bbox.x0),
            y0: Math.round(word.bbox.y0),
            x1: Math.round(word.bbox.x1),
            y1: Math.round(word.bbox.y1),
          },
        })));
      }
    };
    recognizeText();
  }, [selectedImage]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <AppContainer>
      {/* <RotatingSquares /> */}
      {originalImage && (
        <div className="filter-buttons">
          <StyledButton onClick={handleBlur} title="Apply Blur" />
          <StyledButton onClick={handleDilate} title="Apply Dilate" />
          <StyledButton onClick={handleInvert} title="Invert Colors" />
          <StyledButton onClick={handleThreshold} title="Apply Threshold" />
          <StyledButton
            onClick={resetImage}
            title="Reset to Original"
            type="fill"
            color="red"
          />
          <StyledButton
            onClick={undoLastAction}
            title="Undo"
            type="fill"
            color="orange"
          />
          <StyledButton
            onClick={redoLastAction}
            title="Redo"
            type="fill"
            color="blue"
          />
          <StyledButton
            onClick={() => setShowModal(true)}
            title="Show Text"
            type="fill"
            color="green"
          />
          <StyledButton
            onClick={() => setShowRedHighlights(!showRedHighlights)}
            title="Toggle Red Highlights"
            type="fill"
            color="torquiose"
          />
          <StyledButton
            onClick={saveFilterSequence}
            title="Save Sequence"
            type="fill"
            color="purple"
          />
          <StyledButton
            onClick={applySavedSequence}
            title="Apply Saved Sequence"
            type="fill"
            color="teal"
          />
        </div>
      )}
      <ImageUploader
        handleImageUpload={handleImageUpload}
        selectedImage={selectedImage}
        setIsSelectingImage={setIsSelectingImage}
        isSelectingImage={isSelectingImage}
        recognizedWords={recognizedWords}
        showRedHighlights={showRedHighlights}
      />
      {originalImage && showModal && (
        <ModalOverlay>
          <ModalContent>
            <TextRecognition
              recognizedText={recognizedText}
              showAni={isProcessing}
            />
            <CloseButton onClick={handleCloseModal}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
      {/* <TextRecognition
        recognizedText={recognizedText}
        showAni={isProcessing}
      /> */}
      {/* <WebcamCapture
        setSelectedImage={setSelectedImage}
        selectedImage={selectedImage}
      /> */}
    </AppContainer>
  );
}
