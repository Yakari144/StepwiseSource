import './Home.css'; // Create a CSS file for styling
import Header from '../components/Header';
import React, { useEffect, useState } from 'react';

function HomePage() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Create your interactive, step-by-step presentations.';
  
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home-page">
      <div className="HomeHeader">
          <Header pages={["Presentations","Documentation","About"]}/>
      </div>
      <div className="home-container">
        <img className="home-image" src="/logo512.png" alt="home-image" />
        <h1 className="title">Stepwise Source, a Tool for Progressive Source Code Demonstration</h1>
        <h2 className="writting-machine">{displayedText}</h2>
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
