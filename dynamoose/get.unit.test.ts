import { marshall } from '@aws-sdk/util-dynamodb';

import { PokemonInstanceEntity } from './Entity';

describe('dynamoose - get', () => {
  it('should get an item', async () => {
    const queryParams = await PokemonInstanceEntity.get(
      { entityType: 'PokemonInstance', pokemonInstanceId: '456' },
      { return: 'request' },
    );

    expect(queryParams).toStrictEqual({
      Key: {
        ...marshall({
          PK: 'PokemonInstance',
          SK: '456',
        }),
      },
      TableName: 'PokemonMaster',
    });
  });
});
