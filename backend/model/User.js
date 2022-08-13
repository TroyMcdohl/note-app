const db = require("../config/db");

class User {
  constructor(name, email, pwd, photo) {
    this.name = name;
    this.email = email;
    this.pwd = pwd;
    this.photo = photo;
  }

  save() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();

    let createdAt = `${year}-${month}-${day}`;

    let sql = `INSERT INTO users(username,email,pwd,createdAt,photo)VALUES('${this.name}','${this.email}','${this.pwd}','${createdAt}','${this.photo}')`;

    return db.execute(sql);
  }

  static savePassword(pwd, id) {
    let sql = `UPDATE users SET pwd = '${pwd}' WHERE id='${id}'`;

    return db.execute(sql);
  }

  static findOne(fact, other) {
    let sql = `SELECT * FROM users WHERE ${fact}='${other}' `;

    return db.execute(sql);
  }

  static find() {
    let sql = `SELECT * FROM users`;
    return db.execute(sql);
  }

  static findById(id) {
    let sql = `SELECT * FROM users WHERE id='${id}'`;
    return db.execute(sql);
  }

  static findByIdAndUpdate(id, newusername, newemail, newfile) {
    let sql;
    if (newfile) {
      sql = `UPDATE users SET username='${newusername}',email='${newemail}',photo='${newfile}' WHERE id='${id}'`;
    } else {
      sql = `UPDATE users SET username='${newusername}',email='${newemail}' WHERE id='${id}'`;
    }
    return db.execute(sql);
  }

  static findByIdAndDelete(id) {
    let sql = `DELETE FROM users WHERE id='${id}'`;
    return db.execute(sql);
  }

  static createToken(token, email) {
    let sql = `UPDATE users SET create_reset_token = '${token}' WHERE email = '${email}'`;
    return db.execute(sql);
  }
}

module.exports = User;
