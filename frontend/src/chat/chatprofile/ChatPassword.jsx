import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "../../customhook/useInput";
import Navbar from "../../nav/Navbar";
import "./chatPassword.css";

const ChatPassword = () => {
  const navigate = useNavigate();
  const [errFact, setErrFact] = useState();
  const [success, setSuccess] = useState(false);
  const {
    value: enteredPwd,
    hasError: pwdInputHasError,
    valueChangeHandler: pwdChangeHandler,
    inputBlurHandler: pwdBlurHandler,
    reset: pwdReset,
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredNewPwd,
    hasError: newPwdInputHasError,
    valueChangeHandler: newPwdChangeHandler,
    inputBlurHandler: newPwdBlurHandler,
    reset: newPwdReset,
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredConfirmPwd,
    hasError: confirmPwdInputHasError,
    valueChangeHandler: confirmPwdChangeHandler,
    inputBlurHandler: confirmPwdBlurHandler,
    reset: confirmPwdReset,
  } = useInput((value) => value.trim().length > 0);

  const oldPwdClass = pwdInputHasError ? "c_input_invalid" : "c_input";
  const pwdClass = newPwdInputHasError ? "c_input_invalid" : "c_input";
  const conPwdClass = confirmPwdInputHasError ? "c_input_invalid" : "c_input";

  const pwdHandler = async () => {
    try {
      await axios.patch("/users/updatepassword", {
        oldpwd: enteredPwd,
        newpwd: enteredNewPwd,
        conpwd: enteredConfirmPwd,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      navigate("/");
    } catch (err) {
      setErrFact(err.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="c_profile_container">
        {success && (
          <h5 style={{ color: "green", margin: "0", fontSize: "20px" }}>
            **Update Successfully.
          </h5>
        )}
        {errFact && <h5 style={{ margin: "0", color: "red" }}>***{errFact}</h5>}
        <h5 className="c_profile_title">User Password</h5>

        <div className="c_profile_input">
          <h5 className="c_label">Old Password</h5>
          <input
            type="password"
            className={oldPwdClass}
            placeholder="*******"
            onChange={pwdChangeHandler}
            onBlur={pwdBlurHandler}
            value={enteredPwd}
          />
          {pwdInputHasError && (
            <p style={{ color: "red" }}>*Password need to be fill.</p>
          )}
        </div>

        <div className="c_profile_input">
          <h5 className="c_label">New Password</h5>
          <input
            type="password"
            className={pwdClass}
            placeholder="*******"
            onChange={newPwdChangeHandler}
            onBlur={newPwdBlurHandler}
            value={enteredNewPwd}
          />
          {newPwdInputHasError && (
            <p style={{ color: "red" }}>*Password need to be fill.</p>
          )}
        </div>

        <div className="c_profile_input">
          <h5 className="c_label">Confirm Password</h5>
          <input
            type="password"
            className={conPwdClass}
            placeholder="*******"
            onChange={confirmPwdChangeHandler}
            onBlur={confirmPwdBlurHandler}
            value={enteredConfirmPwd}
          />
          {confirmPwdInputHasError && (
            <p style={{ color: "red" }}>*Password need to be fill.</p>
          )}
        </div>

        <button className="c_btn" onClick={pwdHandler}>
          Change
        </button>
      </div>
    </>
  );
};

export default ChatPassword;
