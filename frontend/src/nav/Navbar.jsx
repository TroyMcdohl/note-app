import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import axios from "axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user[0]);

  const logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="nav_container">
      <div className="nav_wrapper">
        <div className="nav_left">
          <h5 className="nav_title">Mern Note</h5>
        </div>
        <div className="nav_right">
          <img
            src={`http://localhost:8000/${user.photo}`}
            alt=""
            className="c_nav_img"
            onClick={() => navigate("/user/profile")}
          />
          <button className="nav_btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
