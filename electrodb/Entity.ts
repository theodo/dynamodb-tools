import DynamoDB from "aws-sdk/clients/dynamodb";

import { Entity, EntityItem } from "electrodb";

const client = new DynamoDB.DocumentClient();

export const tableName = "PokemonsTable";

export const PokemonMasterEntity = new Entity(
  {
    model: {
      entity: "PokemonMaster",
      version: "1",
      service: "pokemons",
    },
    attributes: {
      // ✨ Hard default
      entityType: {
        type: "string",
        default: "PokemonMaster",
        // ✨ hidden feature
        hidden: true,
      },
      pokemonMasterId: { type: "string" },
    },
    indexes: {
      byPokemonMasterId: {
        pk: {
          field: "PK",
          composite: ["entityType"],
        },
        sk: {
          field: "SK",
          composite: ["pokemonMasterId"],
        },
      },
    },
  },
  { client, table: tableName }
);

export const pokemonModel = {
  entity: "PokemonMaster",
  version: "1",
  service: "pokemons",
};
const { entity, version, service } = pokemonModel;

export const PokemonInstanceEntity = new Entity(
  {
    model: {
      entity,
      version,
      service,
    },
    attributes: {
      entityType: {
        type: "string",
        default: "PokemonInstance",
      },

      pokemonInstanceId: {
        type: "string",
      },

      // ✨ string
      pokemonName: { type: "string", required: true },

      // ✨ number
      level: { type: "number", required: true },

      // ✨ boolean
      isLegendary: { type: "boolean", required: true },

      // ✨ string set
      types: {
        type: "string",
        items: ["FEU", "EAU"] as const,
      }, // ⭐️ we can pass enum here

      // ✨ list of strings (⭐️ we can set list elements types) -- schema like
      hobbies: {
        //
        type: "list",
        items: {
          type: "string",
        },
      },

      // ✨ map
      _internalMetadata: {
        type: "map", // ⭐️ we can define what the map look like ! <- killer feature?
        properties: {
          myStringAttribute: {
            type: "string",
          },
          myNumberAttribute: {
            type: "number",
          },
        },
      },

      pokemonMasterId: { type: "string", required: true },
      captureDate: { type: "string", required: true },
    },
    indexes: {
      byPokemonId: {
        // pk and sk are defined here => clear access pattern
        pk: {
          field: "PK",
          composite: ["entityType"],
        },
        sk: {
          field: "SK",
          composite: ["pokemonInstanceId"],
        },
      },
      byPokemonMasterId: {
        index: "gsi",
        pk: {
          field: "GSIPK",
          template: "PokemonInstance#${pokemonMasterId}", // ⭐️ we can also add suffix here (or even midfix) if we want to
          composite: ["pokemonMasterId"],
        },
        sk: {
          field: "GSISK",
          template: "${captureDate}",
          composite: ["captureDate"],
        },
      },
    },
  },
  { client, table: tableName }
);

type Item = EntityItem<typeof PokemonInstanceEntity>;
