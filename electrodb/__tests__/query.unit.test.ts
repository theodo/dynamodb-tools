import { PokemonInstanceEntity } from '../Entity';

describe('electrodb - query', () => {
  it('should get an item on the global secondary index with a filter', () => {
    const command = PokemonInstanceEntity.query
      .byPokemonMasterId({ pokemonMasterId: '456' })
      .lt({ captureDate: '2021' })
      .where((pokemon, { eq }) =>
        eq(pokemon._internalMetadata.myStringAttribute, 'randomString'),
      );

    expect(command.params()).toStrictEqual({
      ExpressionAttributeNames: {
        '#pk': 'GSIPK',
        '#sk1': 'GSISK',
        '#_internalMetadata': '_internalMetadata',
        '#myStringAttribute': 'myStringAttribute',
      },
      ExpressionAttributeValues: {
        ':pk': 'pokemoninstance#456',
        ':myStringAttribute0': 'randomString',
        ':sk1': '2021',
      },
      FilterExpression:
        '#_internalMetadata.#myStringAttribute = :myStringAttribute0',
      IndexName: 'gsi',
      KeyConditionExpression: '#pk = :pk and #sk1 < :sk1',
      TableName: 'PokemonsTable',
    });
  });

  it('should get an item on the global secondary index with a filter expression', () => {
    const command = PokemonInstanceEntity.query
      .byPokemonMasterId({ pokemonMasterId: '456' })
      .where(
        (pokemon, { eq, lte }) =>
          `${eq(
            pokemon._internalMetadata.myStringAttribute, // can we do this with dynamodb-toolbox? cf. access typed map attributes
            'randomString',
          )} AND ${lte(pokemon.captureDate, '2021')}`,
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
