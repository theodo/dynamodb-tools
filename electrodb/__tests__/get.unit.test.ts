import { PokemonInstanceEntity, tableName } from '../Entity';

describe('electrodb - get', () => {
  it('should get an item on the main index', () => {
    const command = PokemonInstanceEntity.get({
      entityType: 'PokemonInstance',
      pokemonInstanceId: '456',
    });

    expect(command.params()).toStrictEqual({
      Key: {
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_456',
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
      Key: {
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_456',
      },
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
