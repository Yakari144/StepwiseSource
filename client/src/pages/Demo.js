import React, {useEffect, useState} from 'react';
import Annotations from '../components/Annotation';
import SourceCode from '../components/SourceCode';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import './Demo.css';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.EXPRESS_PORT || "50741";

function Demo() {
  var [data, setData] = useState({
    "variables":[],
    "slides":[]
  });

  const { id } = useParams();
  const navigate = useNavigate();

  var [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch(BASE_URL+":"+EXPRESS_PORT+"/api/"+id)
      .then((res) => res.json())
      .then((info) => {
        if(!info.slides){
            navigate("/error")
        }else{
            console.log(info)
            setData(info) ;
        }
      })
        .catch((error) => console.log(error.message));  
      }, []);

  const handleSlideChange = (slideIndex) => {
    let r = slideIndex+currentSlide
    if(r<0){
      r = 0
    }else if(r>=data.slides.length){
      r = data.slides.length-1
    }
    setCurrentSlide(r)
  }

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
                    <SourceCode slide = {data.slides[currentSlide]}/>
                  </td>
                  { data.slides[currentSlide].variables.length > 0 &&
                  <td className="annotations-container">
                   <Annotations variables = {data.variables} currentVariables = {data.slides[currentSlide].variables} /> 
                  </td>
                  }
                </tr>
                <tr>
                  <td className="navigation-container">
                    <Navigation slideChanger={handleSlideChange}/>
                  </td>
                  <td></td>
                </tr>
            </table>
        )}
    </div>
  );
}

export default Demo;
