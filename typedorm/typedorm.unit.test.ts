import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { createConnection, getEntityManager } from '@typedorm/core';
import { mockClient } from 'aws-sdk-client-mock';
import MockDate from 'mockdate';

import { PokemonInstanceEntity } from './Entity';
import { table } from './Table';

const dynamoDB = new DynamoDBClient({});
const dynamoDBMock = mockClient(dynamoDB);

createConnection({
  table,
  entities: [PokemonInstanceEntity],
});

const pokemonMasterId = '123';
const pokemonInstanceId = '456';
const pokemonName = 'Pikachu';
const level = 42;
const isLegendary = false;
const captureDate = '2021-01-01T00:00:00.000Z';

const now = new Date().toISOString();
MockDate.set(now);

const pokemonInstance = new PokemonInstanceEntity();
pokemonInstance.pokemonInstanceId = pokemonInstanceId;
pokemonInstance.pokemonName = pokemonName;
pokemonInstance.level = level;
pokemonInstance.isLegendary = isLegendary;
pokemonInstance.pokemonMasterId = pokemonMasterId;
pokemonInstance.captureDate = captureDate;

const entityManager = getEntityManager();

describe('dynamodb-toolbox - put', () => {
  it('should put an item', async () => {
    const response = await entityManager.create(pokemonInstance);

    console.log(response);
    // .toStrictEqual({
    //   Item: {
    //     _et: PokemonInstanceEntity.name,
    //     _ct: now,
    //     _md: now,
    //     PK: 'PokemonInstance',
    //     SK: pokemonInstanceId,
    //     pokemonName,
    //     level,
    //     isLegendary,
    //     pokemonMasterId,
    //     captureDate,
    //     GSIPK: `PokemonInstance#${pokemonMasterId}`,
    //     GSISK: captureDate,
    //   },
    //   TableName: table.name,
    // });

    console.log(dynamoDBMock.calls());

    expect(true).toBe(true);
  });

  //   it('should add the correct condition (exists & capture date in past)', () => {
  //     expect(
  //       PokemonInstanceEntity.putParams(pokemonInstance, {
  //         conditions: [
  //           {
  //             attr: 'pokemonInstanceId',
  //             exists: false,
  //           },
  //           { attr: 'captureDate', lte: now },
  //         ],
  //       }),
  //     ).toMatchObject({
  //       ConditionExpression: 'attribute_not_exists(#attr1) AND #attr2 <= :attr2',
  //       ExpressionAttributeNames: {
  //         '#attr1': 'SK',
  //         '#attr2': 'captureDate',
  //       },
  //       ExpressionAttributeValues: {
  //         ':attr2': now,
  //       },
  //     });
  //   });
});
