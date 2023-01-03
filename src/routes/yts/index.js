import { YTS } from "../../providers";

const routes = async (fastify, options) => {
  const yts = new YTS();

  fastify.get("/:query", async (request, reply) => {
    const { query } = request.params;
    const { page } = request.query;

    const searchResult = await yts.search(query, page);
    reply.send(searchResult);
  });

  fastify.get("/info/:mediaId", async (request, reply) => {
    const { mediaId } = request.params;

    const mediaInfo = await yts.fetchMediaInfo(mediaId);
    reply.send(mediaInfo);
  });

  fastify.get("/latest/4k", async (request, reply) => {
    const searchResult = await yts.search("2160p");
    reply.send(searchResult);
  });

  fastify.get("/latest/1080p", async (request, reply) => {
    const searchResult = await yts.search("1080p");
    reply.send(searchResult);
  });

  fastify.get("/latest/720p", async (request, reply) => {
    const searchResult = await yts.search("720p");
    reply.send(searchResult);
  });
};

export default routes;
