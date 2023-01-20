import MockDate from 'mockdate';

import { PokemonInstanceEntity } from './Entity';
import { table } from './Table';

const pokemonInstanceId = '456';

const now = new Date().toISOString();
MockDate.set(now);

describe('dynamodb-toolbox - update', () => {
  it('updates a pokemon instance', () => {
    expect(
      PokemonInstanceEntity.updateParams({
        pokemonInstanceId,
        level: { $add: 1 },
        types: { $delete: ['electric'] },
        hobbies: { $append: ['sleeping'] },
        _internalMetadata: {
          updatedAt: now,
        },
      }),
    ).toStrictEqual({
      TableName: table.name,
      Key: {
        PK: 'PokemonInstance',
        SK: pokemonInstanceId,
      },
      ExpressionAttributeNames: {
        '#GSIPK': 'GSIPK',
        '#_ct': '_ct',
        '#_et': '_et',
        '#_internalMetadata': '_internalMetadata',
        '#_md': '_md',
        '#hobbies': 'hobbies',
        '#level': 'level',
        '#types': 'types',
      },
      ExpressionAttributeValues: {
        ':GSIPK': 'PokemonInstance#undefined',
        ':_ct': now,
        ':_et': 'PokemonInstance',
        ':_internalMetadata': {
          updatedAt: now,
        },
        ':_ld': [],
        ':_md': now,
        ':hobbies': ['sleeping'],
        ':level': 1,
        ':types': expect.objectContaining({ values: ['electric'] }),
      },
      UpdateExpression: [
        [
          'SET #GSIPK = if_not_exists(#GSIPK,:GSIPK)',
          '#_ct = if_not_exists(#_ct,:_ct)',
          '#_md = :_md',
          '#_et = if_not_exists(#_et,:_et)',
          '#hobbies = list_append(if_not_exists(#hobbies, :_ld) ,:hobbies)',
          '#_internalMetadata = :_internalMetadata',
        ].join(', '),
        'ADD #level :level',
        'DELETE #types :types',
      ].join(' '),
    });
  });

  it('updates a pokemon instance (with indexation on GSI)', () => {
    expect(
      PokemonInstanceEntity.updateParams({
        pokemonInstanceId,
        pokemonMasterId: '123',
        captureDate: now,
      }),
    ).toMatchObject({
      ExpressionAttributeNames: {
        '#GSIPK': 'GSIPK',
        '#GSISK': 'GSISK',
      },
      ExpressionAttributeValues: {
        ':GSIPK': 'PokemonInstance#123',
        ':captureDate': now,
      },
    });
  });

  it('adds the correct condition (exists & capture date in past)', () => {
    expect(
      PokemonInstanceEntity.updateParams(
        { pokemonInstanceId, level: 34 },
        {
          conditions: [
            {
              attr: 'pokemonInstanceId',
              exists: false,
            },
            { attr: 'captureDate', lte: now },
          ],
        },
      ),
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
