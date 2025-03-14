import React, { useState } from "react";
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
  isModerator,
  isResident,
}) => {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [showPinField, setShowPinField] = useState(false);
  const [showCheck, setShowCheck] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // Popup state

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
        setShowPinField(true);
        setShowCheck(false);
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
      const req = await loginApartment(pin, email);
      if (req.work) {
        if (req.mod) {
          setShowPopup(true);
        } else {
          navigate("/dash");
        }
      } else {
        setShowPinField(false);
        setShowCheck(true);
        setPin("");
      }
    } catch (error) {
      console.log("error");
    }
  };
  if (isAuthenticated) {
    if (isModerator) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-4">LOGIN AS</p>
            <div className="flex gap-4">
              <button
                className="btn btn-success"
                onClick={() => navigate("/mod")}
              >
                Moderator
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/apr")}
              >
                Apartment
              </button>
            </div>
          </div>
        </div>
      );
    } else if (isResident) {
      return navigate("apr");
    } else {
      return navigate("dash");
    }
  }
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
        {showCheck && (
          <input type="submit" className="btn btn-primary" value="Check" />
        )}
      </form>

      {showPinField && (
        <form className="form" onSubmit={handlePinSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="PIN"
              name="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
      )}

      {/* Moderator Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold mb-4">LOGIN AS</p>
            <div className="flex gap-4">
              <button
                className="btn btn-success"
                onClick={() => navigate("/mod")}
              >
                Moderator
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/apr")}
              >
                Apartment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  loginBuilding: PropTypes.func.isRequired,
  loginApartment: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isModerator: PropTypes.bool,
  isResident: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isModerator: state.auth.isModerator,
  isResident: state.auth.isResident,
});

export default connect(mapStateToProps, {
  setAlert,
  loginBuilding,
  loginApartment,
})(Login);
