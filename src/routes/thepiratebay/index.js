import { thePirateBay } from "../../providers";

const routes = async (fastify, options) => {
  const tpb = new thePirateBay();

  fastify.get("/:query", async (request, reply) => {
    const { query } = request.params;
    const { page } = request.query;

    const searchResult = await tpb.search(query, page);
    reply.send(searchResult);
  });

  fastify.get("/info/:mediaId", async (request, reply) => {
    const { mediaId } = request.params;

    const mediaInfo = await tpb.fetchMediaInfo(mediaId);
    reply.send(mediaInfo);
  });
};

export default routes;
