import React, {useEffect, useState} from 'react';
import Annotations from '../components/Annotation';
import SourceCode from '../components/SourceCode';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import Header from '../components/Header';
import './Demo.css';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";
// make the 
function Demo({ id=null }) {
  var [data, setData] = useState({
    "demoName":"",
    "variables":[],
    "slides":[],
    "order":[]
  });

  if(!id){
    const params = useParams();
    console.log("PARAMS: ",params);
    id = params.id;
  }else{
    console.log("ID: ",id);
  }
  
  const navigate = useNavigate();

  var [currentSlide, setCurrentSlide] = useState(0);
  var [slideIdxDict, setSlideIdxDict] = useState({});

  // Fetch the data from the backend
  useEffect(() => {
    fetch(BASE_URL + ":" + EXPRESS_PORT + "/api/" + id)
      .then((res) => res.json())
      .then((info) => {
        if (!info.slides) {
          navigate("/error");
        } else {
          // set the data to the info received
          console.log(info);
          setData(info);
        }
      })
      .catch((error) => console.log(error.message));
  }, [id, navigate]);
  
  // Set the slideIdxDict and the first slide when data changes
  useEffect(() => {
    const defSlideIdxDict = () => {
      let sID = {};
      for (let i = 0; i < data.slides.length; i++) {
        sID[data.slides[i].idSlide] = i;
      }
      return sID;
    };

    if (data && data.slides) {
      setSlideIdxDict(defSlideIdxDict());
    }
    

  }, [data]); // Trigger this effect when `data` changes
  
  // Set the first slide of the presentation according to the order
  useEffect(() => {
    const setFirstSlide = (order) => {
      if(!order || order.length === 0){
        return;
      }else{
        console.log(slideIdxDict);
      }
      let first = order[0];
      console.log("Order is", order);
      console.log("First slide is", first);
      if (Array.isArray(first)) {
        return setFirstSlide(first);
      } else {
        setSlideById(first);
        return first
      }
    };

    setFirstSlide(data.order);
  }, [slideIdxDict]);

  // Function to change the slide according to the slide id
  const setSlideById = (slideId) => {
    let r = slideIdxDict[slideId]
    setCurrentSlide(r)
  }

  const stylesFromVariables = (variables) => {
    let styles = {}
    for (let i = 0; i < variables.length; i++) {
      let category = variables[i].category
      if (category !== "command")
        continue
      let variableName = variables[i].idVariable
      let currentStyle = {}
      for (let j = 0; j < variables[i].style.length; j++) {
        let style = variables[i].style[j]
        let [property,value] = style.split(":")
        currentStyle[property.trim()] = value.trim()
      }
      styles[variableName] = currentStyle
    }
    return styles
  }

  const isTextVariables = (variablesIds,variables) => {
    var var_with_text = [];
    variables.forEach(element => {
      if(variablesIds.includes(element.idVariable)){
        if(element.text.trim() != "")
          var_with_text.push(element)
      }
    });
    return var_with_text.length > 0
  }

  const getReactiveVariables = (variablesIds,variables) => {
    var reacts_commands = [];
    variables.forEach(element => {
      if(element.category.trim() == "command")
        if(element.type.trim() == "reactive")
          reacts_commands.push(element.idVariable)
    });
    var reactives = [];
    variables.forEach(element => {
      if(variablesIds.includes(element.idVariable)){
        if(reacts_commands.includes(element.command.trim()))
          reactives.push(element)
      }
    });
    return reactives
  }

  const getFixedVariables = (variablesIds,variables) => {
    var reacts_commands = [];
    variables.forEach(element => {
      if(element.category.trim() == "command")
        if(element.type.trim() == "fixed")
          reacts_commands.push(element.idVariable)
    });
    var reactives = [];
    variables.forEach(element => {
      if(variablesIds.includes(element.idVariable)){
        if(reacts_commands.includes(element.command.trim()))
          reactives.push(element)
      }
    });
    return reactives
  }

  var fixedVariables = [];

  return (data.slides.length + data.variables.length === 0) ? (
      <header className="App-header">
          <Loading />
      </header>
    ) : ( 
      <div className="Demo">
        <div className="DemoHeader">
          <Header pages={["Create","Documentation","Presentations","About"]}/>
        </div>
        <h1 className="presentation-title">{(data.demoName!="") ? data.demoName : "Aqui Cabe o Titulo Da Apresentação"}</h1>
        <table className="page-table">
            <tr>
              <th style={{width:"75%"}} className="slide-title"><h2>{data.slides[currentSlide].text}</h2></th>
              <th style={{width:"25%"}}></th>
            </tr>
            {(data.slides[currentSlide].description && data.slides[currentSlide].description.trim() !== "") &&
            <tr>
              <td className="slide-description">
                <h3>{data.slides[currentSlide].description}</h3></td>
              <td ></td>
            </tr>
            }
            {(data.slides[currentSlide].exercises.length > 0) && (
            (data.slides[currentSlide].exercises.length == 1) ?
              (
                <tr>
                  <td className="slide-exercise">
                    <p><b>PRACTICE:</b> {data.slides[currentSlide].exercises[0].text}</p>
                  </td>
                  <td></td>
                </tr>
              ):(
                
                <tr>  
                <td>
                  <h3>Let's practice:</h3>
                {data.slides[currentSlide].exercises.map((exercise,index) => (
                  <p className="slide-exercise" id={exercise.idExercise}><b>Exercise {index+1}:</b>{exercise.text}</p>
                ))}
                </td>
                <td></td>
                </tr>
              ))
            }
            <tr>
              <td className="slideshow-container">
                <SourceCode slide={data.slides[currentSlide]} reactiveVariables = {getReactiveVariables(data.slides[currentSlide].variables,data.variables)} style={stylesFromVariables(data.variables)} />
              </td>
              { data.slides[currentSlide].variables.length > 0 &&
              <td className="annotations-container">{
                (fixedVariables = getFixedVariables(data.slides[currentSlide].variables,data.variables), fixedVariables.length>0) ? (
                <Annotations currentVariables = {fixedVariables} style={stylesFromVariables(data.variables)} /> 
                ):(null)
                }
              </td>
              }
            </tr>
            <tr>
              <td className="navigation-container">
                <Navigation order={data.order} slideChanger={setSlideById} currentSlide={data.slides[currentSlide].idSlide}/>
              </td>
              <td></td>
            </tr>
        </table>
      </div>
    )
}

export default Demo;
