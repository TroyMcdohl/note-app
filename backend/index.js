const express = require("express");
const app = express();
const userRouter = require("./router/userRouter");
const messageRouter = require("./router/messageRouter");
const cookieParser = require("cookie-parser");
const GlobalErrorHandler = require("./error/GlobalErrorHandler");
const AppError = require("./error/AppError");
const path = require("path");

app.use(express.json());
app.use(cookieParser());

app.use(
  "/public/img/users",
  express.static(path.join("public", "img", "users"))
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

app.use("*", (req, res, next) => {
  return next(new AppError("Route not found", 404));
});

app.use(GlobalErrorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running!");
});
