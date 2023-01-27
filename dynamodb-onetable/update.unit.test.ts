import MockDate from 'mockdate';
import { marshall } from '@aws-sdk/util-dynamodb';

import { PokemonInstanceModel } from './Entity';
import { table } from './Table';

const pokemonInstanceId = '456';

const now = new Date().toISOString();
MockDate.set(now);

const logMock = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('dynamodb-onetable - update', () => {
  beforeEach(() => {
    logMock.mockClear();
  });

  it('updates a pokemon instance', () => {
    PokemonInstanceModel.upsert(
      {
        // 💥 Default is not provided
        entityType: 'PokemonInstance',
        pokemonInstanceId,
        _internalMetadata: {
          updatedAt: now,
        },
      },
      {
        add: {
          // 💥 Not typed
          level: 1,
          hobbies: ['sleeping'],
        },
        delete: {
          types: ['electric'],
        },
        execute: false,
        log: true,
      },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toStrictEqual({
      TableName: table.name,
      Key: marshall({
        PK: 'PokemonInstance',
        SK: pokemonInstanceId,
      }),
      ExpressionAttributeNames: {
        '#_0': 'level',
        '#_1': 'hobbies',
        '#_2': 'types',
        '#_3': 'created',
        '#_4': '_internalMetadata',
        '#_5': 'updatedAt',
        '#_6': '_type',
        '#_7': 'updated',
      },
      ExpressionAttributeValues: marshall({
        ':_0': 1,
        ':_1': ['sleeping'],
        ':_2': ['electric'],
        ':_3': now,
        ':_4': 'PokemonInstance',
      }),
      ReturnValues: 'ALL_NEW',
      UpdateExpression: [
        'add',
        ['#_0 :_0', '#_1 :_1'].join(', '),
        'delete',
        '#_2 :_2',
        'set',
        [
          '#_3 = if_not_exists(#_3, :_3)',
          '#_4.#_5 = :_3',
          '#_6 = :_4',
          '#_7 = :_3',
        ].join(', '),
      ].join(' '),
    });
  });

  it('updates a pokemon instance (with indexation on GSI)', () => {
    PokemonInstanceModel.upsert(
      {
        // 💥 Default is not provided
        entityType: 'PokemonInstance',
        pokemonInstanceId,
        pokemonMasterId: '123',
        captureDate: now,
      },
      { execute: false, log: true },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toMatchObject({
      ExpressionAttributeNames: {
        '#_3': 'GSIPK',
        '#_4': 'GSISK',
      },
      ExpressionAttributeValues: marshall({
        ':_0': now,
        ':_1': '123',
        ':_2': 'PokemonInstance#123',
        ':_3': 'PokemonInstance',
      }),
      UpdateExpression: expect.stringContaining('#_3 = :_2'),
    });
  });

  it('adds the correct condition (exists & capture date in past)', () => {
    PokemonInstanceModel.upsert(
      {
        // 💥 Default is not provided
        entityType: 'PokemonInstance',
        pokemonInstanceId,
        level: 34,
      },
      {
        execute: false,
        log: true,
        where:
          '(attribute_not_exists(${pokemonInstanceId})) and (${captureDate} <= @{now})',
        substitutions: {
          now,
        },
      },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toMatchObject({
      ConditionExpression: '(attribute_not_exists(#_1)) and (#_2 <= :_0)',
      ExpressionAttributeNames: {
        '#_1': 'SK',
        '#_2': 'captureDate',
      },
      ExpressionAttributeValues: marshall({
        ':_0': now,
      }),
    });
  });
});
