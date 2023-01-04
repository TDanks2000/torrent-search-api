import express from "express";
const router = express.Router();

import { thePirateBay } from "../../providers";
const tpb = new thePirateBay();

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  const { page } = req.query;

  const searchResult = await tpb.search(query, page);
  res.send(searchResult);
});

router.get("/info/:mediaId", async (req, res) => {
  const { mediaId } = req.params;

  const mediaInfo = await tpb.fetchMediaInfo(mediaId);
  res.send(mediaInfo);
});

export default router;
