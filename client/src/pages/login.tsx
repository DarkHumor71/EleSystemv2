import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../actions/alert";
import { loadApartment, loginApartment, loginBuilding } from "../actions/auth";
import { useNavigate } from "react-router-dom";

// Type definitions for props
interface LoginProps {
  setAlert: (msg: string, type: string) => void;
  loadApartment: () => Promise<void>;
  loginBuilding: (email: string) => Promise<{ exists?: boolean } | undefined>;
  loginApartment: (
    pin: string,
    email?: string
  ) => Promise<
    false | { work?: boolean; admin?: boolean; mod?: boolean } | undefined
  >;
  isAuthenticated?: boolean;
  isModerator?: boolean;
  isResident?: boolean;
  isloading: boolean;
  building_id?: string;
}

const Login: React.FC<LoginProps> = ({
  setAlert,
  loadApartment,
  loginBuilding,
  loginApartment,
  isAuthenticated,
  isModerator,
  isResident,
  isloading,
  building_id,
}) => {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [showPinField, setShowPinField] = useState(false);
  const [showCheck, setShowCheck] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setAlert("Please enter an email address", "danger");
      return;
    }
    try {
      const response = await loginBuilding(email);
      if (response && response.exists) {
        setShowPinField(true);
        setShowPopup(false);
        setShowCheck(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle PIN submission
  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pin) {
      setAlert("Please enter a PIN", "danger");
      return;
    }
    try {
      const req = await loginApartment(pin, email);
      if (req && req.work) {
        await loadApartment();
        if (req.admin) {
          navigate("/dash");
        } else if (req.mod) {
          setShowPopup(true);
        } else {
          navigate("/apr");
        }
      } else {
        setShowPinField(false);
        setShowCheck(true);
        setPin("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isloading) {
      // Loading state logic if needed
    }
    if (isAuthenticated && isModerator && !showPopup && building_id) {
      navigate("/mod");
    }
    if (isAuthenticated && !showPopup) {
      if (isModerator) {
        setShowPopup(true);
      } else if (isResident) {
        navigate("/apr");
      } else {
        navigate("/dash");
      }
    }
  }, [
    isAuthenticated,
    isModerator,
    isloading,
    isResident,
    navigate,
    showPopup,
    building_id,
  ]);

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
                onClick={() => {
                  navigate("/mod");
                }}
              >
                Moderator
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  navigate("/apr");
                }}
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

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isModerator: state.auth.isModerator,
  isResident: state.auth.isResident,
  isloading: state.auth.loading,
  building_id: state.auth.building_id,
});

export default connect(mapStateToProps, {
  setAlert,
  loginBuilding,
  loginApartment,
  loadApartment,
})(Login);
