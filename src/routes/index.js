import express from "express";
const router = express.Router();

import thePirateBay from "./thepiratebay";
import yts from "./yts";
import rarbg from "./rarbg";
import All from "./all";
import Stream from "./stream";

router.use("/tpb", thePirateBay);
router.use("/yts", yts);
router.use("/rarbg", rarbg);
router.use("/all", All);

router.use("/torrent", Stream);

router.get("/", (req, res) => {
  res.send("welcome to the torrent search api!");
});

export default router;
