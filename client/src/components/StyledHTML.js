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
    `).join(' ').concat(".wrapped-in-reactive:hover {background-color: black;color: white;text-decoration: underline;}")}
    `
    
    function setReactiveFunctionality({idVariable, category, command, text},html) {
      // get the span with attribute command=idVariable and class=command
      const element = document.querySelector(`span[command="${idVariable}"].${command}`);
      // if the element is hovered the text will be shown temporarily
      // if the element is clicked the text will be shown permanently until the user clicks again
      if(element){
        // wrap the element in a Tooltip component
        console.log("Element Found Updated")
        element;
        //parentElement = element.parentElement()
  //    //  element.parentElement.innerHTML = <Tooltip title={text} arrow><span command="${idVariable}" class="${command}">${element.innerHTML}</span></Tooltip>;
        //parentElement.replaceChild(element, "<span command=Args2 class=highlight2>CODIGO FONTE</span>");
        //return element
        return <span> Encontrado </span>
      }else{
        console.error(`Element with command="${idVariable}" and class="${command}" not found`);
        return null;
      }
    }

    function another(html,{idVariable,category,command,text}){
      // the html is actually text to be set in as innerHTML
      // find the element with the command=idVariable and class=command
      // dont use the document.querySelector here because it will search the whole document and not the html
      let element = html.replace(new RegExp(`<span command='${idVariable}' class='${command}'>(.*?)<\/span>`),`<span command='${idVariable}' class='wrapped-in-reactive ${command}' text='${text}'>$1</span>`);
      if(element){
        console.log("Element Found",element)
        // return the new html
        return element
      }else{
        console.log("Element Not Found")
      }
      return html;
    }
    html = another(html,{idVariable: "Args",category: "command",command: "highlight",text: "CODIGO FONTE"});

    return (
      <Styledhmtl dangerouslySetInnerHTML={{ __html: html }}/>
    );
}

export default StyledHTML;