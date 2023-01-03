import { Rarbg } from "../../providers";

const routes = async (fastify, options) => {
  const rarbg = new Rarbg();

  fastify.get("/:query", async (request, reply) => {
    const { query } = request.params;
    const { page } = request.query;

    const searchResult = await rarbg.search(query, page);
    reply.send(searchResult);
  });

  fastify.get("/info/:mediaId", async (request, reply) => {
    const { mediaId } = request.params;
    reply.send(`method not implemented yet`);
  });
};

export default routes;
