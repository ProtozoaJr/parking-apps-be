import fp from "fastify-plugin";
import { S } from "fluent-json-schema";
export const envSchema = S.object()
  .prop("FASTIFY_PORT", S.number().default(3000))
  .prop("FASTIFY_ADDRESS", S.string().default("0.0.0.0"))
  .prop("DATABASE_URL", S.string())
  .prop("JWT_SECRET", S.string())
  .prop("ENV", S.string().enum(["development", "production"]))
  .prop("BASIC_AUTH_USERNAME", S.string())
  .prop("BASIC_AUTH_PASSWORD", S.string())
  .prop("ADDRESS_DOMAIN", S.string())
  .required([
    "FASTIFY_PORT",
    "FASTIFY_ADDRESS",
    "DATABASE_URL",
    "JWT_SECRET",
    // "ADDRESS_DOMAIN",
  ]);

declare module "fastify" {
  interface FastifyInstance {
    config: {
      FASTIFY_PORT: number;
      FASTIFY_ADDRESS: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      ENV: "development" | "production";
      BASIC_AUTH_USERNAME: string;
      BASIC_AUTH_PASSWORD: string;
      ADDRESS_DOMAIN: string;
    };
  }
}

export default fp(
  async (fastify) => {
    fastify
      .register(import("@fastify/env"), {
        dotenv: true,
        schema: envSchema.valueOf(),
      })
      .ready((err) => {
        if (err) {
          fastify.log.error(err.message);
          throw "=== Failed to Load Environment Variables ===";
        }
        fastify.log.info("=== Environment Variables Loaded ===");
      });
  },
  {
    name: "env",
    dependencies: [],
  }
);
