import "dotenv/config";
import express from "express";

import routes from "./src/routes";

const { PORT } = process.env;

const app = express();

app.use("/api", routes);
app.get("/", (req, res) => {
  res.send("welcome to the torrent search api!");
});

app.listen(PORT || 4001, () => {
  console.log(`Server is now listening on Port`, PORT);
});
