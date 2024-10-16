// a home page
import {React ,useEffect, useState, useRef} from 'react';
import PopUpDemoID from '../components/PopUpDemoID'; // Import the TextBox component
import ErrorModal from '../components/ErrorModal'; // Import the TextBox component
import Editor from "@uiw/react-codemirror";
import Header from '../components/Header';
import NameModal from '../components/NameModal';
import {EditorView} from "@codemirror/view"
import { useParams, useNavigate } from 'react-router-dom';
import './NewDemo.css';
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
    height: "60vh",
    width: "80vw",
    maxHeight: "80vh",
    maxWidth: "80vw",
    outline: "none"
  },
  ".cm-content": {
    border: "white"
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#888",
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#d9d9d9",
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
    const downloadLinkRef = useRef(null); // useRef for the download link
    const [nameModalOpen, setNameModalOpen] = useState(false);
    const [name, setName] = useState("");

    const navigate = useNavigate();
    const { idDemo } = useParams();

    // Fetch the data from the backend
    useEffect(() => {
      if(!idDemo)
        return
      fetch(BASE_URL + ":" + EXPRESS_PORT + "/edit/" + idDemo)
        .then((res) => res.json())
        .then((info) => {
          if (!info.demoID) {
            navigate("/error");
          } else {
            setText(t => info.demoText);
            setName(n => info.demoName);
          }
        })
        .catch((error) => console.log(error.message));
    }, [idDemo, navigate]);
    

    // Demo Modal
    const handleOpenDemoModal = (idDemo) => {
      setNameModalOpen(n => false);
      setDemoID(i => idDemo);
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

    const createDemo = (demoName) => {
      // send a POST request to the server with the text
      let link = BASE_URL+":"+EXPRESS_PORT+"/api/demo"
      fetch(link, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({'demoName':demoName,'text': text})
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
    }

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

    // Function to trigger saving the file
    const saveToFile = () => {
      let mytxt = ""
      if(text) 
        mytxt = text
      const blob = new Blob([mytxt], { type: 'text/plain' }); // Create a Blob with the text content
      const url = URL.createObjectURL(blob); // Create a URL for the Blob

      downloadLinkRef.current.href = url; // Set the href to the Blob URL
      downloadLinkRef.current.download = 'presentation.txt'; // Set the download attribute for filename
      downloadLinkRef.current.click(); // Programmatically trigger the click to download the file

      // Clean up by revoking the Blob URL
      URL.revokeObjectURL(url);
    };

    const handleCreateDemo = () => {
      setNameModalOpen(true);
    }

    const handleNameSubmit = (name) => {
      if (name === "") {
        handleOpenErrorModal("Please enter a name for your presentation");
        return;
      }
      createDemo(name);
    }

    const handleCloseNameModal = () => {
      setNameModalOpen(false)
      setErrorMessage(null)
    }

    const handleEditDemo = () => {
      // send a POST request to the server with the text
      let link = BASE_URL+":"+EXPRESS_PORT+"/edit/demo"
      console.log("edit",idDemo)
      fetch(link, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({'demoID':idDemo,'demoName':name,'demoText': text})
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
        console.log(data)
        handleOpenDemoModal(data.idDemo);
      })
      .catch((error) => {
          console.error("Error creating demo:", error);
      });
    }

  return (
    <div className="page">
      <div className="HomeHeader">
        <Header pages={["Presentations","Documentation","About"]}/>
      </div>
      <div className="new-demo-container">
        <h1 className="new-demo-header">Create your own presentation</h1>
        <div className="new-demo-content">
          <div className="new-demo-button-container">
            {!idDemo &&
            <button onClick={handleCreateDemo} className="new-demo-button">
              <img className="button-img" src="/play.png" alt="home-image" />          
              Publish
            </button>
            }
            {idDemo &&
            <button onClick={handleEditDemo} className="new-demo-button">
              <img className="button-img" src="/play.png" alt="home-image" />
              Publish  
            </button>}
            <button onClick={handleUploadFile} className="new-demo-button">
              <img className="button-img" src="/upload.png" alt="home-image" />
              Upload  
            </button>
            <button onClick={saveToFile} className="new-demo-button">
              <img className="button-img" src="/download.png" alt="home-image" />
              Download  
            </button>
            <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
            <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleFileChange} />
          </div>
          <Editor
        value={text}
        onChange={handleTextChange}
        theme={myTheme}
      />
        </div>
        {demoID && <PopUpDemoID demoID={demoID} errorMessage={errorMessage} onClose={handleCloseDemoModal}/>}
        <NameModal  isOpen={nameModalOpen} errorMessage={errorMessage} onClose={handleCloseNameModal} onSubmit={handleNameSubmit}/>
      </div>
    </div>
  );
};

export default NewDemo;
