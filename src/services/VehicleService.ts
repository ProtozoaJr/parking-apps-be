import { FastifyInstance } from "fastify";
// import { Prisma } from "@prisma/solecode";
// import moment from "moment";
export default class VehicleService {
  readonly prisma: FastifyInstance["prisma"];
  readonly log: FastifyInstance["log"];
  constructor(instance: FastifyInstance) {
    this.prisma = instance.prisma;
    this.log = instance.log;
  }

  async getVehicles(row: number, page: number, vehicleNumber: string) {
    const skip = (page - 1) * row;
    const take = row;
    const results = await this.prisma.vehicle.findMany({
      skip,
      take,
      where: {
        vehicleNumber: {
          contains: vehicleNumber,
        },
      },
    });

    const count = await this.prisma.vehicle.count({});

    return {results, count};
  }

  async checkVehicle(vehicleNumber: string) {
    //find vehicle by vehicleNumber and insert it if it doesn't exist
    const vehicle = await this.prisma.vehicle.upsert({
      where: { vehicleNumber: vehicleNumber },
      update: {},
      create: { vehicleNumber: vehicleNumber },
    });

    return vehicle;
  }
}