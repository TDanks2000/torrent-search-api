import { thePirateBay, Rarbg, YTS } from "../../providers";

const routes = async (fastify, options) => {
  const tpb = new thePirateBay();
  const rarbg = new Rarbg();
  const yts = new YTS();

  fastify.get("/:query", async (request, reply) => {
    const { query } = request.params;
    const { page } = request.query;

    const results = [
      ...(await tpb.search(query, page)).results,
      ...(await rarbg.search(query, page)).results,
      ...(await yts.search(query, page)).results,
    ];

    reply.send(results);
  });

  fastify.get("/imdb/:imdbId", async (request, reply) => {
    const { imdbId } = request.params;
    const { page } = request.query;

    const results = [
      ...(await rarbg.searchFromIMDB(imdbId, page)).results,
      await yts.searchFromIMDB(imdbId, page),
    ];

    reply.send(results);
  });
};

export default routes;
