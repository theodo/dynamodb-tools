import { PokemonInstanceEntity } from './Entity';
import { table } from './Table';

const pokemonMasterId = '123';

const captureStartDate = '2021-01-01T00:00:00.000Z';
const captureEndDate = '2023-01-01T00:00:00.000Z';

describe('dynamodb-toolbox - query', () => {
  it('queries pokemon instances whose ids are between a and b', () => {
    expect(
      table.queryParams(PokemonInstanceEntity.name, {
        between: ['a', 'b'],
      }),
    ).toStrictEqual({
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':pk': PokemonInstanceEntity.name,
        ':sk0': 'a',
        ':sk1': 'b',
      },
      KeyConditionExpression: '#pk = :pk and #sk between :sk0 and :sk1',
      TableName: table.name,
    });
  });

  it('queries pokemon master pokemon instances captured between startDate end endDate', () => {
    expect(
      table.queryParams(`PokemonInstance#${pokemonMasterId}`, {
        index: 'GSI',
        between: [captureStartDate, captureEndDate],
      }),
    ).toStrictEqual({
      ExpressionAttributeNames: {
        '#pk': 'GSIPK',
        '#sk': 'GSISK',
      },
      ExpressionAttributeValues: {
        ':pk': `PokemonInstance#${pokemonMasterId}`,
        ':sk0': captureStartDate,
        ':sk1': captureEndDate,
      },
      IndexName: 'GSI',
      KeyConditionExpression: '#pk = :pk and #sk between :sk0 and :sk1',
      TableName: table.name,
    });
  });
});
