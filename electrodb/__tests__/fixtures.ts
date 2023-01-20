import { pokemonModel } from '../Entity';

const pokemonMasterId = '123';
const pokemonInstanceId = '456';
const pokemonName = 'Pikachu';
const level = 42;
const isLegendary = false;
const captureDate = '2021-01-01T00:00:00.000Z';

export const pokemonInstance = {
  pokemonInstanceId,
  pokemonName,
  level,
  isLegendary,
  pokemonMasterId,
  captureDate,
};

export const pokemonIndex = {
  PK: '$pokemons#entitytype_pokemoninstance',
  SK: '$pokemonmaster_1#pokemoninstanceid_456',
};

export const pokemonSecondaryIndex = {
  GSIPK: `PokemonInstance#${pokemonMasterId}`.toLowerCase(),
  GSISK: captureDate.toLowerCase(),
};

export const pokemonIndexes = {
  ...pokemonIndex,
  ...pokemonSecondaryIndex,
};

export const __edb__ = {
  __edb_e__: pokemonModel.entity,
  __edb_v__: pokemonModel.version,
};

export const testItem = {
  ...__edb__,
  ...pokemonIndexes,
  ...pokemonInstance,
  entityType: 'PokemonInstance',
};
