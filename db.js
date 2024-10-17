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
    unique: true,
  },
});

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("counter", CounterSchema);

const UrlModel = mongoose.model("url", UrlSchema);

const getNextSequence = async (name) => {
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

const insertUrl = async (original_url) => {
  const short_url = await getNextSequence("url_count");
  return await UrlModel.create({
    original_url,
    short_url,
  });
};

const findOneByUrl = async (url) =>
  await UrlModel.findOne({
    original_url: url,
  });

const findOneByUrlId = async (id) =>
  await UrlModel.findOne({
    short_url: id,
  });

const findMostRecentUrl = async () => {
  const result = await UrlModel.find({}).sort("-_id").limit(1);
  return result[0];
};

module.exports = {
  UrlModel,
  insertUrl,
  findOneByUrl,
  findOneByUrlId,
  findMostRecentUrl,
};
