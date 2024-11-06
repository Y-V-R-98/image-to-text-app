import { FileUpload, ImageContainer, UploadInput } from "@/styles/styled-components/imageUploader";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ImageUploader = ({ handleImageUpload, selectedImage, setIsSelectingImage, recognizedWords, showRedHighlights }) => {
  const inputRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  const handleInputClick = (e) => {
    e?.stopPropagation();
    setIsSelectingImage(true);
  };

  const handleInputChange = (event) => {
    if (event.target.files.length > 0) {
      handleImageUpload(event);
    }
    setIsSelectingImage(false);
  };

  // Effect to set image size after it loads
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const containerWidth = imageContainerRef.current.offsetWidth;
      const renderedHeight = (img.naturalHeight / img.naturalWidth) * containerWidth;
      setImageSize({
        width: containerWidth,
        height: renderedHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    }
  }, [selectedImage]);

  const scaleBoundingBox = (box) => {
    const widthScale = imageSize.width / imageSize.naturalWidth;
    const heightScale = imageSize.height / imageSize.naturalHeight;

    const padding = 5;

    return {
      left: box.x0 * widthScale - padding,
      top: box.y0 * heightScale - padding,
      width: (box.x1 - box.x0) * widthScale + 2 * padding,
      height: (box.y1 - box.y0) * heightScale + 2 * padding,
    };
  };

  return (
    <ImageContainer onClick={handleInputClick} selected={!!selectedImage}>
      <FileUpload selected={!!selectedImage} style={{ position: "relative" }}>
        {selectedImage ? (
          <>
            {/* Render the image */}
            <div ref={imageContainerRef} style={{ position: "relative" }}>
              <Image
                src={selectedImage}
                alt="Uploaded"
                layout="responsive"
                width={imageSize.width || 800}
                height={imageSize.height || 600}
                ref={imageRef}
                onLoad={() => {
                  const img = imageRef.current;
                  const containerWidth = imageContainerRef.current.offsetWidth;
                  const renderedHeight = (img.naturalHeight / img.naturalWidth) * containerWidth;
                  setImageSize({
                    width: containerWidth,
                    height: renderedHeight,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                  });
                }}
              />

              {/* Render the bounding boxes */}
              {recognizedWords.map((word, index) => {
                const scaledBox = scaleBoundingBox(word.boundingBox);
                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      border: `2px solid ${showRedHighlights ? "red" : "transparent"}`,
                      left: `${scaledBox.left}px`,
                      top: `${scaledBox.top}px`,
                      width: `${scaledBox.width}px`,
                      height: `${scaledBox.height}px`,
                      pointerEvents: "none",
                    }}
                  />
                );
              })}
            </div>
          </>
        ) : (
          `+`
        )}
        <UploadInput
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          selected={!!selectedImage}
          ref={inputRef}
        />
      </FileUpload>
    </ImageContainer>
  );
};

export default ImageUploader;
