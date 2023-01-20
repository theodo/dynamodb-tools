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

describe('dynamodb-toolbox - put', () => {
  it('puts a pokemon instance', () => {
    expect(PokemonInstanceEntity.putParams(pokemonInstance)).toStrictEqual({
      Item: {
        _et: PokemonInstanceEntity.name,
        _ct: now,
        _md: now,
        PK: 'PokemonInstance',
        SK: pokemonInstanceId,
        pokemonName,
        level,
        isLegendary,
        pokemonMasterId,
        captureDate,
        GSIPK: `PokemonInstance#${pokemonMasterId}`,
        GSISK: captureDate,
      },
      TableName: table.name,
    });
  });

  it('adds the correct conditions (exists & capture date in past)', () => {
    expect(
      PokemonInstanceEntity.putParams(pokemonInstance, {
        conditions: [
          {
            attr: 'pokemonInstanceId',
            exists: false,
          },
          { attr: 'captureDate', lte: now },
        ],
      }),
    ).toMatchObject({
      ConditionExpression: 'attribute_not_exists(#attr1) AND #attr2 <= :attr2',
      ExpressionAttributeNames: {
        '#attr1': 'SK',
        '#attr2': 'captureDate',
      },
      ExpressionAttributeValues: {
        ':attr2': now,
      },
    });
  });
});
