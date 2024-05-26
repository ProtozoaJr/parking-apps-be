import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyBasicAuth from "@fastify/basic-auth";

export default fp(
  async (fastify) => {
    fastify
      .register(fastifyBasicAuth, {
        validate: (
          username: string,
          password: string,
          request: FastifyRequest,
          reply: FastifyReply,
          done: (err?: Error | undefined) => void
        ) => {
          if (
            username !== fastify.config.BASIC_AUTH_USERNAME ||
            password !== fastify.config.BASIC_AUTH_PASSWORD
          ) {
            done(new Error("Winter is coming"));
          }
          done();
        },
      })
      .ready((err) => {
        if (err) {
          fastify.log.error(err.message);
        }
      });
  },
  {
    name: "basicAuth",
    dependencies: ["env"],
  }
);
