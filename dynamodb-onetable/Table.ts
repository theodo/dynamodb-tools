import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Dynamo } from 'dynamodb-onetable/Dynamo';
import { Table } from 'dynamodb-onetable';

const client = new Dynamo({ client: new DynamoDBClient({}) });

export const table = new Table({
  client: client,
  name: 'PokemonsTable',
  schema: {
    format: 'onetable:1.1.0',
    version: '0.0.1',
    indexes: {
      primary: { hash: 'PK', sort: 'SK' },
      gsi: { hash: 'GSIPK', sort: 'GSISK' },
    },
    models: {
      PokemonMaster: {
        entityType: {
          type: String,
          // ✨ Hard default
          default: 'PokemonMaster',
          // ✨ Mapping
          map: 'PK',
          // ✨ hidden feature
          hidden: true,
        },
        pokemonMasterId: {
          type: String,
          map: 'SK',
        },
      },
      PokemonInstance: {
        entityType: {
          type: String,
          default: 'PokemonInstance',
          map: 'PK',
          hidden: true,
        },
        pokemonInstanceId: {
          type: String,
          map: 'SK',
        },

        // ✨ string
        pokemonName: { type: String, required: true },

        // ✨ number
        level: { type: Number, required: true },

        // ✨ boolean
        isLegendary: { type: Boolean, required: true },

        // ✨ set (💥 impossible to specify set elements types)
        types: { type: Set },

        // ✨ list of strings
        hobbies: { type: Array, items: { type: String } },

        // ✨ map
        _internalMetadata: {
          type: Object,
          schema: {
            _traceId: { type: String, required: true },
          },
        },

        pokemonMasterId: { type: String, required: true },
        captureDate: { type: String, required: true },

        // Mapped GSI
        byPokemonMasterId: {
          type: String,
          map: 'GSIPK',
          // ✨ prefix OK-ish 💥 default is not typed
          value: 'PokemonInstance#${pokemonMasterId}',
        },
        byPokemonMasterIdSortKey: {
          type: String,
          map: 'GSISK',
          value: '${captureDate}',
        },
      },
    },
    params: {
      isoDates: true,
      timestamps: true,
    },
  } as const,
  partial: true,
  logger: true,
});
