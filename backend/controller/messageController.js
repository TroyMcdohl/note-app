const AppError = require("../error/AppError");
const Message = require("../model/Message");

exports.createMessage = async (req, res, next) => {
  try {
    const user = req.user.id;

    const usermsg = await Message.findUserMessages(req.user.id);

    const [usermsgs, _] = usermsg;

    if (req.body.message.length > 30) {
      return next(new AppError("Words should not be greater than 30"));
    }

    if (usermsgs.some((f) => f.message === req.body.message)) {
      return next(new AppError("Note already added to list", 400));
    }

    if (req.body.message && req.body.message.length > 0) {
      const msg = new Message(user, req.body.message);

      await msg.save();

      res.status(200).json(msg);
    } else {
      return next(new AppError("Need to fill Form", 400));
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserMessages = async (req, res, next) => {
  try {
    const usermsg = await Message.findUserMessages(req.user.id);

    if (!usermsg) {
      return next(new AppError("No Note found", 404));
    }

    const [umsg, _] = usermsg;

    res.status(200).json(umsg);
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.nid);

    if (!msg) {
      return next(new AppError("Note with that id not found", 400));
    }

    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
};

exports.updateMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.nid, req.body.note);

    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
};
