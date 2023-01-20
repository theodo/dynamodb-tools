import { INDEX_TYPE, Table } from '@typedorm/common';

export const table = new Table({
  name: 'PokemonsTable',
  partitionKey: 'PK',
  sortKey: 'SK',
  indexes: {
    GSI: { partitionKey: 'GSIPK', sortKey: 'GSISK', type: INDEX_TYPE.GSI },
  },
});
