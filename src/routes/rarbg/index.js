import express from "express";
const router = express.Router();
import { Rarbg } from "../../providers";

const rarbg = new Rarbg();

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  const { page } = req.query;

  const searchResult = await rarbg.search(query, page);
  res.send(searchResult);
});

router.get("/info/:mediaId", async (req, res) => {
  const { mediaId } = req.params;
  res.send(`method not implemented yet`);
});

export default router;
