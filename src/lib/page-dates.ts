/**
 * Which data a page shows, read from the components in its MDX source, and the
 * dates those records last changed. A page's "Reviewed" date is the most recent
 * of its own review and these dates, so a page never claims to be older than
 * the cards it displays. Pure: the dataset is passed in, so it is unit tested.
 */
import type { Dataset } from './data';

type DateSource = Pick<Dataset, 'builds' | 'changes' | 'milestones' | 'abilities' | 'facts' | 'races' | 'professions' | 'picks' | 'changelog' | 'addons'>;

/** Values of a string-array prop, e.g. ids={['a', 'b']} → ["a", "b"]. */
function arrayProp(tag: string, prop: string): string[] {
  const match = new RegExp(`${prop}=\\{\\[([^\\]]*)\\]\\}`).exec(tag);
  return match ? [...match[1]!.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]!) : [];
}

function stringProp(tag: string, prop: string): string | undefined {
  return new RegExp(`${prop}="([^"]+)"`).exec(tag)?.[1];
}

/** Every <Component …> tag of an MDX body, with its name and raw attributes. */
function tags(body: string): { name: string; tag: string }[] {
  return [...body.matchAll(/<([A-Z][A-Za-z]+)\b([^>]*)>/g)].map((m) => ({ name: m[1]!, tag: m[2]! }));
}

/** Dates (YYYY-MM-DD) of the records an MDX page shows through data components. */
export function shownDataDates(body: string, data: DateSource): string[] {
  const dates: (string | undefined)[] = [];
  const add = (list: readonly { updated?: string | undefined }[]) => dates.push(...list.map((r) => r.updated));
  for (const { name, tag } of tags(body)) {
    switch (name) {
      case 'BuildCard': {
        const id = stringProp(tag, 'id');
        add(data.builds.filter((b) => b.id === id));
        break;
      }
      case 'BuildPicker':
        add(data.builds.filter((b) => arrayProp(tag, 'ids').includes(b.id)));
        break;
      case 'BuildExplorer':
        add(data.builds);
        break;
      case 'SpecBuilds': {
        const spec = stringProp(tag, 'spec');
        add(data.builds.filter((b) => b.spec === spec));
        break;
      }
      case 'LevelingStatus':
        add(data.builds.filter((b) => b.order));
        break;
      case 'ChangeExplorer':
        add(data.changes);
        break;
      case 'ChangeSummaryList': {
        const tree = stringProp(tag, 'tree');
        add(data.changes.filter((c) => c.tree === tree));
        break;
      }
      case 'MilestoneMap': {
        const tree = stringProp(tag, 'tree');
        add(data.milestones.filter((m) => m.tree === tree));
        break;
      }
      case 'AbilityGrid':
        add(data.abilities);
        break;
      case 'FactList':
        add(data.facts.filter((f) => arrayProp(tag, 'ids').includes(f.id)));
        break;
      case 'RaceCards': {
        const faction = stringProp(tag, 'faction');
        add(data.races.filter((r) => !faction || r.faction === faction));
        break;
      }
      case 'ProfessionDetail': {
        const id = stringProp(tag, 'id');
        add(data.professions.filter((p) => p.id === id));
        break;
      }
      case 'ProfessionTable':
        add(data.professions);
        break;
      case 'ProfessionPicks':
      case 'ProfessionPairs':
        add(data.picks);
        break;
      case 'ChangelogList':
        dates.push(...data.changelog.map((e) => e.date));
        break;
      case 'AddonDetail': {
        const id = stringProp(tag, 'id');
        dates.push(...data.addons.filter((a) => a.id === id).map((a) => a.checked));
        break;
      }
    }
  }
  return dates.filter((d): d is string => d !== undefined);
}

/** The latest of a review date and a list of YYYY-MM-DD dates. */
export function latestDate(reviewed: Date, dates: readonly string[]): Date {
  let latest = reviewed;
  for (const day of dates) {
    const date = new Date(`${day}T00:00:00Z`);
    if (date > latest) latest = date;
  }
  return latest;
}
