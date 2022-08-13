import React, { useState, useRef } from "react";
import useInput from "../../customhook/useInput";
import "./chatProfile.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../nav/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "../../store/authSlice";
import { useEffect } from "react";

const ChatProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user[0]);
  const navigate = useNavigate();
  const imgRef = useRef();
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [img, setImg] = useState(user.photo);
  const [success, setSuccess] = useState(false);
  const [fileDataURL, setFileDataURL] = useState();
  const [errFact, setErrFact] = useState();
  const [err, setErr] = useState(false);

  // useEffect(() => {
  //   if (img) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFileDataURL(reader.result);
  //     };
  //     reader.readAsDataURL(img);
  //   } else {
  //     setFileDataURL(null);
  //   }
  // }, [img]);

  const emailHasError = !email.includes("@");
  const nameHasError = !name.length > 0;

  const emailClass = emailHasError ? "c_input_invalid" : "c_input";
  const nameClass = nameHasError ? "c_input_invalid" : "c_input";

  const changeHandler = async () => {
    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("photo", img);

    try {
      await axios.patch("/users/updateme", form);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);

      const u = await axios.get(`/users/${user.id}`);

      dispatch(updateUser(u.data));
    } catch (error) {
      setErr(true);
      setErrFact(error.response.data.message);
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
        {err && (
          <h5 style={{ color: "red", margin: "0", fontSize: "20px" }}>
            ***{errFact}
          </h5>
        )}
        <h5 className="c_profile_title">User Profile</h5>

        {fileDataURL ? (
          <img
            src={fileDataURL}
            alt=""
            className="c_profile_img"
            onClick={() => imgRef.current.click()}
          />
        ) : (
          <img
            src={`http://localhost:8000/${user.photo}`}
            accept="image/*"
            alt=""
            className="c_profile_img"
            onClick={() => imgRef.current.click()}
          />
        )}

        <input
          ref={imgRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />

        <div className="c_profile_input">
          <label htmlFor="" className="c_label">
            Name
          </label>
          <input
            type="text"
            className={nameClass}
            placeholder="example"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameHasError && (
            <p style={{ color: "red" }}>*Name need to be filled.</p>
          )}
        </div>
        <div className="c_profile_input">
          <label htmlFor="" className="c_label">
            Email
          </label>
          <input
            type="text"
            className={emailClass}
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailHasError && (
            <p style={{ color: "red" }}>*Email need to be filled.</p>
          )}
        </div>
        <button className="c_btn" onClick={changeHandler}>
          Change
        </button>
        <button
          className="c_pwd_btn"
          onClick={() => {
            navigate("/user/password");
          }}
        >
          Password
        </button>
      </div>
    </>
  );
};

export default ChatProfile;
