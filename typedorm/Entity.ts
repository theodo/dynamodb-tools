import { Attribute, Entity } from '@typedorm/common';

@Entity({
  name: 'PokemonMaster',
  primaryKey: {
    // we can also use template syntax 'ORG#{{id}}#STATUS#{{status}}'
    partitionKey: '{{entityType}}',
    sortKey: '{{pokemonInstanceId}}',
  },
})
export class PokemonMaster {
  @Attribute({
    default: 'PokemonMaster',
    // ✨ hidden feature
    hidden: true,
  })
  entityType: string;

  @Attribute()
  pokemonMasterId: string;
}

@Entity({
  name: 'PokemonInstance',
  primaryKey: {
    // we can also use template syntax 'ORG#{{id}}#STATUS#{{status}}'
    partitionKey: '{{entityType}}',
    sortKey: '{{pokemonInstanceId}}',
    // cannot specify default value
  },
})
export class PokemonInstanceEntity {
  @Attribute()
  entityType: string;

  @Attribute()
  pokemonInstanceId: string;

  // ✨ string
  @Attribute()
  pokemonName!: string;

  // ✨ number
  @Attribute()
  level: number;

  // ✨ boolean
  @Attribute()
  isLegendary: boolean;

  @Attribute()
  types: string[];

  // ✨ list of strings
  @Attribute()
  hobbies: string[];

  // ✨ map
  @Attribute()
  _internalMetadata: Map<any, any>;

  @Attribute()
  pokemonMasterId!: string;

  @Attribute()
  captureDate!: string;

  // cannot add map
  @Attribute({
    default: ({ pokemonMasterId }) => pokemonMasterId,
    //💥 dependency cannot be specified
  })
  byPokemonMasterId: string;

  @Attribute({
    default: ({ captureDate }) => captureDate,
  })
  byPokemonMasterIdSortKey: string;
}
