import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import BaseController from "./BaseController.js";
import {
    queryString,
    // queryStringWithConfigNumber,
    // paramsId,
  } from "../types/global.js";
import ConfigService from "../services/ConfigService.js";
  
export default class ConfigController extends BaseController {
  readonly log: FastifyInstance["log"];
  readonly configService: ConfigService;
  constructor(instance: FastifyInstance) {
    super();
    this.log = instance.log;
    this.configService = new ConfigService(instance);
  }

  async listConfigs(request: FastifyRequest, reply: FastifyReply) {
    const { row, page } = request.query as queryString;
    try {
      const configs = await this.configService.getConfigs(row, page);
      this.sendReply(reply, "Success to List Configs", configs);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }

  async patchConfig(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { configName, configValueInt, configValueString } = request.body as {
      configName: string;
      configValueInt: number;
      configValueString: string;
    };
    try {
      const config = await this.configService.patchConfig(id, configName, configValueInt, configValueString);
      this.sendReply(reply, "Success to Patch Config", config);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }
}