import { marshall } from '@aws-sdk/util-dynamodb';

import { PokemonInstanceEntity } from './Entity';

describe('dynamoose - query', () => {
  it('should query items', async () => {
    const queryParams = await PokemonInstanceEntity.query({
      pokemonMasterId: '123',
    })
      .where('captureDate')
      .lt('2021')
      .using('gsi')
      .getRequest();

    expect(queryParams).toStrictEqual({
      ExpressionAttributeNames: {
        '#a0': 'GSIPK',
        '#a1': 'GSISK',
      },
      ExpressionAttributeValues: marshall({
        ':v0': '123',
        ':v1': '2021',
      }),
      IndexName: 'gsi',
      // 😱 NOT APPLIED TO KEY CONDITION EXPRESSION
      // I CAN'T FIND A WAY TO DO THIS IN DOCS
      // IT SEEMS LIKE THIS IS NOT POSSIBLE 🙈🙈🙈🙈
      FilterExpression: '#a0 = :v0 AND #a1 < :v1',
      TableName: 'PokemonMaster',
    });
  });
});
