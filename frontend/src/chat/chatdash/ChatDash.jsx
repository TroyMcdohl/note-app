import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../nav/Navbar";
import {
  msgCreate,
  msgDelSuccess,
  msgFail,
  msgStart,
  msgSuccess,
} from "../../store/messageSlice";
import "./chatDash.css";

const ChatDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const msg = useSelector((state) => state.msg.messages);

  const [newVal, setNewVal] = useState("");
  const [errFact, setErrFact] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        dispatch(msgStart());
        const res = await axios.get("/messages");
        dispatch(msgSuccess(res.data));
      } catch (error) {
        dispatch(msgFail());
      }
    };
    fetchdata();
  }, [dispatch]);

  const clickHandler = async (m) => {
    const res = await axios.delete(`/messages/${m.id}`);
    dispatch(msgDelSuccess(m.id));
  };

  const createHandler = async () => {
    try {
      const res = await axios.post("/messages", {
        message: newVal,
      });

      const u = await axios.get("/messages");

      const resdata = u.data.filter(
        (f) => f.user === res.data.user && f.message === res.data.message
      );

      dispatch(msgCreate(resdata[0]));
      setNewVal("");
    } catch (err) {
      setErrFact(err.response.data.message);
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 2000);
    }
  };

  return (
    <>
      {err && (
        <p
          style={{
            position: "absolute",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "red",
            fontSize: "1.3rem",
            fontWeight: "300px",
          }}
        >
          ***{errFact}
        </p>
      )}
      <Navbar />
      <div className="chat_container">
        <div className="chat_wrapper">
          <div className="add_box">
            <input
              type="text"
              className="add_input"
              onChange={(e) => setNewVal(e.target.value)}
              value={newVal}
            />
            <button className="add_btn" onClick={createHandler}>
              <AddIcon />
            </button>
          </div>
          {msg.map((m) => (
            <div
              className="chat_card"
              key={m.id}
              onClick={() => clickHandler(m)}
            >
              <h6 className="chat">{m.message}</h6>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatDash;
