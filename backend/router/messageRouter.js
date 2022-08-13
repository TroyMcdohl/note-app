const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const messageController = require("../controller/messageController");

router
  .route("/")
  .post(userController.protect, messageController.createMessage)
  .get(userController.protect, messageController.getUserMessages);

router
  .route("/:nid")
  .delete(userController.protect, messageController.deleteMessage)
  .patch(userController.protect, messageController.updateMessage);

module.exports = router;
