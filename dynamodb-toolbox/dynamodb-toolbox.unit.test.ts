import MockDate from "mockdate";

import { PokemonInstanceEntity } from "./Entity";
import { table } from "./Table";

const pokemonMasterId = "123";
const pokemonInstanceId = "456";
const pokemonName = "Pikachu";
const level = 42;
const isLegendary = false;
const captureDate = "2021-01-01T00:00:00.000Z";

const now = new Date().toISOString();
MockDate.set(now);

describe("dynamodb-toolbox - put", () => {
  it("should put an item", () => {
    expect(
      PokemonInstanceEntity.putParams({
        pokemonInstanceId,
        pokemonName,
        level,
        isLegendary,
        pokemonMasterId,
        captureDate,
      })
    ).toStrictEqual({
      Item: {
        _et: PokemonInstanceEntity.name,
        _ct: now,
        _md: now,
        PK: "PokemonInstance",
        SK: pokemonInstanceId,
        pokemonName,
        level,
        isLegendary,
        pokemonMasterId,
        captureDate,
        GSIPK: `PokemonInstance#${pokemonMasterId}`,
        GSISK: captureDate,
      },
      TableName: table.name,
    });
  });
});
