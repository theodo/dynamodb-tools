import MockDate from 'mockdate';

import { PokemonInstanceEntity, tableName, pokemonModel } from '../Entity';

const now = new Date().toISOString();
MockDate.set(now);

describe('electrodb - put', () => {
  it('should put an item', () => {
    const command = PokemonInstanceEntity.put({
      pokemonMasterId: '123',
      pokemonInstanceId: '456',
      pokemonName: 'Pikachu',
      level: 42,
      isLegendary: false,
      captureDate: '2021-01-01T00:00:00.000Z',
    });

    expect(command.params()).toStrictEqual({
      Item: {
        __edb_e__: pokemonModel.entity,
        __edb_v__: pokemonModel.version,
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_456',
        GSIPK: `PokemonInstance#123`.toLowerCase(),
        GSISK: '2021-01-01T00:00:00.000Z'.toLowerCase(),
        entityType: 'PokemonInstance',
        pokemonInstanceId: '456',
        pokemonName: 'Pikachu',
        level: 42,
        isLegendary: false,
        pokemonMasterId: '123',
        captureDate: '2021-01-01T00:00:00.000Z',
      },
      TableName: tableName,
    });
  });

  it('should add the correct condition (exists & capture date in past)', () => {
    const command = PokemonInstanceEntity.put({
      pokemonMasterId: '123',
      pokemonInstanceId: '456',
      pokemonName: 'Pikachu',
      level: 42,
      isLegendary: false,
      captureDate: '2021-01-01T00:00:00.000Z',
    }).where(
      ({ pokemonInstanceId, captureDate }, { notExists, lte }) =>
        `${notExists(pokemonInstanceId)} AND ${lte(captureDate, now)}`,
    );

    expect(command.params()).toMatchObject({
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
    const command = PokemonInstanceEntity.put({
      pokemonMasterId: '123',
      pokemonInstanceId: '456',
      pokemonName: 'Pikachu',
      level: 42,
      isLegendary: false,
      captureDate: '2021-01-01T00:00:00.000Z',
      _internalMetadata: {
        myNumberAttribute: 2,
        myStringAttribute: 'coucou',
      },
    });

    expect(command.params()).toMatchObject({
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
    const command = PokemonInstanceEntity.put({
      pokemonMasterId: '123',
      pokemonInstanceId: '456',
      pokemonName: 'Pikachu',
      level: 42,
      isLegendary: false,
      captureDate: '2021-01-01T00:00:00.000Z',
      elementFamily: 'EAU',
      powers: ['blizzard', 'morsure'],
    });

    expect(command.params()).toStrictEqual({
      Item: {
        __edb_e__: pokemonModel.entity,
        __edb_v__: pokemonModel.version,
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_456',
        GSIPK: `PokemonInstance#123`.toLowerCase(),
        GSISK: '2021-01-01T00:00:00.000Z'.toLowerCase(),
        entityType: 'PokemonInstance',
        pokemonMasterId: '123',
        pokemonInstanceId: '456',
        pokemonName: 'Pikachu',
        level: 42,
        isLegendary: false,
        captureDate: '2021-01-01T00:00:00.000Z',
        elementFamily: 'EAU',
        powers: expect.objectContaining({ values: ['blizzard', 'morsure'] }),
      },
      TableName: tableName,
    });
  });
});
