const mongoose = require("mongoose");

class DB {
  constructor() {
    this._connect()
      .then(() => {
        console.log("Successfully connected to MongoDB");
      })
      .catch((_e) => {
        console.error("Failed to connect to MongoDB");
      });
  }

  async _connect() {
    await mongoose.connect(process.env.MURI);
  }
}

module.exports = new DB();
