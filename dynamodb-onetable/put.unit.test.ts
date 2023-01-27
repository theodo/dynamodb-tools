import MockDate from 'mockdate';
import { marshall } from '@aws-sdk/util-dynamodb';

import { PokemonInstanceModel } from './Entity';

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

const logMock = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('dynamodb-onetable - put', () => {
  beforeEach(() => {
    logMock.mockClear();
  });

  it('puts a pokemon instance', () => {
    PokemonInstanceModel.create(pokemonInstance, {
      execute: false,
      log: true,
    });

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toStrictEqual({
      ConditionExpression:
        '(attribute_not_exists(#_0)) and (attribute_not_exists(#_1))',
      ExpressionAttributeNames: {
        '#_0': 'PK',
        '#_1': 'SK',
      },
      Item: marshall({
        // ✨ entity name
        _type: 'PokemonInstance',
        // ✨ timestamps
        created: now,
        updated: now,
        // ✨ expected item
        PK: 'PokemonInstance',
        SK: pokemonInstanceId,
        pokemonName,
        level,
        isLegendary,
        pokemonMasterId,
        captureDate,
        // ✨ expected mappings
        GSIPK: `PokemonInstance#${pokemonMasterId}`,
        GSISK: captureDate,
      }),
      ReturnValues: 'NONE',
      TableName: 'PokemonsTable',
    });
  });

  it('adds the correct conditions (exists & capture date in past)', () => {
    PokemonInstanceModel.create(pokemonInstance, {
      execute: false,
      log: true,
      where:
        '(attribute_not_exists(${pokemonInstanceId})) and (${captureDate} <= @{now})',
      substitutions: {
        now,
      },
    });

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toMatchObject({
      ConditionExpression:
        '(attribute_not_exists(#_0)) and (attribute_not_exists(#_1)) and ((attribute_not_exists(#_1)) and (#_2 <= :_0))',
      ExpressionAttributeNames: {
        '#_0': 'PK',
        '#_1': 'SK',
        '#_2': 'captureDate',
      },
      ExpressionAttributeValues: {
        ':_0': marshall(now),
      },
    });
  });
});
