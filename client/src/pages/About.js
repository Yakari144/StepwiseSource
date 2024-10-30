// a home page
import React from 'react';
import './About.css';
import Header from '../components/Header';
import FeedbackForm from '../components/FeedbackForm';

function About() {
    return (
        <div className="about-page">
            <div className="AboutHeader">
                <Header pages={["Create","Presentations","Documentation"]}/>
            </div>
            <div className="about-container">
                <h1>About StepwiseSource</h1>
                <div className="about-section">
                    <p>
                    This project is developed as part of a master's thesis in Informatics Engineering at University of Minho, in Braga, Portugal. <br/>
                    The primary goal of the tool is to support educators in the field of programming by providing an interactive platform that enhances the teaching and learning experience. 
                    By offering structured, step-by-step presentations with recourse to exercises, it helps both teachers and students explore key programming concepts in a more engaging and effective way, addressing common challenges in educational settings.
                    </p>
                </div>
                <div className="about-section">
                    <h2>Team</h2>
                        <h3>João Luís Santos</h3>
                            <ul>
                                <li><p>
                                    <b>Role:</b> Student
                                </p></li>
                                <li><p>
                                   <b>Email:</b> <a href="mailto:joaoltmsantos@gmail.com">joaoltmsantos@gmail.com</a>
                                </p></li>
                            </ul>
                        <h3>Pedro Rangel Henriques</h3>
                            <ul>
                                <li><p>
                                    <b>Role:</b> Supervisor
                                </p></li>
                            </ul>
                        <h3>Alvaro Costa Neto</h3>
                            <ul>
                                <li><p>
                                    <b>Role:</b> Supervisor
                                </p></li>
                            </ul>
                </div>
                <div className="about-section">
                    <FeedbackForm/>
                </div>
            </div>
        </div>
    );
}

export default About;