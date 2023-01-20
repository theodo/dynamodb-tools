import MockDate from 'mockdate';

import { PokemonInstanceEntity, tableName, pokemonModel } from './Entity';

const pokemonMasterId = '123';
const pokemonInstanceId = '456';
const pokemonName = 'Pikachu';
const level = 42;
const isLegendary = false;
const captureDate = '2021-01-01T00:00:00.000Z';

const now = new Date().toISOString();
MockDate.set(now);

const pokemonInstance = {
  pokemonInstanceId,
  pokemonName,
  level,
  isLegendary,
  pokemonMasterId,
  captureDate,
};

describe('electrodb - put', () => {
  it('should put an item', () => {
    expect(PokemonInstanceEntity.put(pokemonInstance).params()).toStrictEqual({
      Item: {
        __edb_e__: pokemonModel.entity,
        __edb_v__: pokemonModel.version,
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_456',
        pokemonInstanceId,
        entityType: 'PokemonInstance',
        pokemonName,
        level,
        isLegendary,
        pokemonMasterId,
        captureDate,
        GSIPK: `PokemonInstance#${pokemonMasterId}`.toLowerCase(),
        GSISK: captureDate.toLowerCase(),
      },
      TableName: tableName,
    });
  });

  it('should add the correct condition (exists & capture date in past)', () => {
    const query = PokemonInstanceEntity.put(pokemonInstance)
      .where(
        ({ pokemonInstanceId, captureDate }, { notExists, lte }) =>
          `${notExists(pokemonInstanceId)} AND ${lte(captureDate, now)}`,
      )
      .params();
    expect(query).toMatchObject({
      ConditionExpression:
        'attribute_not_exists(#pokemonInstanceId) AND #captureDate <= :captureDate0',
      ExpressionAttributeNames: {
        '#captureDate': 'captureDate',
        '#pokemonInstanceId': 'pokemonInstanceId',
      },
      ExpressionAttributeValues: {
        ':captureDate0': now,
      },
    });
  });

  // works with maps (map attributes are typed)
  it('should add the correct map _internalMetadata', () => {
    const query = PokemonInstanceEntity.put({
      ...pokemonInstance,
      _internalMetadata: {
        myNumberAttribute: 2,
        myStringAttribute: 'coucou',
      },
    }).params();
    expect(query).toMatchObject({
      Item: {
        _internalMetadata: {
          myNumberAttribute: 2,
          myStringAttribute: 'coucou',
        },
      },
    });
  });

  // works with enums
  it('should add the correct enum types attribute', () => {
    const query = PokemonInstanceEntity.put({
      ...pokemonInstance,
      types: 'EAU',
    }).params();

    expect(query).toMatchObject({
      Item: {
        types: 'EAU',
      },
    });
  });
});
