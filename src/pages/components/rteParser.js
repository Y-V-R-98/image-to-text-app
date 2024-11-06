/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';
import getColors from '../Colors';
import { RTEContainer, ReferenceWrapper } from './index.style';
import MikTypography from '../Typography';

const TEXT_WRAPPERS = {
  bold: (child) => <strong>{child}</strong>,
  italic: (child) => <i>{child}</i>,
  underline: (child) => <u>{child}</u>,
  strikethrough: (child) => <s>{child}</s>,
  superscript: (child) => <sup>{child}</sup>,
  subscript: (child) => <sub>{child}</sub>,
  inlineCode: (child) => <code>{child}</code>,
};

const renderReference = (attrs = {}, children) => {
  if (attrs?.['display-type'] === 'link') {
    return (
      <a href={attrs?.href} {...(attrs?.target && { target: attrs?.target })}>
        <MikTypography tag="Body Link" as="span" tabIndex="0" rteTheme="michaels">
          {children}
        </MikTypography>
      </a>
    );
  }

  return (
    <ReferenceWrapper
      textAlign={attrs?.position}
      {...(attrs?.inline && { float: attrs?.style?.float })}
    >
      <div>
        <img
          className={attrs?.['class-name']}
          src={attrs?.href || attrs?.['asset-link']}
          style={attrs?.style}
          alt={attrs?.alt}
        />
        {!attrs?.inline && attrs?.caption && <div>{attrs?.caption}</div>}
      </div>
    </ReferenceWrapper>
  );
};

const DEFAULT_ELEMENT_TYPES = {
  blockquote: (attrs, children) => <blockquote {...attrs}>{children}</blockquote>,
  h1: (attrs, children) => <h1 {...attrs}>{children}</h1>,
  h2: (attrs, children) => <h2 {...attrs}>{children}</h2>,
  h3: (attrs, children) => <h3 {...attrs}>{children}</h3>,
  h4: (attrs, children) => <h4 {...attrs}>{children}</h4>,
  h5: (attrs, children) => <h5 {...attrs}>{children}</h5>,
  h6: (attrs, children) => <h6 {...attrs}>{children}</h6>,
  reference: renderReference,
  embed: (attrs) => (
    <div className="embed-iframe-container">
      <iframe {...attrs} />
    </div>
  ),
  p: (attrs, children) => <p {...attrs}>{children}</p>,
  ol: (attrs, children) => <ol {...attrs}>{children}</ol>,
  ul: (attrs, children) => <ul {...attrs}>{children}</ul>,
  code: (attrs, children) => <code {...attrs}>{children}</code>,
  li: (attrs, children) => <li {...attrs}>{children}</li>,
  a: (attrs, children) => <a {...attrs}>{children}</a>,
  table: (attrs, children) => <table {...attrs}>{children}</table>,
  tbody: (attrs, children) => <tbody {...attrs}>{children}</tbody>,
  thead: (attrs, children) => <thead {...attrs}>{children}</thead>,
  tr: (attrs, children) => <tr {...attrs}>{children}</tr>,
  td: (attrs, children) => <td {...attrs}>{children}</td>,
  th: (attrs, children) => <th {...attrs}>{children}</th>,
  hr: () => <hr data-type="hr" style={{ borderTop: '3px solid #bbb' }}></hr>,
  span: (attrs, children) => <span {...attrs}>{children}</span>,
  div: (attrs, children) => <div {...attrs}>{children}</div>,
  inlineCode: (attrs, children) => <span data-type="inlineCode">{children}</span>,
  'display-1': (attrs, children) => <p>{children}</p>,
  'display-2': (attrs, children) => <p>{children}</p>,
  'display-3': (attrs, children) => <p>{children}</p>,
  'small-text': (attrs, children) => <small>{children}</small>,
  fragment: (attrs, children) => <>{children}</>,
};

const getTxtStyleAttributes = (textData = {}, rteTheme) => {
  const colorValues = {
    'brand-color': getColors(rteTheme, 'text', 'brand_primary'),
    'bg-brand-color': getColors(rteTheme, 'background_color', 'brand_color'),
    'bg-discount': getColors(rteTheme, 'text', 'savings'),
  };

  const fontColor = textData['font-color']
    ? colorValues[textData['font-color']] ||
      getColors(rteTheme, 'text', textData['font-color'])
    : '';
  const bgColor = textData['bg-color'] ? colorValues[textData['bg-color']] || '' : '';

  return {
    ...(fontColor && { color: fontColor }),
    ...(bgColor && { backgroundColor: bgColor }),
  };
};

const getElementAttributes = (nodeData = {}) => {
  const { attrs = {}, type = '' } = nodeData || {};

  if (Object.keys(attrs).length) {
    delete attrs['redactor-attributes'];

    const attributes = { ...attrs };

    if (attrs['class-name']) {
      attributes.className = attrs['class-name'];
    }

    if (type !== 'img' && attrs.style) {
      attributes.style = attrs.style;
    }

    if (type === 'a') {
      attributes.href = attrs.url;
    }

    if (type === 'check-list') {
      attributes['data-checked'] = nodeData?.checked;
      attributes['data-type'] = 'checked';
    }

    if (type === 'row') {
      attributes['data-type'] = 'row';
      attributes.style = { maxWidth: '100%', display: 'flex' };
    }

    if (type === 'column') {
      const { width } = nodeData?.meta || {};
      attributes['data-type'] = 'column';
      attributes.width = width;
      attributes.style = {
        flexGrow: 0,
        flexShrink: 0,
        position: 'relative',
        width: `${width * 100}%`,
        margin: '0 0.25rem',
      };
    }

    if (type === 'grid-container') {
      attributes['data-type'] = 'grid-container';
      attributes.gutter = attrs?.gutter || 0;
      attributes.style = {
        display: 'flex',
        width: '100%',
        gap: `${attrs?.gutter || 0}px`,
      };
    }

    if (type === 'grid-child') {
      attributes['data-type'] = 'grid-child';
      attributes['grid-ratio'] = attrs?.gridRatio || 0;
      attributes.style = { flex: attrs?.gridRatio || 0 };
    }

    if (type === 'reference') {
      attributes.alt = attributes?.['asset-alt'] || '';
      attributes.className = attributes?.['class-name'] || '';
      attributes.caption = attributes?.['asset-caption'] || '';
      attributes.style = { ...(attributes?.style || {}), display: 'inline-block' };
    }

    return attributes;
  }

  return {};
};

const isElementHasSameChild = (nodeData = {}, type = '') => {
  return (
    nodeData?.type === type &&
    nodeData?.children?.length === 1 &&
    nodeData.children[0].type === type &&
    Object.keys(nodeData?.attrs || {}).length === 0
  );
};

// Rendering of the text content
const renderTextContent = (nodeData = {}, rteTheme) => {
  const nodeStyles = getTxtStyleAttributes(nodeData, rteTheme) || {};
  const isStyleApplied = Object.keys(nodeStyles).length > 0;

  // Handling of the blank text as new line
  const textValue = nodeData?.text === '' || nodeData?.break ? '\n' : nodeData?.text;

  // Separation of text lines
  let textLines = textValue?.split('\n')?.map((line, index) => {
    const text = (
      <>
        {index > 0 && <br />}

        {nodeData?.classname || nodeData?.id || isStyleApplied ? (
          <Text
            as="span"
            {...(nodeData?.classname && { className: nodeData.classname })}
            {...(nodeData?.id && { id: nodeData.id })}
            {...(isStyleApplied && nodeStyles)}
          >
            {line}
          </Text>
        ) : (
          line
        )}
      </>
    );

    return <Fragment key={`${index}`}>{text}</Fragment>;
  });

  // Add text formatting tags like bold/italic etc.
  textLines = Object.keys(nodeData).reduce((lines, key) => {
    if (TEXT_WRAPPERS[key]) {
      return TEXT_WRAPPERS[key](lines);
    }
    return lines;
  }, textLines);

  return textLines;
};

// Rendering of the elements defined with "type"
const renderNodeContent = (nodeData = {}, elementTypes = {}, rteTheme) => {
  // Handling of the Text content
  if (nodeData?.text !== undefined) {
    return <>{renderTextContent(nodeData, rteTheme)}</>;
  }

  // Iterate the same logic again for the nested elements
  let childs = Array.isArray(nodeData.children)
    ? nodeData.children.map((child) => renderNodeContent(child, elementTypes, rteTheme))
    : null;

  // Specific rendering logic for the different types of elements
  if (elementTypes[nodeData?.type]) {
    // Skip the Element rendering if the child has same type
    if (isElementHasSameChild(nodeData, 'span') || isElementHasSameChild(nodeData, 'p')) {
      return <>{childs}</>;
    }

    if (nodeData?.type === 'table') {
      const { colWidths } = nodeData?.attrs || {};
      const totalWidth = colWidths.reduce((a, b) => a + b, 0);
      const setCol = new Set(colWidths);
      if (
        !(
          setCol.size === 1 &&
          nodeData.attrs.cols * setCol.values().next().value === totalWidth
        )
      ) {
        const cols = Array.from(colWidths).map((colWidth, index) => {
          const width = (colWidth / totalWidth) * 100;
          return <col key={index} style={{ width: `${width}%` }} />;
        });
        childs = (
          <>
            <colgroup data-width={totalWidth}>{cols}</colgroup>
            {childs}
          </>
        );
      }
    }

    if (['td', 'th'].includes(nodeData.type) && nodeData.attrs?.void) {
      return null;
    }

    const elementAttrs = getElementAttributes(nodeData);

    return <>{elementTypes[nodeData.type](elementAttrs, childs)}</>;
  }

  return <>{childs}</>;
};

const RTEContentParser = ({ data = {}, elementTypes = {}, rteTheme = 'michaels' }) => {
  return (
    <RTEContainer>
      {renderNodeContent(data, { ...DEFAULT_ELEMENT_TYPES, ...elementTypes }, rteTheme)}
    </RTEContainer>
  );
};

RTEContentParser.propTypes = {
  elementTypes: PropTypes.objectOf(PropTypes.func),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.objectOf(PropTypes.any),
  rteTheme: PropTypes.string,
};

export { RTEContentParser };
