import React from 'react';
import styled from 'styled-components';

const StyledHTML = ({style, html}) => {
    const Styledhmtl = styled.div`
    ${Object.keys(style).map((key) => `
      & .${key} {
        ${Object.keys(style[key]).map((property) => `
          ${property}: ${style[key][property]};
        `).join(' ')}
      }
    `).join(' ')}
    `
    
    return (
        <Styledhmtl dangerouslySetInnerHTML={{ __html: html }}/>
    );
}

export default StyledHTML;