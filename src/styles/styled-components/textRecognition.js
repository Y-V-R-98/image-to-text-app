import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* Dark semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Make sure it is on top */
`;

export const ModalContent = styled.div`
  background-color: #f8d24a;
  background-image: url("/mj.gif");
  //  background-image: url("/migrating-whales.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

export const CloseButton = styled.button`
  background-color: #ff5f5f;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #ff2d2d;
  }
`;

export const InvertedText = styled.p`
  -webkit-filter: invert(100%);
  mix-blend-mode: difference;
  color: #1c1c1c;
  font-size: 20px;
  line-height: 125%;
  filter: invert(1) grayscale(1) contrast(9) drop-shadow(.05em .05em red)
`;
