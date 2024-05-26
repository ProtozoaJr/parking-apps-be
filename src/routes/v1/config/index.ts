import { FastifyPluginAsync } from "fastify";
import ConfigControllers from "../../../controllers/ConfigController.js";
import { patchConfigSchema, listConfigSchema } from "./types.js";

const configs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const controller = new ConfigControllers(fastify);
    fastify.get(
        "/",
        listConfigSchema,
        controller.listConfigs.bind(controller)
    );
    fastify.patch(
        "/:id",
        patchConfigSchema,
        controller.patchConfig.bind(controller)
    );
}

export default configs;