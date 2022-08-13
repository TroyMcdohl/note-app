const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../error/AppError");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
const Email = require("../email/email");

exports.createUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.photo = "public/img/users/" + req.file.filename;
    }

    const { name, email, pwd, conpwd } = req.body;

    if (pwd !== conpwd) {
      return next(new AppError("Password not matched", 400));
    } else if (!email.includes("@")) {
      return next(new AppError("Email should include @", 400));
    } else if (!pwd.length > 0) {
      return next(new AppError("Password should be filled", 400));
    } else if (!name.length > 0) {
      return next(new AppError("Name should be filled", 400));
    } else if (req.body.photo === "undefined") {
      return next(new AppError("Photo should be filled", 400));
    } else {
      const newUser = new User(
        name,
        email,
        await bcrypt.hash(pwd.toString(), 12),
        req.body.photo
      );

      await newUser.save();

      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const finduser = await User.findOne("email", req.body.email);

    const [user, _] = finduser;

    if (
      !user[0] ||
      !(await bcrypt.compare(req.body.pwd.toString(), user[0].pwd))
    ) {
      return next(new AppError("User not found", 404));
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRECT);

    res.cookie("jwt", token, {
      httpOnly: true,
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });

  res.status(200).json({ status: "success" });
};

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    const [user, _] = users;

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.uid);

    const [u, _] = user;

    res.status(200).json(u);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.photo = "public/img/users/" + req.file.filename;
    }

    if (!req.body.email.includes("@")) {
      return next(new AppError("Email should include @", 400));
    } else if (!req.body.name.length > 0) {
      return next(new AppError("Name should be filled", 400));
    } else if (req.body.photo === undefined) {
      return next(new AppError("Photo should be filled", 400));
    } else {
      const users = await User.findByIdAndUpdate(
        req.user.id,
        req.body.name,
        req.body.email,
        req.body.photo
      );

      res.status(200).json(users);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.uid);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
  }
};

exports.protect = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new AppError("Please Login.", 401));
  }

  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRECT);

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(404).json({ status: "fail", message: "Please Login" });
  }

  const [u, _] = user;

  req.user = u[0];

  next();
};

exports.updatePassword = async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id);

    const [users, _] = u;

    const user = users[0];

    if (
      !user ||
      !(await bcrypt.compare(req.body.oldpwd.toString(), user.pwd))
    ) {
      return next(new AppError("Password Wrong", 400));
    }

    if (req.body.newpwd !== req.body.conpwd) {
      return next(new AppError("Password not match", 400));
    } else {
      await User.savePassword(
        await bcrypt.hash(req.body.newpwd.toString(), 12),
        user.id
      );
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  let resetURL;
  const finduser = await User.findOne("email", req.body.email);

  const [user, _] = finduser;

  if (!user[0]) {
    return next(new AppError("User not found", 404));
  }

  const token = crypto.randomBytes(32).toString("hex");

  const resetToken = crypto.createHash("sha256").update(token).digest("hex");

  if (await User.createToken(resetToken, req.body.email)) {
    resetURL = `http://localhost:3000/resetpassword/${token}`;
  }

  try {
    new Email(user[0], resetURL).changeForgotPassword();

    res.status(200).json({ status: "success" });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const finduser = await User.findOne("create_reset_token", token);

  if (!finduser[0].length > 0) {
    return next(new AppError("Can't update password", 400));
  }

  const [user, _] = finduser;

  try {
    await User.savePassword(
      await bcrypt.hash(req.body.newPwd.toString(), 12),
      user[0].id
    );

    user[0].create_reset_token = null;

    await User.createToken("", user[0].email);

    res.status(200).json({ status: "success" });
  } catch (err) {
    next(err);
  }
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload a image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.uploadResizeUserPhoto = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
