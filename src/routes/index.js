import thePirateBay from "./thepiratebay";
import yts from "./yts";
import rarbg from "./rarbg";

const routes = async (fastify, options) => {
  fastify.register(thePirateBay, { prefix: "/tpb" });
  fastify.register(yts, { prefix: "/yts" });
  fastify.register(rarbg, { prefix: "/rarbg" });
};

export default routes;
