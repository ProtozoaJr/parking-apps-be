import fp from "fastify-plugin";
import { readFile } from "fs/promises";
const pkg = JSON.parse(
  (await readFile(new URL("../../package.json", import.meta.url))).toString()
);

export default fp(
  async (fastify) => {
    fastify
      .register(import("@fastify/swagger"), {
        swagger: {
          info: {
            title: pkg.name,
            description: pkg.description,
            version: pkg.version,
          },
          host: fastify.config.ADDRESS_DOMAIN,
          schemes: ["http"],
          consumes: ["application/json"],
          produces: ["application/json"],
          tags: [
            {
              name: "Public",
              description: "Public API",
            },
            {
              name: "Park",
              description: "Park API",
            },
            {
              name: "Vehicle",
              description: "Vehicle API",
            },
            {
              name: "Config",
              description: "Config API",
            },
          ],
          securityDefinitions: {
            basic: {
              type: "basic",
            },
          },
        },
      })
      .ready((err) => {
        if (err) {
          fastify.log.error(err.message);
          throw "=== Failed to Load Swagger ===";
        }
        fastify.log.info("=== Swagger Loaded ===");
      });

    fastify
      .register(import("@fastify/swagger-ui"), {
        routePrefix: "/docs",
        staticCSP: true,
        uiConfig: {
          docExpansion: "none",
          deepLinking: false,
        },
        uiHooks: {
          onRequest: function (request, reply, next) {
            next();
          },
          preHandler: function (request, reply, next) {
            next();
          },
        },
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
          return swaggerObject;
        },
        transformSpecificationClone: true,
      })
      .ready((err) => {
        if (err) {
          fastify.log.error(err.message);
          throw "=== Failed to Load Swagger UI ===";
        }
        fastify.log.info("=== Swagger UI Loaded ===");
      });
  },
  {
    name: "swagger",
    dependencies: ["env"],
  }
);
