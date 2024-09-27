import React from 'react';
import ButtonScrollTo from '../components/ButtonScrollTo';
import Header from '../components/Header';
import './Documentation.css';  // You can style this to match your color theme

const Documentation = () => {

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
                <section className="doc-section">
                    <h2>Overview of the DSL Commands</h2>
                    <p>
                        StepwiseSource introduces a Domain-Specific Language (DSL) to help educators teach computational thinking 
                        through step-by-step, interactive presentations. The key commands in this DSL structure lessons, style 
                        content, incorporate interactivity, and control the flow of information.
                    </p>
                </section>
        
                <section className="doc-section">
                    <h3>Slide + Code Block</h3>
                    <p>The backbone of any presentation starts with a slide definition using the following commands:</p>
                    <pre>
                        {`
    \\SLIDE{ID}{TITLE}
    \\BEGIN
        content
    \\END
                        `}
                    </pre>
                    <p>
                        The ID is unique for each slide, and the TITLE gives context. The body contains the content, such as 
                        code snippets or text. 
                    </p>
                    <h4>Example:</h4>
                    <pre>
                        {`
    \\SLIDE{Intro}{Introduction to Variables}
    \\BEGIN
        int x = 5;
        int y = x + 10;
    \\END
                        `}
                    </pre>
                </section>
                        
                <section className="doc-section">
                    <h3>Styling: newreactive and newfixed</h3>
                    <p>
                        These commands apply styles to content. "newreactive" styles are only revealed with user interaction, 
                        while "newfixed" are always visible.
                    </p>
                    <pre>
                        {`
    \\NEWREACTIVE{ID}{style; style; ...}
    \\NEWFIXED{ID}{style; style; ...}
                        `}
                    </pre>
                    <h4>Example:</h4>
                    <pre>
                        {`
    \\NEWREACTIVE{highlight}{text-color: green; bold;}
    \\NEWFIXED{removed}{text-color: red; strikethrough;}
                        `}
                    </pre>
                </section>
                        
                <section className="doc-section">
                    <h3>Styling Syntax: CSS-like Rules</h3>
                    <p>
                        Styling in StepwiseSource uses familiar CSS-like rules. Educators can define styles for text, background, 
                        borders, and more, either using common color names or hex codes.
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
                                <td>bold</td>
                                <td>font-weight: bold</td>
                                <td>Makes text bold</td>
                            </tr>
                            {/* Add more rows as necessary */}
                        </tbody>
                    </table>
                </section>
                        
                <section className="doc-section">
                    <h3>Variable-Based Styling</h3>
                    <p>
                        StepwiseSource supports variable-based styling, promoting consistency across slides. Here’s the syntax:
                    </p>
                    <pre>
                        {`
    \\variable{ID}{TEXT}
                        `}
                    </pre>
                    <h4>Example:</h4>
                    <pre>
                        {`
    \\removed{wrongCode}{This code was removed.}
                        `}
                    </pre>
                </section>
                        
                <section className="doc-section">
                    <h3>Interactive Exercises</h3>
                    <p>
                        Engaging students is easy with the \EXERCISE command. This feature allows educators to prompt students to 
                        answer questions or solve exercises with real-time feedback.
                    </p>
                    <pre>
                        {`
    \\EXERCISE{/regex/}{prompt}
                        `}
                    </pre>
                    <h4>Example:</h4>
                    <pre>
                        {`
    \\EXERCISE{/^[0-9]+$/}{Enter a valid number}
                        `}
                    </pre>
                </section>
                        
                <section className="doc-section">
                    <h3>Presentation Flow: ORDER Command</h3>
                    <p>
                        The ORDER command dictates the sequence in which slides are presented. It supports branching paths 
                        using the | operator, allowing educators to customize the flow based on audience needs.
                    </p>
                    <pre>
                        {`
    \\ORDER{Slide1, Slide2, (Slide3 | Slide4), Slide5}
                        `}
                    </pre>
                    <h4>Example:</h4>
                    <pre>
                        {`
    \\ORDER{Intro, Variables, (Examples | Quiz), Conclusion}
                        `}
                    </pre>
                </section>
            </div>
        </div>
    );
};

export default Documentation;
