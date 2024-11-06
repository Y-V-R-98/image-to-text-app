import styled from "styled-components";

export const WebcamContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export const WebcamVideo = styled.video`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  /* Apply specific styles only for mobile devices */
  @media (max-width: 767px) {
    height: 100vh;
    object-fit: cover;
    border-radius: 0;
  }
`;

export const PreviewImg = styled.img`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: 100vh;
    object-fit: cover;
    border-radius: 0;
  }
`;

export const WebcamCanvas = styled.canvas`
  display: none; /* Hide canvas by default */
`;

export const WebcamButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;