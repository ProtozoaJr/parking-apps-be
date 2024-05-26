// import { S } from "fluent-json-schema";
import { queryListSchema } from "../../../types/global.js";

export const listVehicleSchema = {
  schema: {
    summary: "List Vehicle",
    tags: ["Public","Vehicle"],
    querystring: queryListSchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

