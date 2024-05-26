import { FastifyPluginAsync } from "fastify";
import ParkControllers from "../../../controllers/ParkController.js";
import { addParkSchema, listParkSchema, checkoutParkSchema, reportParkSchema, resetParkSchema } from "./types.js";

const parks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const controller = new ParkControllers(fastify);

    fastify.post(
        "/",
        addParkSchema,
        controller.addPark.bind(controller)
    );
    fastify.get(
        "/",
        listParkSchema,
        controller.listParks.bind(controller)
    );
    fastify.post(
        "/checkout",
        checkoutParkSchema,
        controller.checkout.bind(controller)
    );

    fastify.get(
        "/report",
        reportParkSchema,
        controller.report.bind(controller)
    );
    fastify.post(
        "/reset",
        resetParkSchema,
        controller.resetAll.bind(controller)
    )
}

export default parks;