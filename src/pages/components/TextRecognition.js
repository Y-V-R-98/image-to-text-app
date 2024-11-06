import { InvertedText } from '@/styles/styled-components/textRecognition';
import React from 'react';

const TextRecognition = ({ recognizedText }) => {
  return (
    <div>
      <h2>Recognized Text:</h2>
      <InvertedText>{recognizedText}</InvertedText>
    </div>
  );
};

export default TextRecognition;
