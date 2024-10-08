import React from 'react';

function Annotations({currentVariables,style}) {
  var idx = 1
  // JSX: JavaScript XML
  const r = <div className="annotations">
      {currentVariables.map((variable,index) => {
        if(variable.text.trim() === "") return null;
        return(
          <div className="new-ano-container">
              <div className="ano-circle">
                {idx++}
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

  return idx > 1 ? r : null;
}

export default Annotations;