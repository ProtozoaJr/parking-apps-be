import { S } from "fluent-json-schema";

export interface queryString {
  page: number;
  row: number;
  vehicleNumber: string;
}

export interface queryStringWithVehicleNumber extends queryString {
  vehicleNumber: string;
}

export interface paramsId {
  id: string;
}

export const queryListSchema = S.object()
  .prop("page", S.integer().default(1))
  .prop("row", S.integer().default(10))
  .prop("vehicleNumber", S.string().default(""));

export const paramsIdSchema = S.object().prop(
  "id",
  S.string().format("uuid").required()
);