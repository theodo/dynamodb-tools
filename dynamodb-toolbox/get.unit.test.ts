import MockDate from 'mockdate';

import { PokemonInstanceEntity } from './Entity';
import { table } from './Table';

const pokemonInstanceId = '456';

const now = new Date().toISOString();
MockDate.set(now);

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
      PokemonInstanceEntity.getParams(
        { pokemonInstanceId },
        { attributes: ['pokemonName', 'level', 'isLegendary'] },
      ),
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
