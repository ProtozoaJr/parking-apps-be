import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/solecode";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

type PrismaClientConfig = Omit<
  ConstructorParameters<typeof PrismaClient>[0],
  "__internal"
>;

interface PrismaPluginOptionsWithClient {
  /**
   * Allow overriding the prisma client instance, with a custom one.
   */
  client: PrismaClient;
}

interface PrismaPluginOptionsWithoutClient {
  /**
   * Allow passing the prisma client configuration, to create a new instance.
   */
  clientConfig?: PrismaClientConfig;
}

export type PrismaPluginOptions =
  | PrismaPluginOptionsWithClient
  | PrismaPluginOptionsWithoutClient;

async function createClient(
  pluginOpts: PrismaPluginOptions,
  schemaType: string
): Promise<PrismaClient> {
  if ("client" in pluginOpts) {
    return pluginOpts.client;
  } else {
    return new PrismaClient(pluginOpts.clientConfig);
  }
}

export default fp(
  async (fastify) => {
    if (!fastify.hasDecorator("prisma")) {
      const client: PrismaClient = await createClient(
        {
          clientConfig: {
            log: [{ emit: "event", level: "query" }],
          },
        },
        "client"
      );
      const dsc: PrismaClient = await createClient(
        {
          clientConfig: {
            log: [{ emit: "event", level: "query" }],
          },
        },
        "dsc"
      );
      await client.$connect();
      await dsc.$connect();
      fastify.decorate("prisma", client as PrismaClient);
      fastify.addHook("onClose", async (fastify) => {
        await fastify.prisma.$disconnect();
      });
    } else {
      throw new Error(
        "A `prisma` decorator has already been registered, please ensure you are not registering multiple instances of this plugin"
      );
    }
  },
  {
    name: "prisma",
    dependencies: [],
  }
);
