import { PokemonInstanceEntity, tableName } from '../Entity';
import { pokemonInstance, testItem } from './fixtures';

describe('electrodb - create', () => {
  it('should create an item', () => {
    const command = PokemonInstanceEntity.create(pokemonInstance);

    expect(command.params()).toStrictEqual({
      ConditionExpression:
        'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      Item: testItem,
      TableName: tableName,
    });
  });
});
