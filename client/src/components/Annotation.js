import React from 'react';

function Annotations({currentVariables,style}) {
  
  // JSX: JavaScript XML
  return <div className="annotations">
      {currentVariables.map((variable,index) => {
        return(
          <div className="new-ano-container">
              <div className="ano-circle">
                {index+1}
              </div>
              <div className="ano-box">
                <span className={variable.command} style={style[variable.command]}>
                  {variable.text}
                </span>
              </div>
          </div>
        )
        })}
  </div>
}

export default Annotations;