import { FastifyPluginAsync } from "fastify";
import VehicleControllers from "../../../controllers/VehicleController.js";
import { listVehicleSchema } from "./types.js";

const vehicles: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const controller = new VehicleControllers(fastify);
    fastify.get(
        "/",
        listVehicleSchema,
        controller.listVehicles.bind(controller)
    );
}

export default vehicles;