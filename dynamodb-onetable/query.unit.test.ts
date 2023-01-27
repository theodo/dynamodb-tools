import { marshall } from '@aws-sdk/util-dynamodb';
import { PokemonInstanceModel } from './Entity';
import { table } from './Table';

const pokemonMasterId = '123';

const captureStartDate = '2021-01-01T00:00:00.000Z';
const captureEndDate = '2023-01-01T00:00:00.000Z';

const logMock = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('dynamodb-toolbox - query', () => {
  beforeEach(() => {
    logMock.mockClear();
  });

  it('queries pokemon instances whose ids are between a and b', () => {
    PokemonInstanceModel.find(
      {
        // 💥 Default is not provided
        entityType: 'PokemonInstance',
        pokemonInstanceId: { between: ['a', 'b'] },
      },
      {
        execute: false,
        log: true,
      },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toStrictEqual({
      ExpressionAttributeNames: {
        '#_0': 'PK',
        '#_1': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':_0': 'PokemonInstance',
        ':_1': 'a',
        ':_2': 'b',
      }),
      KeyConditionExpression: '#_0 = :_0 and #_1 BETWEEN :_1 AND :_2',
      ScanIndexForward: true,
      ConsistentRead: false,
      TableName: table.name,
    });
  });

  it('queries pokemon master pokemon instances captured between startDate end endDate', () => {
    PokemonInstanceModel.find(
      {
        // 💥 Default is not provided
        byPokemonMasterId: `PokemonInstance#${pokemonMasterId}`,
        byPokemonMasterIdSortKey: {
          between: [captureStartDate, captureEndDate],
        },
      },
      {
        index: 'gsi',
        execute: false,
        log: true,
      },
    );

    expect(logMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    const command = JSON.parse(logMock.calls[0][2]).cmd;

    expect(command).toStrictEqual({
      ExpressionAttributeNames: {
        '#_0': 'GSIPK',
        '#_1': 'GSISK',
      },
      ExpressionAttributeValues: marshall({
        ':_0': `PokemonInstance#${pokemonMasterId}`,
        ':_1': captureStartDate,
        ':_2': captureEndDate,
      }),
      IndexName: 'gsi',
      KeyConditionExpression: '#_0 = :_0 and #_1 BETWEEN :_1 AND :_2',
      ScanIndexForward: true,
      ConsistentRead: false,
      TableName: table.name,
    });
  });
});
