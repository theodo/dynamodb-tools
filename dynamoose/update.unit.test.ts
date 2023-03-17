import { PokemonInstanceEntity } from './Entity';

describe('dynamoose - update', () => {
  it.skip('should update an item', async () => {
    const queryParams = await PokemonInstanceEntity.update(
      {
        pokemonInstanceId: '123',
        entityType: 'PokemonInstance',
      },
      {
        $SET: {
          isLegendary: true,
        },
        $ADD: {
          level: 1,
          powers: ['blizzard'],
          hobbies: ['fishing'],
        },
      },
      // DOESN'T WORK ALTHOUGH IT'S IN THE DOCS
      { return: 'request' },
    );

    expect(queryParams).toMatchObject({
      // DOESN'T WORK ANYWAY
    });
  });
});
