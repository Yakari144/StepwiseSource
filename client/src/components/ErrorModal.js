import React, { useState } from 'react';
import './PopUpDemoID.css';

const ErrorModal = ({text,onClose}) => {
    
    return (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <p><b>{text}</b></p>
            </div>
        </div>
    );
};

export default ErrorModal;