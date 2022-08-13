const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.route("/login").post(userController.login);
router.route("/logout").patch(userController.logout);
router
  .route("/signup")
  .post(
    userController.uploadUserPhoto,
    userController.uploadResizeUserPhoto,
    userController.createUser
  );
router.route("/forgotpassword").post(userController.forgotPassword);
router.route("/resetpassword/:resetToken").patch(userController.resetPassword);

router.route("/").get(userController.protect, userController.getAllUser);

router
  .route("/updatepassword")
  .patch(userController.protect, userController.updatePassword);

router
  .route("/updateme")
  .patch(
    userController.protect,
    userController.uploadUserPhoto,
    userController.uploadResizeUserPhoto,
    userController.updateUser
  );

router
  .route("/:uid")
  .get(userController.getUser)

  .delete(userController.deleteUser);

module.exports = router;
