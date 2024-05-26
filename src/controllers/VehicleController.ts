import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import BaseController from "./BaseController.js";
import {
    // queryString,
    queryStringWithVehicleNumber,
    // paramsId,
  } from "../types/global.js";
import VehicleService from "../services/VehicleService.js";
  
export default class VehicleController extends BaseController {
  readonly log: FastifyInstance["log"];
  readonly vehicleService: VehicleService;
  constructor(instance: FastifyInstance) {
    super();
    this.log = instance.log;
    this.vehicleService = new VehicleService(instance);
  }

  async listVehicles(request: FastifyRequest, reply: FastifyReply) {
    const { row, page, vehicleNumber } = request.query as queryStringWithVehicleNumber;
    try {
      const vehicles = await this.vehicleService.getVehicles(row, page, vehicleNumber);
      this.sendReply(reply, "Success to List Vehicles", vehicles);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }
}