import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Landing component acts as a welcome page or entry point to the system. 
 * It checks if the user has a valid JWT token stored in the localStorage. 
 * If the token exists, the user is redirected to the dashboard, otherwise, 
 * they are prompted to log in by navigating to the login page.
 * 
 * @returns {ReactNode} - JSX representing the welcome screen with a login button.
 */
const Landing = () => {
    const navigate = useNavigate();  // hook to navigate between routes

    /**
     * Handle the form submission event to check if JWT exists and redirect accordingly.
     * @param {Event} e - The form submission event.
     */
    const onSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        if (token) {
            navigate("/dash");  // Redirect to the dashboard if JWT exists
        } else {
            navigate("/login");  // Redirect to login if JWT does not exist
        }
    };

    // On component mount, check if JWT exists in localStorage and redirect accordingly
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            navigate("/dash");  // Redirect to dashboard if JWT exists
        }
    }, [navigate]);

    return (
        <div className="welbody">
            <div className="welcome-container">
                <h1>Welcome to EleSystem!</h1>
                <form className="form" onSubmit={onSubmit}>
                    <input type="submit" className="welcome-button" value="Login" />
                </form>
            </div>
        </div>
    );
};

export default Landing;
