/**
 * A complete 1-60 leveling build for tests that need one (point order,
 * variants, routes, roles). It is the Frostfire solo build as published until
 * 29 October 2026, which is still valid on the 28 October talent tree. Tests
 * must not rely on src/data/builds.json: builds come and go with the game.
 */
import { dataset, type Dataset } from '../../src/lib/data';
import { buildSchema, type Build } from '../../src/lib/schemas';
import raw from './frost-leveling-solo.json';

export const fixtureBuild: Build = buildSchema.parse(raw);

/** A copy of the shipped data with the fixture build added. */
export function datasetWithFixture(): Dataset {
  const data = structuredClone(dataset);
  data.builds.push(structuredClone(fixtureBuild));
  return data;
}
