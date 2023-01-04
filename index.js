import * as dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import routes from "./src/routes";

const { PORT } = process.env;

const fastify = Fastify({
  logger: {
    level: "info",
  },
});

fastify.register(routes, { prefix: "/api" });

fastify.get(
  "/",
  async (request, reply) => "welcome to the torrent search api!"
);

fastify.listen({ port: PORT }, (err, address) => {
  if (err) return fastify.log.error(err);

  // Server is now listening on ${address}
  console.log(
    `Server is now listening on ${address.replace("[::1]", "127.0.0.1")}`
  );
});
