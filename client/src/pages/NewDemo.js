// a home page
import {React , useState, useRef} from 'react';
import PopUpDemoID from '../components/PopUpDemoID'; // Import the TextBox component
import ErrorModal from '../components/ErrorModal'; // Import the TextBox component
import Editor from "@uiw/react-codemirror";
import {EditorView} from "@codemirror/view"
// get variables from .env file

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";

let myTheme = EditorView.theme({
  "&": {
    color: "black",
    backgroundColor: "#ffffff",
    border: "2px solid black",
    borderRadius: "10px",
    borderColor: "black",
    minHeight: "80vh",
    minWidth: "80vw",
    outline: "none"
  },
  ".cm-content": {
    border: "white"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#888"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#d9d9d9"
  },
  ".cm-gutters": {
    backgroundColor: "#f5f5dc",
    color: "#aaa",
    border: "none",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px"
  },
  ".cm-focused":{
    border: "15px solid black"
  }
}, {dark: false})

const NewDemo = () => {
    var [text, setText] = useState(" ");
    var [demoID, setDemoID] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const fileInputRef = useRef(null);

    // Demo Modal
    const handleOpenDemoModal = (idDemo) => {
      setDemoID(idDemo);
      console.log("Modal "+idDemo+"should be appearing");
    };
    
    const handleCloseDemoModal = () => {
      setDemoID(null);
    };

    // Error Modal
    const handleOpenErrorModal = (erro) => {
      setErrorMessage(erro);
      console.log("Error Modal "+erro+"should be appearing");
    };
  
    const handleCloseErrorModal = () => {
      setErrorMessage(null);
    };

    const handleTextChange = (newText) => {
        setText(newText);
    };

    const handleCreateDemo = () => {
      // send a POST request to the server with the text
      let link = BASE_URL+":"+EXPRESS_PORT+"/api/demo"
      fetch(link, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({'text': text})
      })
      .then((res) => {
        if(!res.ok){
          // get the text sent in the response even if the status is 500
          res.text()
            .then(text => {
              handleOpenErrorModal(text)
            })
            return;
        }
        else{
          return res.json()
        }
      })
      .then((data) => {
          handleOpenDemoModal(data.idDemo);
      })
      .catch((error) => {
          console.error("Error creating demo:", error);
      });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setText(e.target.result);
            };
            reader.onerror = (e) => {
                console.error("Error reading file:", e);
            };
            reader.readAsText(selectedFile);
        }
      };
    
    const handleUploadFile = () => {
      fileInputRef.current.click();
    };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Create your own demonstration</h1>
      <div style={styles.content}>
        <div style={styles.buttonContainer}>
          <button onClick={handleCreateDemo} style={styles.button}>Create Demo</button>
          <button onClick={handleUploadFile} style={styles.button}>Upload File</button>
          <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleFileChange} />
        </div>
        <Editor
      value={text}
      onChange={handleTextChange}
      theme={myTheme}
    />
      </div>
      {demoID && <PopUpDemoID demoID={demoID} onClose={handleCloseDemoModal} />}
      {errorMessage && <ErrorModal text={errorMessage} onClose={handleCloseErrorModal} />}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  },
  header: {
    marginBottom: '20px'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    border: '2px solid black',
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#f5f5dc' // Match the background color of the text box
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10px'
  },
  button: {
    marginBottom: '10px',
    padding: '10px',
    border: '2px solid black',
    borderRadius: '5px',
    backgroundColor: 'white',
    cursor: 'pointer'
  }
};

export default NewDemo;
