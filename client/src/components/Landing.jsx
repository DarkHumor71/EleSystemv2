import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        if (token) {
            navigate("/dash"); // Redirect to dashboard if JWT exists
        } else {
            navigate("/login"); // Redirect to login if JWT does not exist
        }
    };

    // Check for JWT on component mount
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            navigate("/dash"); // Redirect to dashboard if JWT exists
        }
    }, [navigate]);

    return (
        <div className="welbody">
            <div className="welcome-container">
                <h1>Welcome to EleSystem!</h1>
                <form className="form" onSubmit={onSubmit}>
                    <input type="submit" className="welcome-button" value="Login"/>
                </form>
            </div>
        </div>
    );
};

export default Landing;
