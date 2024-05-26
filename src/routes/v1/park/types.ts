import { S } from "fluent-json-schema";
import { queryListSchema } from "../../../types/global.js";
export interface parkBody {
  vehicleNumber: string;
}

const parkBodySchema = S.object()
.prop("vehicleNumber", S.string().required());

const queryReportSchema = S.object()
  .prop("filter", S.array().items(S.string()))
  .prop("startDate", S.string().format("date").required())
  .prop("endDate", S.string().format("date").required());

export const addParkSchema = {
  schema: {
    summary: "Add Vehicle to Parking Lot",
    tags: ["Public","Park"],
    body: parkBodySchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

export const listParkSchema = {
  schema: {
    summary: "List Parked Vehicles",
    tags: ["Public","Park"],
    querystring: queryListSchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

export const checkoutParkSchema = {
  schema: {
    summary: "Checkout Vehicle from Parking Lot",
    tags: ["Public","Park"],
    body: parkBodySchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

export const reportParkSchema = {
  schema: {
    summary: "Report of Parked Vehicles",
    tags: ["Public","Park"],
    querystring: queryReportSchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

export const resetParkSchema = {
  schema: {
    summary: "Reset All Parked Vehicle to Checked Out",
    tags: ["Public","Park"],
    security: [
      {
        basic: [],
      },
    ],
  },
};
