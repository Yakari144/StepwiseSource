import React from 'react';

function SourceCode({slide}) {
    // inside the slide.code there will be spans with the class names, insert the code in the div with the class name 'code fade'
    

    // JSX: JavaScript XML
    return <pre>
        <div className='code fade' id={slide.idSlide} name={slide.text} dangerouslySetInnerHTML={{ __html: slide.code }}/>
    </pre>;
}

export default SourceCode;