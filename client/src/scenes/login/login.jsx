import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { loginApartment, loginBuilding } from "../../actions/auth";
import { useNavigate } from "react-router-dom";
const Login = ({
  setAlert,
  loginBuilding,
  loginApartment,
  isAuthenticated,
}) => {
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [showPinField, setShowPinField] = useState(false);
  const navigate = useNavigate();
  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlert("Please enter an email address", "danger");
      return;
    }

    try {
      const response = await loginBuilding(email);
      if (response && response.exists) {
        setShowPinField(true); // Show the PIN field if the email exists
      }
    } catch (error) {
      console.log("error");
    }
  };

  // Handle PIN submission
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pin) {
      setAlert("Please enter a PIN", "danger");
      return;
    }

    try {
      if (await loginApartment(pin, email)) {
        console.log("success");
        navigate("/dash"); // Redirect
      } else {
        setShowPinField(false);
        setPin("");
      }
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={handleEmailSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Check" />
      </form>

      {showPinField && (
        <form className="form" onSubmit={handlePinSubmit}>
          <div className="form-group">
            <input
              type="password" // Use type="password" for PIN input
              placeholder="PIN"
              name="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
      )}
    </section>
  );
};

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  loginBuilding: PropTypes.func.isRequired,
  loginApartment: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
// });

export default connect(null, {
  setAlert,
  loginBuilding,
  loginApartment,
})(Login);
