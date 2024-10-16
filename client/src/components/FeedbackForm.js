// src/FeedbackForm.js
import React, { useState } from 'react';
import "./FeedbackForm.css"

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost";
const EXPRESS_PORT = process.env.REACT_APP_EXPRESS_PORT || "50741";

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the feedback to your server
        let link = BASE_URL+":"+EXPRESS_PORT+"/api/feedback"
        fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({'feedbackText':feedback})
        })
        .then((res) => {
            if(!res.ok){
                // get the text sent in the response even if the status is 500
                res.text()
                    .then(text => {
                        console.log("Error on submiting:",text)
                    })
                    return;
            }
            else{
                return res.json()
            }
        })
        .catch((error) => {
            console.error("Error creating demo:", error);
        });
        console.log('Feedback submitted:', feedback);
        setFeedback('');
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false); // Run it again
        }, 5000);
    };

    return (
        <div>
            <h2>Feedback</h2>
            {submitted ? (
                <p>Thank you for your feedback!</p>
            ) : (
                <form className="feedback-container" onSubmit={handleSubmit}>
                    <textarea
                        className="feedback-textarea"
                        value={feedback}
                        onChange={handleChange}
                        placeholder="Your feedback here..."
                        required
                        rows="4"
                        cols="50"
                    />
                    <br />
                    <button className="feedback-button" type="submit">Submit Feedback</button>
                </form>
            )}
        </div>
    );
};

export default FeedbackForm;
