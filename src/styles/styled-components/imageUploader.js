import styled from "styled-components";

export const ImageContainer = styled.div`
  width: 100%;
  // Note : change this later
  height: ${(props) => (!props?.selected && "99vh")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => (props?.selected && "25px")}
`;

export const FileUpload = styled.div`
  height: ${(props) => (!props?.selected && "200px")};
  width: ${(props) => (props?.selected ? "calc(min(800px, 100%))" : "200px")};
  border-radius: ${(props) => (props?.selected ? "5px" : "100px")};
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 4px solid #ffffff;
  overflow: hidden;
  background-image: linear-gradient(to bottom, #0a0a0a 50%, #ffffff 50%);
  background-size: 100% 200%;
  transition: all 1s;
  color: #ffffff;
  font-size: 100px;
`;

export const UploadInput = styled.input`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
  border-radius: ${(props) => (props?.selected ? "25px" : "100px")};
  &:hover {
    background-position: 0 -100%;
    color: #2590eb;
  }
`;
