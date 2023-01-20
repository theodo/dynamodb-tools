import { PokemonInstanceEntity } from '../Entity';

describe('electrodb - query', () => {
  it('should get an item on the global secondary index with a condition', () => {
    const command = PokemonInstanceEntity.query
      .byPokemonMasterId({
        pokemonMasterId: '456',
      })
      .where(
        (pokemon, op) =>
          `${op.eq(
            pokemon._internalMetadata.myStringAttribute, // can we do this with dynamodb-toolbox? cf. access typed map attributes
            'randomString',
          )} AND ${op.lte(pokemon.captureDate, '2021')}`,
      );

    expect(command.params()).toStrictEqual({
      ExpressionAttributeNames: {
        '#pk': 'GSIPK',
        '#_internalMetadata': '_internalMetadata',
        '#captureDate': 'captureDate',
        '#myStringAttribute': 'myStringAttribute',
      },
      ExpressionAttributeValues: {
        ':pk': 'pokemoninstance#456',
        ':captureDate0': '2021',
        ':myStringAttribute0': 'randomString',
      },
      FilterExpression:
        '#_internalMetadata.#myStringAttribute = :myStringAttribute0 AND #captureDate <= :captureDate0',
      IndexName: 'gsi',
      KeyConditionExpression: '#pk = :pk',
      TableName: 'PokemonsTable',
    });
  });
});
