import express from "express";
const router = express.Router();

import { thePirateBay, Rarbg, YTS } from "../../providers";
const tpb = new thePirateBay();
const rarbg = new Rarbg();
const yts = new YTS();

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  const { page } = req.query;

  const results = [
    ...(await tpb.search(query, page)).results,
    ...(await rarbg.search(query, page)).results,
    ...(await yts.search(query, page)).results,
  ];

  res.send(results);
});

router.get("/imdb/:imdbId", async (req, res) => {
  const { imdbId } = req.params;
  const { page } = req.query;

  const results = [
    ...(await rarbg.searchFromIMDB(imdbId, page)).results,
    await yts.searchFromIMDB(imdbId, page),
  ];

  res.send(results);
});

export default router;
