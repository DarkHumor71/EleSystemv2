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
const Landing: React.FC = () => {
  const navigate = useNavigate();

  // Handle form submission to check JWT and redirect
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    navigate(token ? "/dash" : "/login");
  };

  // On mount, check JWT and redirect if present
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      navigate("/dash");
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
