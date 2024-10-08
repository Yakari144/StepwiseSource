import React, { useEffect } from 'react';
import styled from 'styled-components';
import parse, { domToReact } from "html-react-parser";
import Tooltip from '@mui/material/Tooltip'; // If you are using Material-UI Tooltip
import ClickAwayListener from '@mui/material/ClickAwayListener';

const StyledHTML = ({style, reactiveVariables, html}) => {
    const Styledhmtl = styled.div`
    ${Object.keys(style).map((key) => `
      & .${key} {
        ${Object.keys(style[key]).map((property) => `
          ${property}: ${style[key][property]};
        `).join(' ')}
      }
    `).join(' ')}
    `

    function wrapSpansWithTooltip(htmlString, variables) {
    
      const options = {
        replace: (domNode) => {
          // Check if the node is a span element with the matching attributes
          if (domNode.name === "span" &&
            domNode.attribs) {
            for (let i = 0; i < variables.length; i++) {
              const idVariable = variables[i].idVariable;
              const command = variables[i].command;
              if (domNode.attribs.command === idVariable
                && domNode.attribs.class === command) {
                const attributes = {
                  ...domNode.attribs,
                  className: domNode.attribs.class,
                };
                const spanContent = domToReact(domNode.children);

                return (
                <ClickAwayListener onClickAway={() => {}} >{/*onClickAway={handleTooltipClose}>*/}
                  <Tooltip
                    disableFocusListener
                    disableTouchListener
                    title={variables[i].text}
                    placement="top-start" 
                    arrow
                  ><span {...attributes}>{spanContent}</span></Tooltip>
                </ClickAwayListener>
                );
              }
            }
          }
        },
      };
    
      // Parse the HTML string with the transformation logic
      return parse(htmlString, options);
    }
    
    return (
      <Styledhmtl>
        {wrapSpansWithTooltip(html,reactiveVariables)}
      </Styledhmtl>
    );
}

export default StyledHTML;