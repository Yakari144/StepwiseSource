import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Presentations.css'; // Assuming a CSS file to style the table and buttons

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";

const Presentations = () => {
    const [presentations, setPresentations] = useState([]);
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
          setPresentations(info);
        }
      })
      .catch((error) => console.log(error.message));
    },[navigate]);

    const handleGoToPresentation = (idDemo) => {
        navigate(`/demo/${idDemo}`);
    }


  return (
    <div className="presentations-page">
        <div className="DemoHeader">
            <Header pages={["Create","Documentation","Presentations","About"]}/>
        </div>
        
    <div className="presentations-container">
      <h2>Presentations List</h2>
      <table className="presentations-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {presentations.length > 0 ? (
            presentations.map((presentation, index) => (
              <tr key={index}>
                <td>{presentation.demoName}</td>
                <td>
                  <button
                    className="action-button go-to-button"
                    onClick={() => handleGoToPresentation(presentation.idDemo)}
                  >
                    Go to
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No presentations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Presentations;
