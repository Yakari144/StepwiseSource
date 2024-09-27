import React from 'react';


function getVariables(variables,currentVariables){
  let vs = []
  for(let i=0; i<currentVariables.length; i++){
    for(let j=0; j<variables.length; j++){
      if(variables[j].idVariable === currentVariables[i]){
        vs.push(variables[j]);
        break;
      }
    }
  }
  return vs
}

function Annotations({variables, currentVariables,style}) {
  
  
  // JSX: JavaScript XML
  return <div className="annotations">
      {getVariables(variables,currentVariables).map((variable,index) => {
        let content = ""
        if(variable.category === "variable" && variable.text.trim() !== ""){
          if(variable.command === "highlight"){
            content = null
          }else{
          content= (
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
          )}
        }
        return content;
        })}
  </div>;
}

export default Annotations;