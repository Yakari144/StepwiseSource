import React from 'react';
import './Home.css'; // Create a CSS file for styling
import Header from '../components/Header';

function HomePage() {
  return (
    <div className="home-page">
      <div className="HomeHeader">
          <Header pages={["Presentations","Documentation","About"]}/>
      </div>
      <div className="home-container">
        <img className="home-image" src="/logo512.png" alt="home-image" />
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
    </div>
  );
}

export default HomePage;
