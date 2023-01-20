import MockDate from 'mockdate';

import { PokemonInstanceEntity } from './Entity';
import { table } from './Table';

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

describe('dynamodb-toolbox - get', () => {
  it('gets a pokemon instance from its id', () => {
    expect(
      PokemonInstanceEntity.getParams({ pokemonInstanceId }),
    ).toStrictEqual({
      Key: {
        PK: 'PokemonInstance',
        SK: pokemonInstanceId,
      },
      TableName: table.name,
    });
  });

  it('retrieves only asked attributes', () => {
    expect(
      PokemonInstanceEntity.getParams(pokemonInstance, {
        attributes: ['pokemonName', 'level', 'isLegendary'],
      }),
    ).toMatchObject({
      ExpressionAttributeNames: {
        '#proj1': 'pokemonName',
        '#proj2': 'level',
        '#proj3': 'isLegendary',
      },
      ProjectionExpression: '#proj1,#proj2,#proj3',
    });
  });
});
