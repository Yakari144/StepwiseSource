import React from 'react';

function SourceCode({slide, style}) {
    // inside the slide.code there will be spans with the class names, insert the code in the div with the class name 'code fade'
    // check if the string matches the regex and return a boolean
    function checkRegex(str, regex) {
        const re = new RegExp(regex);
        // if regex = 'ni than should return false with 'nia'
        const result = str.match(re);
        return result!=null;    
    }

    const handleInputChange = (e) => {
        // get the value of the input
        const value = e.target.value.trim();
        // given the input element, get the regex attribute
        const regex = e.target.getAttribute('regex');
        // check if the value matches the regex
        const isMatch = checkRegex(value, regex);
        console.log(isMatch);
        // set style to the input
        if(isMatch){
            e.target.style.backgroundColor = 'green';
          }else{
            if(value.length == 0){
              e.target.style.backgroundColor = 'white';
              return
            }
            e.target.style.backgroundColor = 'red';
          }
    
    };

    function setInputFunctionality() {
        const codeDiv = document.getElementById(slide.idSlide);
        if (!codeDiv) {
          return false;
        }
        codeDiv.addEventListener('input', (e) => {
            if (e){
                if (e.target.tagName === 'INPUT') {
                  handleInputChange(e);
                }
            }
        });
        return true;
      }
    
      setInputFunctionality();

    return (
    <pre>
        <div style = {style[0]} className='code fade' id={slide.idSlide} name={slide.text} dangerouslySetInnerHTML={{ __html: slide.code }}/>
    </pre>
    )
}

export default SourceCode;