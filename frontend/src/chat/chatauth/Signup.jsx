import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../customhook/useInput";
import {
  fetchFail,
  fetchStart,
  fetchSuccess,
} from "../../store/createUserSlice";
import "./auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const authFacts = useSelector((state) => state.createAuth);
  const dispatch = useDispatch();
  const [enteredPhoto, setEnteredPhoto] = useState();

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

  const {
    value: enteredConPwd,
    hasError: conPwdHasError,
    valueChangeHandler: conPwdChangeHandler,
    inputBlurHandler: conPwdBlurHandler,
    reset: conPwdReset,
  } = useInput((value) => value.length > 0);

  const {
    value: enteredName,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: nameReset,
  } = useInput((value) => value.length > 0);

  const emailClass = emailHasError ? "auth_input_invalid" : "auth_input";
  const pwdClass = pwdHasError ? "auth_input_invalid" : "auth_input";
  const nameClass = nameHasError ? "auth_input_invalid" : "auth_input";
  const conPwdClass = conPwdHasError ? "auth_input_invalid" : "auth_input";

  const createHandler = async () => {
    const form = new FormData();
    form.append("name", enteredName);
    form.append("email", enteredEmail);
    form.append("pwd", enteredPwd);
    form.append("conpwd", enteredConPwd);
    form.append("photo", enteredPhoto);

    try {
      dispatch(fetchStart());
      await axios.post("/users/signup", form);
      dispatch(fetchSuccess());

      navigate("/login");
    } catch (error) {
      dispatch(fetchFail(error.response.data.message));
    }
  };

  return (
    <div className="auth_container">
      <div className="auth_wrapper">
        <div className="auth_left">
          <img
            src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
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
          <h5 className="auth_title">Register</h5>
          <div>
            <input
              type="text"
              className={nameClass}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              value={enteredName}
              placeholder="example"
            />
            {nameHasError && (
              <p
                style={{
                  color: "red",
                  margin: "5px 0px 0px 0px",
                  fontSize: "13px",
                }}
              >
                *Name need to be filled.
              </p>
            )}
          </div>
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
          <div>
            <input
              type="password"
              className={conPwdClass}
              onChange={conPwdChangeHandler}
              onBlur={conPwdBlurHandler}
              value={enteredConPwd}
              placeholder="********"
            />
            {conPwdHasError && (
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

          <div>
            <input
              type="file"
              className=""
              onChange={(e) => setEnteredPhoto(e.target.files[0])}
            />
          </div>

          <button className="auth_btn" onClick={createHandler}>
            signup
          </button>
          <button className="auth_btn_to">
            Already have a account.Sign Up <Link to="/login">here</Link>.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
