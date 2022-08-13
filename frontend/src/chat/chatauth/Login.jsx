import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../customhook/useInput";
import { loginFail, loginStart, loginSuccess } from "../../store/authSlice";
import "./auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authFacts = useSelector((state) => state.auth);

  const {
    value: enteredPwd,
    hasError: pwdHasError,
    valueChangeHandler: pwdChangeHandler,
    inputBlurHandler: pwdBlurHandler,
    reset: pwdReset,
  } = useInput((value) => value.length > 0);

  const {
    value: enteredEmail,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput((value) => value.includes("@"));

  const emailClass = emailHasError ? "auth_input_invalid" : "auth_input";
  const pwdClass = pwdHasError ? "auth_input_invalid" : "auth_input";

  const loginHandler = async () => {
    try {
      dispatch(loginStart());
      const res = await axios.post("/users/login", {
        email: enteredEmail,
        pwd: enteredPwd,
      });

      dispatch(loginSuccess(res.data));
    } catch (error) {
      dispatch(loginFail(error.response.data.message));
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
            {authFacts.isFetching && (
              <h6 className="loading_box">Loading.....</h6>
            )}
            {authFacts.error && (
              <h6 className="error_box">* {authFacts.errFact}</h6>
            )}
            <h5 className="auth_title">Login</h5>
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
              signin
            </button>
            <button
              className="auth_btn_to"
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password
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

export default Login;
