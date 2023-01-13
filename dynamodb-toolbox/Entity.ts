import { Entity } from "dynamodb-toolbox";

import { table } from "./Table";

export const PokemonMaster = new Entity({
  name: "PokemonMaster",
  attributes: {
    // ✨ Hard default
    entityType: {
      type: "string",
      partitionKey: true,
      default: "PokemonMaster",
      // ✨ hidden feature
      hidden: true,
    },
    pokemonMasterId: { type: "string", sortKey: true },
  },
} as const);

export const PokemonInstanceEntity = new Entity({
  name: "PokemonInstance",
  attributes: {
    entityType: {
      type: "string",
      partitionKey: true,
      default: "PokemonInstance",
    },
    pokemonInstanceId: {
      type: "string",
      sortKey: true,
    },

    // ✨ string
    pokemonName: { type: "string", required: true },

    // ✨ number
    level: { type: "number", required: true },

    // ✨ boolean
    isLegendary: { type: "boolean", required: true },

    // ✨ string set
    types: { type: "set", setType: "string" },

    // ✨ list of strings (💥 impossible to set list elements types)
    hobbies: { type: "list" },

    // ✨ map (💥 impossible to specify map attributes types)
    _internalMetadata: { type: "map" },

    pokemonMasterId: { type: "string", required: true },
    captureDate: { type: "string", required: true },

    // Mapped GSI
    byPokemonMasterId: {
      type: "string",
      map: "GSIPK",
      // prefix
      prefix: "PokemonInstance#",
      // 💥 default input has to be typed
      default: ({ pokemonMasterId }: { pokemonMasterId: string }) =>
        pokemonMasterId,
      // 💥 dependencies have to be specified
      dependsOn: ["pokemonMasterId"],
    },
    byPokemonMasterIdSortKey: {
      type: "string",
      map: "GSISK",
      default: ({ captureDate }: { captureDate: string }) => captureDate,
      dependsOn: ["captureDate"],
    },
  },
  table,
} as const);
