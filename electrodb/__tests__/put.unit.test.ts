import MockDate from 'mockdate';

import { PokemonInstanceEntity, tableName } from '../Entity';
import { pokemonInstance, testItem, __edb__ } from './fixtures';

const now = new Date().toISOString();
MockDate.set(now);

describe('electrodb - put', () => {
  it('should put an item', () => {
    const command = PokemonInstanceEntity.put(pokemonInstance);

    expect(command.params()).toStrictEqual({
      Item: testItem,
      TableName: tableName,
    });
  });

  it('should add the correct condition (exists & capture date in past)', () => {
    const command = PokemonInstanceEntity.put(pokemonInstance).where(
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
      ...pokemonInstance,
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
      ...pokemonInstance,
      elementFamily: 'EAU',
      powers: ['blizzard', 'morsure'],
    });

    expect(command.params()).toStrictEqual({
      Item: {
        ...testItem,
        elementFamily: 'EAU',
        powers: expect.objectContaining({ values: ['blizzard', 'morsure'] }),
      },
      TableName: tableName,
    });
  });
});
