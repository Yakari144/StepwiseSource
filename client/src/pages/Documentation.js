import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonScrollTo from '../components/ButtonScrollTo';
import Header from '../components/Header';
import './Documentation.css';  // You can style this to match your color theme

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";

const Documentation = () => {
    const [tutorialText,setTutorialText] = useState("")
    const navigate = useNavigate(); 

    useEffect(() => {
        fetch(BASE_URL + ":" + EXPRESS_PORT + "/edit/IDtutorial")
          .then((res) => res.json())
          .then((info) => {
            if (!info.demoID) {
              navigate("/error");
            } else {
              setTutorialText(t => info.demoText);
            }
          })
          .catch((error) => console.log(error.message));
      }, []);

    return (
        <div className="documentation-container">
            <div className="DemoHeader">
              <Header pages={["Create","Presentations","About"]}/>
            </div>
            <div className="doc-landing">
                <header className="doc-header">
                    <h1>StepwiseSource Documentation</h1>
                    <p>A guide to constructing your own presentations using the StepwiseSource DSL</p>
                </header>
                <div className="button-container">
                  <button className="home-button" onClick={() => window.location.href='/tutorial'}>
                    How to Create a Presentation
                  </button>
                  <ButtonScrollTo className={"home-button"} selector={'.documentation'} content={"Go to Documentation"}/>
                </div>
            </div>
            <div className='documentation'>
                {/* Overview */}
                <section className="doc-section">
                    <h2>Overview of the DSL Commands</h2>
                    <p>
                        StepwiseSource introduces a Domain-Specific Language (DSL) specifically designed for educators to create
                        interactive, step-by-step presentations. The commands in this DSL enable structuring of lessons, styling
                        of content, incorporating interactivity, and controlling the flow of information. Let's explore the key
                        commands and their functions.
                    </p>
                </section>

                {/* Slide + Code Block */}
                <section className="doc-section">
                    <h3>Slide + Code Block</h3>
                    <p>
                        Every presentation in StepwiseSource starts with a slide. The slide definition is created with the following 
                        syntax:
                    </p>
                    <div className="code-div"><pre className="code-example"><b>
                        {`
\\SLIDE{ID}{TITLE}
\\DESCRIPTION{TEXT}
\\BEGIN
    content
\\END
                        `}</b>
                    </pre></div>
                    <p>
                        Here:
                        <ul>
                            <li><b>ID</b>: A unique identifier for the slide.</li>
                            <li><b>TITLE</b>: The slide title, displayed to the students.</li>
                            <li><b>DESCRIPTION</b> (optional): A short explanation that appears before the main content, providing context.</li>
                            <li><b>content</b>: The body of the slide, where the educator can add code snippets, explanations, or other material.</li>
                        </ul>
                    </p>
                    <h4>Example:</h4>
                    <div className="code-div"><pre className="code-example"><b>
                        {`
\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    int x = 5;
    int y = x + 10;
\\END
                        `}</b>
                    </pre></div>
                    <p>
                    This expands on the previous example by adding a description explaining the role of variables in programming.
                    </p>
                </section>
                     
                {/* Reserved Symbols */}   
                <section className="doc-section">
                    <h3>Reserved Symbols</h3>
                    <p>
                        In the Stepwise DSL, special characters like <b>`&#92;`</b>, <b>`&#123;`</b>, and <b>`&#125;`</b> are reserved. If you 
                        need to include these characters in the slide content, you must escape them using <b>`&#92;`</b>.
                    </p>
                    <h4>Running Example:</h4>
                    <div className="code-div"><pre className="code-example">
                        {`
\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    int x = 5;
    int y = x + 10;
    char* st = "a normal string `}<b>\\n</b>{`";
\\END
                        `}
                    </pre></div>
                    <p>
                        In this case, <b>\\n</b> represents a newline character in the string, which is escaped for proper rendering.
                    </p>
                </section>
                   
                {/* Styling: NReactive NFixed */}     
                <section className="doc-section">
                    <h3>Styling: newreactive and newfixed</h3>
                    <p>
                        The DSL allows you to define styles that can either be revealed during user interaction (<b>newreactive</b>) or always 
                        visible (<b>newfixed</b>). These commands help to highlight or alter specific parts of the content for emphasis or 
                        clarification.
                    </p>
                    <pre className="syntax-example"><b>
                        {`
\\NEWREACTIVE{ID}{style; style; ...}
\\NEWFIXED{ID}{style; style; ...}
                        `}</b>
                    </pre>
                    <h4>Running Example:</h4>
                    <div className="code-div"><pre className="code-example"><b>
                        {`
\\NEWREACTIVE{highlight}{text-color: green; bold;}
\\NEWFIXED{removed}{text-color: red; strikethrough;}`}</b>{`

\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    int x = 5;
    int y = x + 10;
    char* st = "a normal string \\\\n";
\\END
                        `}
                    </pre></div>
                    <p>
                        In this example:
                        <ul>
                            <li><b>highlight</b> will apply green text and bold formatting interactively.</li>
                            <li><b>removed</b> will apply red text with a strikethrough to denote removed content.</li>
                        </ul>
                    </p>
                </section>
                  
                {/* User Defined Styling */}  
                <section className="doc-section">
                    <h3>User Defined Styling</h3>
                    <p>
                        To promote consistency across the presentation, StepwiseSource allows user-defined styles. You can define these 
                        styles once and apply them to multiple slides.
                    </p>
                    <pre className="syntax-example"><b>
                        {`
\\ID{ID}{TEXT}
                        `}</b>
                    </pre>
                    <p>
                        Here:
                        <ul>
                            <li>The first <b>ID</b> reffers to the identifier of a previously created styling command.</li>
                            <li>The second <b>ID</b> defines the identifier of this User Defined Styling.</li>
                            <li><b>TEXT</b> links a text label to the styling command, allowing the same combination to be reused multiple times throughout the presentation.</li>
                        </ul>
                    </p>
                    <h4>Running Example:</h4>
                    <p>Let's define a new style to indicate incorrect or removed code, applying it to our previous example:</p>
                    <div className="code-div"><pre className="code-example">
                        {`
\\NEWREACTIVE{highlight}{text-color: green; bold;}
\\NEWFIXED{removed}{text-color: red; strikethrough;}`}<b>{`
\\removed{error}{This code is has a wrong syntax}`}</b>{`

\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    int y = x + 10;
    char* st = "a normal string \\\\n";
\\END
                        `}
                    </pre></div>
                </section>
                 
                {/* Styling Usage */}   
                <section className="doc-section">
                    <h3>Styling Usage</h3>
                    <p>
                        Now that you know how to create your Styling and User Defined Styling commands, it's time to learn how to actually use them in your slides to improve your presentations.
                    </p>
                    <p>
                        If you are using a Styling command directly in the code, the syntax is:
                    </p>
                    <pre className="syntax-example"><b>
                        {`
\\ID{CODE}{TEXT}
                        `}</b>
                    </pre>
                    <p>
                        Where:
                        <ul>
                            <li><b>ID</b> reffers to the identifier of a previously created styling command.</li>
                            <li>The <b>CODE</b> is the code snippet that will be styled.</li>
                            <li><b>TEXT</b> is the annotation related to the code snippet.</li>
                        </ul>
                    </p>
                    <p>
                        If you took the option of creating a User Defined Styling command, given that the explanation is already defined, the only thing left to associate with the command is the code to be highlighted. Remaining the following syntax:
                    </p>
                    <pre className="syntax-example"><b>
                        {`
\\ID{CODE}
                        `}</b>
                    </pre>
                    <h4>Running Example:</h4>
                    <p>Let's define a new style to indicate incorrect or removed code, applying it to our previous example:</p>
                    <div className="code-div"><pre className="code-example"><b>{`
\\NEWREACTIVE{highlight}{text-color: green; bold;}`}</b>{`
\\NEWFIXED{removed}{text-color: red; strikethrough;}`}<b>{`
\\removed{error}{This code is has a wrong syntax}`}</b>{`

\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    `}<b>{`\\error{int x == 5.7;}`}</b>{`
    int y = x + 10;
    `}<b>{`\\highlight{char* st = "a normal string \\\\n";}{This is how you define a string}`}</b>{`
\\END
    `}
                    </pre></div>
                    <p>
                    In this example, the <b>error</b> style defined earlier is applied to the code, marking it as removed and associating it with an annotation explaining why it was removed.
                    Also, the <b>highlight</b> is also applied by assining the explanation specific to that code snippet.
                    </p>
                </section>
                  
                {/* Styling Syntax: CSS-like Rules */}      
                <section className="doc-section">
                    <h3>Styling Syntax: CSS-like Rules</h3>
                    <p>
                        StepwiseSource allows styling to be defined using familiar CSS-like syntax. You can control text color, background, 
                        borders, and other visual elements. Below is a table of the supported styling rules.
                    </p>
                    <table className="doc-table">
                        <thead>
                            <tr>
                                <th>DSL Command</th>
                                <th>CSS Equivalent</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>text-color: red</td>
                                <td>color: red</td>
                                <td>Changes text color to red</td>
                            </tr>
                            <tr>
                                <td>background-color: blue</td>
                                <td>background-color: blue</td>
                                <td>Sets background color to blue</td>
                            </tr>
                            <tr>
                                <td>border-color: #FA0C25</td>
                                <td>border-color: #FA0C25</td>
                                <td>Defines the color of an element's border</td>
                            </tr>
                            <tr>
                                <td>bold</td>
                                <td>font-weight: bold</td>
                                <td>Makes text bold</td>
                            </tr>
                            <tr>
                                <td>strikethrough</td>
                                <td>text-decoration: line-through</td>
                                <td>Draws a line through the text</td>
                            </tr>
                            <tr>
                                <td>underline</td>
                                <td>text-decoration: underline</td>
                                <td>Adds a line below the text</td>
                            </tr>
                            <tr>
                                <td>text-size: 16</td>
                                <td>font-size: 16px</td>
                                <td>Sets the font size to 16 pixels</td>
                            </tr>
                            <tr>
                                <td>text-align: center</td>
                                <td>text-align: center</td>
                                <td>Centers the text horizontally</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                   
                {/* Interactive Exercises */}     
                <section className="doc-section">
                    <h3>Interactive Exercises</h3>
                    <p>
                        The DSL includes an <b>\EXERCISE</b> command to engage students with interactive exercises. This feature allows educators 
                        to prompt students to answer questions or solve exercises with real-time feedback. The command supports regular 
                        expressions to validate the input.
                    </p>
                    <pre className="syntax-example">
                        {`
\\EXERCISE{/regex/}{prompt}
                        `}
                    </pre>
                    <h4>Running Example:</h4>
                    <div className="code-div"><pre className="code-example">
                    {`
\\NEWREACTIVE{highlight}{text-color: green; bold;}
\\NEWFIXED{removed}{text-color: red; strikethrough;}
\\removed{error}{This code is has a wrong syntax}

\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    \\error{int x == 5.7;}
    int y = x + 10;
    \\highlight{char* st = "a normal string \\\\n";}{This is how you define a string}
    int z = `}<b>{`\\exercise{/[0-9]+]/}{Complete the code by assining the variable 'z' with a non-null value.}`}</b>{`
\\END
                        `}
                    </pre></div>
                    <p>
                    This creates an exercise where students are asked to enter a valid number. The input is validated using the regular expression <b>/[0-9]+/</b>.
                    </p>
                </section>
                   
                {/* Presentation Flow: ORDER Command */}     
                <section className="doc-section">
                    <h3>Presentation Flow: ORDER Command</h3>
                    <p>
                        The <b>\\ORDER</b> command controls the sequence of slide presentation. Slides are presented in the order specified, 
                        separated by commas. For branching paths, use the '<b>|</b>' operator to present different options, allowing 
                        educators to adapt the presentation based on audience needs.
                    </p>
                    <pre className="syntax-example">
                        {`
\\ORDER{Slide1, Slide2, (Slide3 | Slide4), Slide5}
                        `}
                    </pre>
                    <h4>Running Example:</h4>
                    <div className="code-div"><pre className="code-example">
{`\\NEWREACTIVE{highlight}{text-color: green; bold;}
\\NEWFIXED{removed}{text-color: red; strikethrough;}
\\variable{error}{text-color: red; bold;}
    
\\SLIDE{Intro}{Introduction to Variables}
\\DESCRIPTION{Variables are used to store values that can be accessed later on.}
\\BEGIN
    \\error{int x == 5;}
    int y = x + 10;
    char* st = "a normal string \\\\n";
\\END                   
`}<b>{`\\ORDER{Intro, Variables, (Examples | Quiz), Conclusion}`}</b>
                    </pre></div>
                    <p>
                    This defines a flow where the presentation starts with <b>Intro</b> followed by <b>Variables</b>, then branches into <b>Examples</b> or <b>Quiz</b>, and finally ends with <b>Conclusion</b>.
                    </p>
                </section>    

                {/* How to create presentation */}
                {tutorialText ? 
                <section className="doc-section">
                <button
                    className="feedback-button"
                    onClick={() => navigate(`/tutorial`)}
                  >
                    How to create your presentation
                  </button>
                    <p>
                    A tutorial presentation can be visited through the above button, while the source code used for it can be seen below.
                    </p>
                    <pre className="break-text">{tutorialText}</pre>
                </section>:null}    
            </div>
        </div>
    );
};

export default Documentation;
