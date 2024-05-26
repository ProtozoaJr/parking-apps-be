import { Prisma } from "@prisma/solecode";

const prismaCode = new Map([
  [
    "P2000",
    {
      message:
        "The provided value for the column is too long for the column's type",
      httpStatus: 400,
    },
  ],
  [
    "P2001",
    {
      message: "The record searched for in the where condition does not exist",
      httpStatus: 404,
    },
  ],
  ["P2002", { message: "Unique constraint failed", httpStatus: 409 }],
  ["P2003", { message: "Foreign key constraint failed", httpStatus: 409 }],
  [
    "P2004",
    { message: "A constraint failed on the database", httpStatus: 400 },
  ],
  [
    "P2005",
    {
      message:
        "The value stored in the database for the field is invalid for the field's type",
      httpStatus: 400,
    },
  ],
  [
    "P2006",
    {
      message: "The provided value for the field is not valid",
      httpStatus: 400,
    },
  ],
  ["P2007", { message: "Data validation error", httpStatus: 400 }],
  ["P2008", { message: "Failed to parse the query", httpStatus: 400 }],
  ["P2009", { message: "Failed to validate the query", httpStatus: 400 }],
  ["P2010", { message: "Raw query failed", httpStatus: 500 }],
  ["P2011", { message: "Null constraint violation", httpStatus: 400 }],
  ["P2012", { message: "Missing a required value", httpStatus: 400 }],
  ["P2013", { message: "Missing a required argument", httpStatus: 400 }],
  [
    "P2014",
    {
      message:
        "The change you are trying to make would violate the required relation",
      httpStatus: 400,
    },
  ],
  [
    "P2015",
    { message: "A related record could not be found", httpStatus: 404 },
  ],
  ["P2016", { message: "Query interpretation error", httpStatus: 400 }],
  [
    "P2017",
    {
      message:
        "The records for relation between the parent and child models are not connected",
      httpStatus: 400,
    },
  ],
  [
    "P2018",
    {
      message: "The required connected records were not found",
      httpStatus: 404,
    },
  ],
  ["P2019", { message: "Input error", httpStatus: 400 }],
  ["P2020", { message: "Value out of range for the type", httpStatus: 400 }],
  [
    "P2021",
    {
      message: "The table does not exist in the current database",
      httpStatus: 404,
    },
  ],
  [
    "P2022",
    {
      message: "The column does not exist in the current database",
      httpStatus: 404,
    },
  ],
  ["P2023", { message: "Inconsistent column data", httpStatus: 400 }],
  [
    "P2024",
    {
      message: "Timed out fetching a new connection from the pool",
      httpStatus: 500,
    },
  ],
  [
    "P2025",
    {
      message:
        "An operation failed because it depends on one or more records that were required but not found",
      httpStatus: 404,
    },
  ],
  [
    "P2026",
    {
      message:
        "The current database provider doesn't support a feature that the query used",
      httpStatus: 400,
    },
  ],
  [
    "P2027",
    {
      message:
        "Multiple errors occurred on the database during query execution",
      httpStatus: 500,
    },
  ],
]);

export default class PrismaError extends Error {
  title: string; // Add the 'title' property
  metaData: Prisma.PrismaClientKnownRequestError["meta"];
  constructor(error: Prisma.PrismaClientKnownRequestError) {
    const { message } = prismaCode.get(error.code) as {
      message: string;
      httpStatus: number;
    };
    super(message);
    this.title = "Prisma Error"; // Assign a value to the 'title' property
    this.metaData = error.meta && JSON.parse(JSON.stringify(error.meta));
  }
}
