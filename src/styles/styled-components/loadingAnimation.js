import styled, { keyframes } from 'styled-components';

export const configureClockwise = keyframes`
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const configureXClockwise = keyframes`
  0% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(-135deg);
  }
  75% {
    transform: rotate(-225deg);
  }
  100% {
    transform: rotate(-315deg);
  }
`;

export const SpinnerBox = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Configure Border 1
export const ConfigureBorder1 = styled.div`
  width: 115px;
  height: 115px;
  padding: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fb5b53;
  animation: ${configureClockwise} 3s ease-in-out 0s infinite alternate;
`;

// Configure Border 2
export const ConfigureBorder2 = styled.div`
  width: 115px;
  height: 115px;
  padding: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(63, 249, 220);
  transform: rotate(45deg);
  animation: ${configureXClockwise} 3s ease-in-out 0s infinite alternate;
`;

// Configure Core
export const ConfigureCore = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgb(10,10,10);
`;