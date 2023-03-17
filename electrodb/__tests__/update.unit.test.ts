import MockDate from 'mockdate';

import { PokemonInstanceEntity, tableName } from '../Entity';

const now = new Date().toISOString();
MockDate.set(now);

describe('electrodb - update', () => {
  it('should update an item', () => {
    const command = PokemonInstanceEntity.update({
      pokemonInstanceId: '123',
      entityType: 'PokemonInstance',
    })
      .add({ level: 1, powers: ['blizzard'] })
      .append({ hobbies: ['fishing'] })
      .set({ isLegendary: true });

    expect(command.params()).toMatchObject({
      ExpressionAttributeNames: {
        '#__edb_e__': '__edb_e__',
        '#__edb_v__': '__edb_v__',
        '#entityType': 'entityType',
        '#hobbies': 'hobbies',
        '#isLegendary': 'isLegendary',
        '#level': 'level',
        '#pokemonInstanceId': 'pokemonInstanceId',
        '#powers': 'powers',
      },
      ExpressionAttributeValues: {
        ':__edb_e___u0': 'PokemonMaster',
        ':__edb_v___u0': '1',
        ':entityType_u0': 'PokemonInstance',
        ':hobbies_u0': ['fishing'],
        ':isLegendary_u0': true,
        ':level_u0': 1,
        ':pokemonInstanceId_u0': '123',
        ':powers_u0': new Set([
          {
            wrapperName: 'Set',
            values: ['blizzard'],
            type: 'String',
          },
        ]),
      },
      Key: {
        PK: '$pokemons#entitytype_pokemoninstance',
        SK: '$pokemonmaster_1#pokemoninstanceid_123',
      },
      TableName: tableName,
      UpdateExpression: [
        'SET #hobbies = list_append(#hobbies, :hobbies_u0), ',
        '#isLegendary = :isLegendary_u0, ',
        '#entityType = :entityType_u0, ',
        '#pokemonInstanceId = :pokemonInstanceId_u0, ',
        '#__edb_e__ = :__edb_e___u0, ',
        '#__edb_v__ = :__edb_v___u0 ',
        'ADD #level :level_u0, ',
        '#powers :powers_u0',
      ].join(''),
    });
  });
});
