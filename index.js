require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dns = require("node:dns/promises");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.route("/api/shorturl").post(async (req, res) => {
  const url = req.body?.url;

  const errRes = (message) => ({ error: message });

  try {
    const parsedUrl = new URL(url);
    await dns.lookup(parsedUrl.hostname);

    res.redirect("/");
  } catch (e) {
    if (e instanceof TypeError) return res.json(errRes`Invalid URL`);
    if (e?.code === "ENOTFOUND") return res.json(errRes`Invalid Hostname`);
    return res.json(errRes`Unexpected Error`);
  }
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}/`);
});
