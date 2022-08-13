import React, { useState } from "react";

import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import useInput from "../../customhook/useInput";

import "./auth.css";

const ResetPassword = () => {
  const [error, setError] = useState(false);
  const [errFact, setErrFact] = useState();
  const token = useParams().token;
  const navigate = useNavigate();
  const {
    value: enteredPwd,
    hasError: pwdHasError,
    valueChangeHandler: pwdChangeHandler,
    inputBlurHandler: pwdBlurHandler,
    reset: pwdReset,
  } = useInput((value) => value.length > 0);

  const pwdClass = pwdHasError ? "auth_input_invalid" : "auth_input";

  const loginHandler = async () => {
    try {
      const res = await axios.patch(`/users/resetpassword/${token}`, {
        newPwd: enteredPwd,
      });
      navigate("/login");
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
      setErrFact(error.response.data.message);
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
            <h5 className="auth_title">Reset Password</h5>

            <div>
              <input
                type="password"
                className={pwdClass}
                onChange={pwdChangeHandler}
                onBlur={pwdBlurHandler}
                value={enteredPwd}
                placeholder="********"
              />
              {pwdHasError && (
                <p
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 0px",
                    fontSize: "13px",
                  }}
                >
                  *Password need to be filled.
                </p>
              )}
            </div>
            <button className="auth_btn" onClick={loginHandler}>
              submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
