import React from 'react';

const TextBox = ({text, onTextChange}) => {
    const handleChange = (event) => {
        onTextChange(event.target.value);
      };

    return (
    <div style={styles.textBox}>
      <textarea style={styles.textArea} placeholder="Write your own demonstration here" onChange={handleChange} value={text} />
    </div>
  );
};

const styles = {
  textBox: {
    flexGrow: 1,
    height: '300px', // Adjust as needed
    border: '2px solid black',
    borderRadius: '10px',
    backgroundColor: '#f5f5dc', // Background color
    padding: '10px'
  },
  textArea: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    resize: 'none',
    backgroundColor: 'transparent'
  }
};

export default TextBox;
