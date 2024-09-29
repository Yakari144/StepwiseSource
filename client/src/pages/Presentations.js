import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";

const Presentations = () => {
    const [slides, setSlides] = useState([]);
    const flag = false
    const navigate = useNavigate();

    // Fetch the data from the backend
    useEffect(() => {
        fetch(BASE_URL + ":" + EXPRESS_PORT + "/api/presentations")
      .then((res) => res.json())
      .then((info) => {
        if (!info) {
          navigate("/error");
        } else {
          // set the data to the info received
          setSlides(info);
        }
      })
      .catch((error) => console.log(error.message));
    },[navigate]);

    return (
        <div className="presentations-container">
            <div className="presentations-header">
              <Header pages={["Create","Presentations","About"]}/>
            </div>
            <div className="presentations-list">
                <h1>Presentations</h1>
                <table>
                    <tr>
                        <th>Name</th>
                        <th></th>
                    </tr>
                    {slides.map((slide) => (
                        <tr>
                            <td>{slide.demoName}</td>
                            <td><a href={"/demo/"+slide.idDemo}>Go to presentation</a></td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Presentations;