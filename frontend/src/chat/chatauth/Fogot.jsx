import React, { useState } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../customhook/useInput";

import "./auth.css";

const Fogot = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errFact, setErrFact] = useState();

  const {
    value: enteredEmail,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput((value) => value.includes("@"));

  const emailClass = emailHasError ? "auth_input_invalid" : "auth_input";

  const loginHandler = async () => {
    try {
      await axios.post("/users/forgotpassword", {
        email: enteredEmail,
      });

      navigate("/forgotsuccess");
    } catch (error) {
      setErrFact(error.response.data.message);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="auth_container">
        <div className="auth_wrapper">
          <div className="auth_left">
            <img
              src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTcxfHxzb2NpYWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
              alt=""
              className="auth_img"
            />
          </div>
          <div className="auth_right">
            {error && <h6 className="error_box">* {errFact}</h6>}
            <h5 className="auth_title">Forgot Password</h5>
            <div>
              <input
                type="text"
                className={emailClass}
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                value={enteredEmail}
                placeholder="example@gmail.com"
              />
              {emailHasError && (
                <p
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 0px",
                    fontSize: "13px",
                  }}
                >
                  *Email need to be filled.
                </p>
              )}
            </div>

            <button className="auth_btn" onClick={loginHandler}>
              Submit
            </button>
            <button
              className="auth_btn_to"
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button className="auth_btn_to">
              Don't have a account.Register <Link to="/signup">here</Link>.
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fogot;
