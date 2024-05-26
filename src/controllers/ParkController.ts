import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import BaseController from "./BaseController.js";
import {
    // queryString,
    queryStringWithVehicleNumber,
    // paramsId,
  } from "../types/global.js";
import ParkService from "../services/ParkService.js";
  
export default class ParkController extends BaseController {
  readonly log: FastifyInstance["log"];
  readonly parkService: ParkService;
  constructor(instance: FastifyInstance) {
    super();
    this.log = instance.log;
    this.parkService = new ParkService(instance);
  }

  async addPark(request: FastifyRequest, reply: FastifyReply) {
    const { vehicleNumber } = request.body as {
      vehicleNumber: string;
    };
    try {
      const park = await this.parkService.addPark(vehicleNumber);
      this.sendReply(reply, "Success to Add Park", park);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }

  async listParks(request: FastifyRequest, reply: FastifyReply) {
    const { row, page, vehicleNumber } = request.query as queryStringWithVehicleNumber;
    try {
      const parks = await this.parkService.getParks(row, page, vehicleNumber);
      this.sendReply(reply, "Success to List Parks", parks);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }

  async checkout(request: FastifyRequest, reply: FastifyReply) {
    const { vehicleNumber } = request.body as {
      vehicleNumber: string;
    };
    try {
      const park = await this.parkService.checkout(vehicleNumber);
      this.sendReply(reply, "Success to Checkout", park);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }

  async report(request: FastifyRequest, reply: FastifyReply) {
    const { filter, startDate, endDate } = request.query as {
      filter: string[];
      startDate: string;
      endDate: string;
    };
    try {
      const report = await this.parkService.getReport(filter, startDate, endDate);
      this.sendReply(reply, "Success to Get Report", report);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }

  async resetAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const reset = await this.parkService.resetAll();
      this.sendReply(reply, "Success to Reset Park", reset);
    } catch (e: any) {
      reply.code(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    }
  }
}