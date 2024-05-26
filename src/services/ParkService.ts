import { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/solecode";
import moment from "moment";
import ConfigService from "./ConfigService.js";
import VehicleService from "./VehicleService.js";
export default class ParkService {
  readonly prisma: FastifyInstance["prisma"];
  readonly log: FastifyInstance["log"];
  readonly configService: ConfigService;
  readonly vehicleService: VehicleService;
  constructor(instance: FastifyInstance) {
    this.prisma = instance.prisma;
    this.log = instance.log;
    this.configService = new ConfigService(instance);
    this.vehicleService = new VehicleService(instance);
  }

  async addPark(vehicleNumber: string) {

    //check if the number of vehicle that already parked is not more than the maximum parking lot
    const config = await this.configService.getAllConfigs();
    const maxParkingLot = config.find((c) => c.name === "parking_slot")?.valueInt;
    const parkedVehicleCount = await this.prisma.park.count({
      where: {
        departureTime: null,
        status: "Parked",
      },
    });
    if (parkedVehicleCount >= (maxParkingLot ?? 10)) {
      throw new Error("Parking lot is full");
    }

    // do check vehicle
    const vehicle = await this.vehicleService.checkVehicle(vehicleNumber);

    // Check if vehicle is already parked
    const parkedVehicle = await this.prisma.park.findFirst({
      where: {
        vehicleId: vehicle.id,
        departureTime: null,
        status: "Parked"
      },
    });

    if (parkedVehicle) {
      throw new Error("Vehicle is already parked");
    }
    
    // Create park
    const park = await this.prisma.park.create({
      data: {
        vehicle: { connect: { id: vehicle.id } },
        status: "Parked",        
      },
    });

    // Return park information along with vehicle number
    return { 
      park: park,
      vehicle: vehicle,
    };
  }

  async getParks(row: number, page: number, vehicleNumber: string) {
    const skip = (page - 1) * row;
    const take = row;
    const whereClause: Prisma.parkWhereInput = {
      AND: [
        {
            
          vehicle: {
            vehicleNumber: {
              contains: vehicleNumber,
              mode: "insensitive",
            },
          },
            
        },
        {
          departureTime: null, // Assuming departureTime being null means the vehicle is still parked
        },
        {
          status: 'Parked', // Additional condition to include Parked status
        },
      ],
    };
    const results = await this.prisma.park.findMany({
      skip,
      take,
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
          },
        },
      },
      orderBy:{
        arrivalTime: 'asc'
      }
    });

    const count = await this.prisma.park.count({
      where: whereClause,
    });

    return {results, count};
  }

  async checkout(vehicleNumber: string) {
    // Find vehicle by vehicleNumber
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { vehicleNumber: vehicleNumber },
    });

    // If vehicle does not exist, throw an error
    if (!vehicle) {
      throw new Error("Vehicle does not exist");
    }

    // Find the latest park record for the vehicle
    const park = await this.prisma.park.findFirst({
      where: {
        vehicleId: vehicle.id,
        departureTime: null,
        status: "Parked"
      }
    });

    // If the vehicle is not parked, throw an error
    if (!park) {
      throw new Error("Vehicle is not parked");
    }
    const currentDateTime = moment().toDate();
    

    // Calculate the duration of parking
    const duration = moment(currentDateTime).diff(park.arrivalTime, "minutes");

    // Calculate the parking fee
    const config = await this.prisma.config.findMany();
    const firstHourPrice = config.find((c) => c.name === "first_hour_price")?.valueInt;
    const nextHourPrice = config.find((c) => c.name === "next_hour_price")?.valueInt;
    let parkingFee = (firstHourPrice ?? 0) + (Math.ceil(duration / 60) - 1) * (nextHourPrice ?? 0);
    if (duration <= (config.find((c) => c.name === "free_park_minute")?.valueInt ?? 0)) {
      parkingFee = 0;
    }


    // Update park record with departure time
    const updatedPark = await this.prisma.park.update({
      where: { id: park.id },
      data: {
        departureTime: moment().toDate(),
        status: "Checked Out",
        bill: parkingFee,
      },
    });

    // Find the latest park record for the vehicle
    const lastDataPark = await this.prisma.park.findFirst({
      where: {id: updatedPark.id},
      include: {
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
          },
        },
      },
    });

    // Return park information along with vehicle number and parking fee
    return lastDataPark;
  }

  async getReport(filter: string[], startDate: string, endDate: string) {
    let whereClause: Prisma.parkWhereInput = {
      AND: [
        {
          arrivalTime: {
            gte: moment(startDate).startOf("day").toISOString(),
          },
        },
        {
          arrivalTime: {
            lte: moment(endDate).endOf("day").toISOString(),
          },
        },
      ],
    };
    if (filter != undefined && filter.length > 0) {
      whereClause.AND = whereClause.AND || [];
      (whereClause.AND as Prisma.parkWhereInput[]).push({
        vehicle: {
          vehicleNumber: {
            in: filter,
            mode: "insensitive",
          },
        },
      });
    }

    const results = await this.prisma.park.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            vehicleNumber: true,
          },
        },
      },
    });

    return results;
  }

  async resetAll() {
    const reset = await this.prisma.park.updateMany({
      where: {
        status: "Parked",
      },
      data: {
        status: "Checked Out",
      },
    });
    return reset;
  };
}