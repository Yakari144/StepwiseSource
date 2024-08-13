import React, { useState } from 'react';
import './PopUpDemoID.css';
import { useNavigate } from 'react-router-dom';
const ACTUAL_URL = process.env.REACT_APP_ACTUAL_URL || "http://stepwisesource.epl.di.uminho.pt";

const PopUpDemoID = ({demoID, onClose}) => {
  const [copied, setCopied] = useState(false);
  var message = 'Your presentation is ready!';
  var link = ACTUAL_URL+'/demo/' + demoID;
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