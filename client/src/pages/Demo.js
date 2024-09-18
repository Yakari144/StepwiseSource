import React, {useEffect, useState} from 'react';
import Annotations from '../components/Annotation';
import SourceCode from '../components/SourceCode';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import StyledHTML from '../components/StyledHTML';
import './Demo.css';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";
// make the 
function Demo({ id=null }) {
  var [data, setData] = useState({
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

  console.log("Current Slide:", currentSlide);

  return (
    <div className="Demo">
        {(data.slides.length + data.variables.length === 0) ? (
            <header className="App-header">
                <Loading />
            </header>
        ) : (
            <table className="page-table">
                <tr>
                  <th style={{width:"75%"}} className="presentation-title"><h1>{data.slides[currentSlide].text}</h1></th>
                  <th style={{width:"25%"}}></th>
                </tr>
                <tr>
                  <td className="slideshow-container">
                    <SourceCode slide = {data.slides[currentSlide]} style={stylesFromVariables(data.variables)} />
                  </td>
                  { data.slides[currentSlide].variables.length > 0 &&
                  <td className="annotations-container">{
                    (isTextVariables(data.slides[currentSlide].variables,data.variables)) ? (
                    <Annotations variables = {data.variables} currentVariables = {data.slides[currentSlide].variables} style={stylesFromVariables(data.variables)} /> 
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
        )}
    </div>
  );
}

export default Demo;
