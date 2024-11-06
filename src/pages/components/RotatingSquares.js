import {
  SpinnerBox,
  ConfigureBorder1,
  ConfigureBorder2,
  ConfigureCore,
} from "@/styles/styled-components/loadingAnimation";
import React from "react";

export default function RotatingSquares() {
  return (
    <SpinnerBox>
      <ConfigureBorder1>
        <ConfigureCore />
      </ConfigureBorder1>
      <ConfigureBorder2>
        <ConfigureCore />
      </ConfigureBorder2>
    </SpinnerBox>
  );
}
