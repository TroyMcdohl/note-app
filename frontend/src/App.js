import React, { useState } from "react";
import ChatDash from "./chat/chatdash/ChatDash";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./nav/Navbar";
import ChatProfile from "./chat/chatprofile/ChatProfile";
import ChatPassword from "./chat/chatprofile/ChatPassword";
import Login from "./chat/chatauth/Login";
import Signup from "./chat/chatauth/Signup";

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Fogot from "./chat/chatauth/Fogot";
import ForgotSuccess from "./chat/chatauth/ForgotSuccess";
import ResetPassword from "./chat/chatauth/ResetPassword";

const App = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<Fogot />} />
          <Route path="/forgotsuccess" element={<ForgotSuccess />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<ChatDash />} />

          <Route path="/user/profile" element={<ChatProfile />} />
          <Route path="/user/password" element={<ChatPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
