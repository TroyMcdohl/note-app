const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.firstname = user.name;
    this.email = user.email;
    this.from = "Troy<troymcdohl@gmail.com>";
    this.url = url;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tharkosonofuaungthein@gmail.com",
        pass: "quxowagefdngsvzp",
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstname: this.firstname,
      url: this.url,
      subject,
    });

    const mailOption = {
      to: this.email,
      from: this.from,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOption);
  }

  async welcome() {
    await this.send(
      "welcome",
      "Welcome to M-shopping you can shop anytime here,Hope you will lie our company"
    );
  }

  async changeForgotPassword() {
    await this.send("forgotPwd", "About Password Reset");
  }
};
