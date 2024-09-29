import React, { useState } from 'react';
import './NameModal.css'; // Assuming the CSS will be defined separately.

const NameModal = ({ isOpen, errorMessage, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(name);
    setName(''); // Clear input after submit
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create New Presentation</h2>
        <p>Please enter the name for your presentation:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter presentation name"
          className="name-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default NameModal;
