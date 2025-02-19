import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../../actions/alert";
import PropTypes from "prop-types";
const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do no match!", "danger");
    } else {
      console.log("yes");
    }
  };
  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
          <label htmlfor="name">Name</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <label htmlfor="email">Email address</label>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-floating mb-3 mb-md-0">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                name="password"
                minLength="6"
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
              <label htmlfor="password">Password</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-3 mb-md-0">
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control"
                name="password2"
                minLength="6"
                value={password2}
                onChange={(e) => onChange(e)}
                required
              />
              <label htmlfor="password2">Confirm Password</label>
            </div>
          </div>
        </div>

        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  );
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
};
export default connect(null, { setAlert })(Register);
