import * as dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import routes from "./src/routes";

const { PORT } = process.env;

const fastify = Fastify({
  logger: true,
});

fastify.register(routes, { prefix: "/api" });

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  console.log(`Server is now listening on ${address}`);
});
