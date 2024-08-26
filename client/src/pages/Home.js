import React from 'react';
import './Home.css'; // Create a CSS file for styling

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="title">Welcome to Stepwise Source</h1>
      <div className="button-container">
        <button className="home-button" onClick={() => window.location.href='/create'}>
          Create a New Presentation
        </button>
        <button className="home-button" onClick={() => window.location.href='/tutorial'}>
          How to Create a Presentation
        </button>
      </div>
    </div>
  );
}

export default HomePage;
