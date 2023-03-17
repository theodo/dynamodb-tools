import { marshall } from '@aws-sdk/util-dynamodb';
import MockDate from 'mockdate';
import dynamoose from 'dynamoose';

import { PokemonInstanceEntity } from './Entity';

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

describe('dynamoose - put', () => {
  it('should put an item', async () => {
    const queryParams = await new PokemonInstanceEntity(pokemonInstance).save({
      return: 'request',
    });

    expect(queryParams).toStrictEqual({
      Item: {
        ...marshall({
          pokemonName,
          level,
          isLegendary,
          SK: '456',
          GSIPK: '123',
          GSISK: '2021-01-01T00:00:00.000Z',
          PK: 'PokemonInstance',
        }),
      },
      TableName: 'PokemonMaster',
    });
  });

  it('should add the correct condition (exists & capture date in past)', async () => {
    const queryParams = await new PokemonInstanceEntity(pokemonInstance).save({
      return: 'request',
      condition: new dynamoose.Condition()
        .where('pokemonInstanceId')
        .not()
        .exists()
        .and()
        .where('captureDate')
        .lt(now),
    });

    expect(queryParams).toMatchObject({
      ConditionExpression: 'attribute_not_exists (#a0) AND #a1 < :v1',
      ExpressionAttributeNames: {
        '#a0': 'SK',
        '#a1': 'GSISK',
      },
      ExpressionAttributeValues: marshall({
        ':v1': now,
      }),
    });
  });
});
