require("dotenv").config();
const { insertUrl, findOneByUrl, findMostRecentUrl } = require("./db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dns = require("node:dns/promises");
const { errRes } = require("./utils");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (_req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.route("/api/shorturl").post(async (req, res) => {
  const url = req.body?.url;

  try {
    const parsedUrl = new URL(url);
    await dns.lookup(parsedUrl.hostname);

    // check if the url already exists
    const alreadyCreatedUrl = await findOneByUrl(parsedUrl.toString());
    // if exists, return the already created
    if (alreadyCreatedUrl)
      return res.json({
        original_url: alreadyCreatedUrl?.original_url,
        short_url: alreadyCreatedUrl?.short_url,
      });

    // if not then get the last created url
    const mostRecentUrl = await findMostRecentUrl();
    // use most recent (short_url + 1) or 0 as short_url if there are no documents
    const short_url = mostRecentUrl ? mostRecentUrl.short_url + 1 : 0;
    const newUrl = await insertUrl(parsedUrl.toString(), short_url);

    return res.json({
      original_url: newUrl?.original_url,
      short_url: newUrl?.short_url,
    });
  } catch (e) {
    if (e instanceof TypeError) return res.json(errRes`Invalid URL`);
    if (e?.code === "ENOTFOUND") return res.json(errRes`Invalid Hostname`);
    return res.json(errRes`Unexpected Error`);
  }
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}/`);
});
