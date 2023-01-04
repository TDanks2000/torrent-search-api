import thePirateBay from "./thepiratebay";
import yts from "./yts";
import rarbg from "./rarbg";
import All from "./all";
import Stream from "./stream";

const routes = async (fastify, options) => {
  fastify.get(
    "/",
    async (request, reply) => "welcome to the torrent search api!"
  );

  fastify.register(thePirateBay, { prefix: "/tpb" });
  fastify.register(yts, { prefix: "/yts" });
  fastify.register(rarbg, { prefix: "/rarbg" });
  fastify.register(All, { prefix: "/all" });

  fastify.register(Stream, { prefix: "/torrent" });
};

export default routes;
