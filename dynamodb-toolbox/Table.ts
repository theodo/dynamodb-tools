import { Table } from "dynamodb-toolbox";

import DynamoDB from "aws-sdk/clients/dynamodb";

const DocumentClient = new DynamoDB.DocumentClient({
  // Specify your client options as usual
  convertEmptyValues: false,
});

export const table = new Table({
  name: "PokemonsTable",
  partitionKey: "PK",
  sortKey: "SK",
  indexes: {
    GSI: { partitionKey: "GSIPK", sortKey: "GSISK" },
  },
  DocumentClient,
});
