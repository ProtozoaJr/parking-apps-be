import { FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(
    async (fastify) => {
        fastify.addHook('preHandler', async (request: FastifyRequest, reply) => {
            if (request.body && typeof (request.body as { vehicleNumber: string }).vehicleNumber === 'string' ) {
                (request.body as { vehicleNumber: string }).vehicleNumber = (request.body as { vehicleNumber: string }).vehicleNumber.replace(/\s+/g, '').toUpperCase().replace(/[^A-Z0-9]/g, ''); // Remove whitespace and convert to uppercase
            }
            if (request.query && typeof (request.query as { vehicleNumber: string }).vehicleNumber === 'string' ) {
                (request.query as { vehicleNumber: string }).vehicleNumber = (request.query as { vehicleNumber: string }).vehicleNumber.replace(/\s+/g, '').toUpperCase().replace(/[^A-Z0-9]/g, ''); // Remove whitespace and convert to uppercase
            }
        });
    },
    {
        name: "vehicleNumber",
        dependencies: ["env"],
    }
);
