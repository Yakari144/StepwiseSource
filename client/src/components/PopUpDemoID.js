import React, { useState } from 'react';
import './PopUpDemoID.css';
import { useNavigate } from 'react-router-dom';

const PopUpDemoID = ({demoID, onClose}) => {
  const [copied, setCopied] = useState(false);
  var message = 'Your presentation is ready!';
  var link = 'http://localhost:50740/demo/' + demoID;
  let navigate = useNavigate();

  const handleGoToPresentation = () => {
    navigate("/demo/"+demoID)
  };

  const handleClose = () => {
    onClose();
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 10000);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <p>{message}</p>
        <div className="button-container">
          <button onClick={handleGoToPresentation}>Go to Presentation</button>
          <button onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
        {copied && (
          <div className="link-container">
            <span>{link}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopUpDemoID;