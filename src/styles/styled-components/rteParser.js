import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import theme from '@mik-technology/new_core.theme';

export const RTEContainer = styled(Box)`
  white-space: pre-wrap;

  a {
    strong {
      font-weight: ${theme.fontWeights.semibold};
    }
  }

  .embed-iframe-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    height: 0;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  ul {
    list-style-type: disc;
  }
  ul ul {
    list-style-type: circle;
  }
  ul ul ul {
    list-style-type: none;
  }
  ul ul ul li::before {
    display: inline-block;
    margin-right: 1rem;
    content: '▸';
  }
  ul ul ul ul li::before {
    display: inline-block;
    margin-right: 1rem;
    content: '-';
  }

  ol,
  ol ol ol ol {
    list-style-type: decimal;
  }
  ol ol {
    list-style-type: lower-alpha;
  }
  ol ol ol {
    list-style-type: lower-roman;
  }
`;

export const ReferenceWrapper = styled(Box)`
  & > div {
    display: inline-block;
    text-align: center;

    & a {
      display: inline-block;
    }
  }
`;
