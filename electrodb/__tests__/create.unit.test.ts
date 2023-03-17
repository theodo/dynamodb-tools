import { pokemonModel, PokemonInstanceEntity, tableName } from '../Entity';

describe('electrodb - create', () => {
  it('should create an item', () => {
    const command = PokemonInstanceEntity.create({
      pokemonInstanceId: '123',
      pokemonName: 'Pikachu',
      level: 42,
      isLegendary: false,
      pokemonMasterId: '123',
      captureDate: '2021-01-01T00:00:00.000Z',
    });

    expect(command.params()).toStrictEqual({
      ConditionExpression:
        'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      Item: {
        __edb_e__: pokemonModel.entity,
        __edb_v__: pokemonModel.version,
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_123',
        GSIPK: `PokemonInstance#123`.toLowerCase(),
        GSISK: '2021-01-01T00:00:00.000Z'.toLowerCase(),
        entityType: 'PokemonInstance',
        pokemonInstanceId: '123',
        pokemonName: 'Pikachu',
        level: 42,
        isLegendary: false,
        pokemonMasterId: '123',
        captureDate: '2021-01-01T00:00:00.000Z',
      },
      TableName: tableName,
    });
  });
});
