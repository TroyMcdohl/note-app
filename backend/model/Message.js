const db = require("../config/db");

class Message {
  constructor(user, message) {
    this.user = user;
    this.message = message;
  }

  save() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();

    let createdAt = `${year}-${month}-${day}`;

    let sql = `INSERT INTO messages(user,message,createdAt) VALUES('${this.user}','${this.message}','${createdAt}')`;

    return db.execute(sql);
  }

  static findUserMessages(id) {
    let sql = `SELECT * FROM messages
    WHERE user = ${id}
    `;

    return db.execute(sql);
  }

  static findByIdAndDelete(id) {
    let sql = `DELETE from messages
    WHERE id = ${id}`;

    return db.execute(sql);
  }

  static findByIdAndUpdate(id, updateVal) {
    let sql = `UPDATE messages
    SET message = '${updateVal}'
    WHERE id = ${id}`;

    return db.execute(sql);
  }
}

module.exports = Message;
