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

new DB();

const UrlSchema = mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    required: true,
  },
});

const UrlModel = mongoose.model("url", UrlSchema);

const insertUrl = async (original_url, short_url) =>
  await UrlModel.create({
    original_url,
    short_url,
  });

const findOneByUrl = async (url) =>
  await UrlModel.findOne({
    original_url: url,
  });

const findMostRecentUrl = async () => {
  const result = await UrlModel.find({}).sort("-_id").limit(1);
  return result[0];
};

module.exports = {
  UrlModel,
  insertUrl,
  findOneByUrl,
  findMostRecentUrl,
};
