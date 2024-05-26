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

  async getConfigs(row: number, page: number) {
    const skip = (page - 1) * row;
    const take = row;
    const results = await this.prisma.config.findMany({
      skip,
      take,
    });

    const count = await this.prisma.config.count({});

    return {results, count};
  }

  async getAllConfigs() {
    const results = await this.prisma.config.findMany();

    return results;
  }

  async patchConfig(id: string, configName: string, configValueInt: number, configValueString: string) {
    // Find config by id
    const config = await this.prisma.config.findUnique({
      where: { id: id },
    });

    if(!config) {
      throw new Error("Config not found");
    }

    if(configName !== config.name) {
      throw new Error("Config name mismatch (Config name cannot be changed!)");
    }

    const patchConfig = await this.prisma.config.update({
      where: { id: id },
      data: {
        valueInt: configValueInt,
        valueString: configValueString,
      },
    });

    return patchConfig;
  }
}