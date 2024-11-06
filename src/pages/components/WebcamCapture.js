import {
  WebcamButton,
  WebcamCanvas,
  WebcamContainer,
  PreviewImg,
  WebcamVideo,
} from "@/styles/styled-components/webcam";
import { useState, useRef, useEffect } from "react";

const WebcamCapture = ({ setSelectedImage, selectedImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapuringImage, setIsCapturingImage] = useState(false);

  useEffect(() => {
    startWebcam();
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Request the front camera (selfie camera)
        },
      });
      setIsCapturingImage(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  // Function to stop the webcam
  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
      setIsCapturingImage(false);
    }
  };

  const captureImage = () => {
    if (videoRef?.current && canvasRef?.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video stream
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data URL from canvas
        const imageDataUrl = canvas.toDataURL("image/jpeg");

        // Set the captured image
        setCapturedImage(imageDataUrl);
        setSelectedImage(imageDataUrl);

        // Stop the webcam
        stopWebcam();
      }
    }
  };

  const captureBrowserWindow = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = document.createElement("video");

    try {
      // Create a new CaptureController instance
      const controller = new CaptureController();

      // Set focus behavior to keep focus on the capturing app
      controller.setFocusBehavior("no-focus-change");

      // Request screen or window to capture
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        controller,
      });

      video.srcObject = captureStream;

      // Wait for the video to load metadata (dimensions)
      video.onloadedmetadata = () => {
        video.play(); // Start playing the video stream
        video.onplaying = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Add a small delay to ensure the video frame is available
          setTimeout(() => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get the screenshot as a data URL
            const screenshotUrl = canvas.toDataURL("image/png");
            setSelectedImage(screenshotUrl); // Set screenshot as selected image

            // Stop the capture stream after taking the screenshot
            captureStream.getTracks().forEach((track) => track.stop());
          }, 500); // Delay of 500ms to allow video to be fully rendered
        };
      };
    } catch (err) {
      console.error("Error capturing browser window: ", err);
    }
  };

  // Function to reset state (clear media stream and refs)
  const resetState = () => {
    stopWebcam(); // Stop the webcam if it's active
    setCapturedImage(null); // Reset captured image
    setIsCapturingImage(true);
  };

  return (
    <WebcamContainer>
      {!isCapuringImage ? (
        <>
          {selectedImage && (
            <PreviewImg
              className="captured-image"
              src={selectedImage}
              alt="Selected"
            />
          )}
          <WebcamButton onClick={resetState}>Reset</WebcamButton>
        </>
      ) : (
        <>
          <WebcamVideo ref={videoRef} autoPlay muted />
          <WebcamCanvas ref={canvasRef} />
          {!videoRef.current ? (
            <>
              <WebcamButton
                onClick={startWebcam}
                style={{ backgroundColor: "#333", color: "#fff" }}
              >
                Start Webcam
              </WebcamButton>
            </>
          ) : (
            <>
              <WebcamButton onClick={captureImage}>Capture Image</WebcamButton>
              <WebcamButton onClick={captureBrowserWindow}>
                Capture Browser Window
              </WebcamButton>
            </>
          )}
        </>
      )}
    </WebcamContainer>
  );
};

// things to do - https://stackoverflow.com/questions/64253980/stop-navigator-getusermedia-camera-access

export default WebcamCapture;
