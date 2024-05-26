import { Prisma } from "@prisma/solecode";
import { FastifyReply } from "fastify";
import PrismaError from "../utils/errorHandler/prisma.js";

export default class BaseController {
  protected sendReply(reply: FastifyReply, message: string, data: any) {
    reply.send({
      status: true,
      message,
      data,
    });
  }

  protected handleError(e: any, reply: FastifyReply) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError(e);
    }
    reply.code(400).send({
      status: false,
      message: e.message,
      data: [],
    });
  }
}
