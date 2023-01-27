import { PokemonInstanceEntity, tableName } from '../Entity';
import { pokemonIndex, __edb__ } from './fixtures';

describe('electrodb - get', () => {
  it('should get an item on the main index', () => {
    const command = PokemonInstanceEntity.get({
      entityType: 'PokemonInstance',
      pokemonInstanceId: '456',
    });

    expect(command.params()).toStrictEqual({
      Key: {
        ...pokemonIndex,
      },
      TableName: tableName,
    });
  });

  it('should add the correct projection expression (exists & capture date in past)', () => {
    const command = PokemonInstanceEntity.get({
      entityType: 'PokemonInstance',
      pokemonInstanceId: '456',
    });

    expect(
      command.params({ attributes: ['pokemonName', 'level', 'isLegendary'] }),
    ).toStrictEqual({
      Key: pokemonIndex,
      ExpressionAttributeNames: {
        '#isLegendary': 'isLegendary',
        '#level': 'level',
        '#pokemonName': 'pokemonName',
      },
      ProjectionExpression: '#pokemonName, #level, #isLegendary',
      TableName: tableName,
    });
  });
});
