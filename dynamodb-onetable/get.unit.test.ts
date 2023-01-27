import MockDate from 'mockdate';
import { marshall } from '@aws-sdk/util-dynamodb';

import { PokemonInstanceModel } from './Entity';
import { table } from './Table';

const pokemonInstanceId = '456';

const now = new Date().toISOString();
MockDate.set(now);

const logMock = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('dynamodb-onetable - get', () => {
  beforeEach(() => {
    logMock.mockClear();
  });

  it('gets a pokemon instance from its id', () => {
    PokemonInstanceModel.get(
      {
        // 💥 Default is not provided
        entityType: 'PokemonInstance',
        pokemonInstanceId,
      },
      { execute: false, log: true },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toStrictEqual({
      Key: marshall({
        PK: 'PokemonInstance',
        SK: pokemonInstanceId,
      }),
      TableName: table.name,
      ConsistentRead: false,
    });
  });

  it('retrieves only asked attributes', () => {
    PokemonInstanceModel.get(
      {
        // 💥 Default is not provided
        entityType: 'PokemonInstance',
        pokemonInstanceId,
      },
      {
        fields: ['pokemonName', 'level', 'isLegendary'],
        execute: false,
        log: true,
      },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toMatchObject({
      ExpressionAttributeNames: {
        '#_0': 'pokemonName',
        '#_1': 'level',
        '#_2': 'isLegendary',
      },
      ProjectionExpression: '#_0, #_1, #_2',
    });
  });
});
