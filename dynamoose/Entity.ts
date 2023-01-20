import dynamoose from 'dynamoose';

export const PokemonInstanceEntity = dynamoose.model(
  'PokemonMaster',
  new dynamoose.Schema({
    PK: {
      type: String,
      // or default: () =>  "PokemonInstance" but doesn't receive our object
      // the input is not type so I can set default to 123 even if type is specified as String
      default: 'PokemonInstance',
      // partition key
      hashKey: true,
      alias: 'entityType',
    },

    SK: {
      type: String,
      rangeKey: true,
      alias: 'pokemonInstanceId',
    },

    // ✨ string
    pokemonName: { type: String, required: true },

    // ✨ number
    level: { type: Number, required: true },

    // ✨ boolean
    isLegendary: { type: Boolean, required: true },

    // ✨ string set
    types: { type: Object },

    // ✨ list of strings (💥 impossible to set list elements types)
    hobbies: { type: Array },

    // ✨ map (💥 impossible to specify map attributes types)
    _internalMetadata: { type: Object },

    // Mapped GSI
    GSIPK: {
      type: String,
      alias: 'pokemonMasterId',
      required: true,
      // defaultMap: 'GSIPK',
    },

    GSISK: {
      // map is not working
      type: String,
      alias: 'captureDate',
    },
  }),
);

// console.log({ PokemonInstanceEntity });
