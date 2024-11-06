import styled from "styled-components";

export const AppContainer = styled.div`
  max-width: 1440px;
  margin: auto;
  padding: 20px;
`;

export const StyledButton = styled.button`
  touch-callout: none;
  user-select: none;
  display: inline-block;
  border: 0.2em solid
    ${(props) => (props?.type === "fill" ? "transparent" : "inherit")};
  position: relative;
  cursor: pointer;
  overflow: hidden;
  opacity: 0.6;
  color: ${(props) => (props?.type === "fill" ? "white" : "inherit")};
  background: ${(props) => (props?.type === "fill" ? props?.color : "none")};
  text-transform: uppercase;
  font-weight: bold;
  padding: 1em 2em;
  font-family: "Work Sans", sans-serif;

  &:before {
    content: attr(title);
  }

  .button__text {
    display: block;
    &:before {
      content: attr(title);
    }
  }

  .button__mask {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    transform: translateX(-100%) rotate(45deg);
    transition: all 0.3s;
  }

  &:hover {
    opacity: 1;

    .button__mask {
      animation: fx-mask 0.3s ease-out;
    }

    .button__text--bis {
      animation: fx-text-bis 0.3s ease-out;
    }
  }

  &:active {
    opacity: 1;
    background: white;
    color: inherit;
  }

  @keyframes fx-mask {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }

  @keyframes fx-text {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(1em);
      opacity: 0;
    }
  }

  @keyframes fx-text-bis {
    0% {
      transform: translateX(-1em);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
