import { S } from "fluent-json-schema";
// import { queryListSchema } from "../../../types/global.js";

export const queryListConfigSchema = S.object()
  .prop("page", S.integer().default(1))
  .prop("row", S.integer().default(10))

export const bodyConfigSchema = S.object()
  // .prop("id", S.string().format("uuid").required())
  .prop("configName", S.string().required())
  .prop("configValueInt", S.integer())
  .prop("configValueString", S.string());

export const patchConfigSchema = {
  schema: {
    summary: "Patch Config",
    tags: ["Public","Config"],
    body: bodyConfigSchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

export const listConfigSchema = {
  schema: {
    summary: "List Config",
    tags: ["Public","Config"],
    querystring: queryListConfigSchema.valueOf(),
    security: [
      {
        basic: [],
      },
    ],
  },
};

