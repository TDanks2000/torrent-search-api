import express from "express";
const router = express.Router();

import { YTS } from "../../providers";

const yts = new YTS();

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  const { page } = req.query;

  const searchResult = await yts.search(query, page);
  res.send(searchResult);
});

router.get("/info/:mediaId", async (req, res) => {
  const { mediaId } = req.params;

  const mediaInfo = await yts.fetchMediaInfo(mediaId);
  res.send(mediaInfo);
});

router.get("/latest/4k", async (req, res) => {
  const searchResult = await yts.search("2160p");
  res.send(searchResult);
});

router.get("/latest/1080p", async (req, res) => {
  const searchResult = await yts.search("1080p");
  res.send(searchResult);
});

router.get("/latest/720p", async (req, res) => {
  const searchResult = await yts.search("720p");
  res.send(searchResult);
});

router.get("/latest/3d", async (req, res) => {
  const searchResult = await yts.search("3d");
  res.send(searchResult);
});

export default router;
