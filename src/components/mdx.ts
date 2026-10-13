/**
 * Components available inside every MDX page without importing them.
 * Editors write <ChangeExplorer />, <Pending why="…" />, etc. directly.
 */
import AbilityGrid from './guide/AbilityGrid.astro';
import BuildCard from './guide/BuildCard.astro';
import BuildExplorer from './guide/BuildExplorer.astro';
import Callout from './guide/Callout.astro';
import ChangeExplorer from './guide/ChangeExplorer.astro';
import ChangelogList from './guide/ChangelogList.astro';
import CritCalculator from './guide/CritCalculator.astro';
import FactList from './guide/FactList.astro';
import Faq from './guide/Faq.astro';
import FaqItem from './guide/FaqItem.astro';
import Highlight from './guide/Highlight.astro';
import Highlights from './guide/Highlights.astro';
import MilestoneMap from './guide/MilestoneMap.astro';
import PageLink from './guide/PageLink.astro';
import Pending from './guide/Pending.astro';
import Priority from './guide/Priority.astro';
import QuestionCards from './guide/QuestionCards.astro';
import RaceCards from './guide/RaceCards.astro';
import SourceRefs from './guide/SourceRefs.astro';
import SourcesTable from './guide/SourcesTable.astro';
import SpecCards from './guide/SpecCards.astro';
import SpellStrong from './guide/SpellStrong.astro';
import StatusBadge from './guide/StatusBadge.astro';
import StatusLegend from './guide/StatusLegend.astro';
import TalentExplorer from './guide/TalentExplorer.astro';
import WatchList from './guide/WatchList.astro';
import Table from './ui/Table.astro';

export const mdxComponents = {
  table: Table,
  // Bold spell names become tooltip triggers (see SpellStrong.astro).
  strong: SpellStrong,
  AbilityGrid,
  BuildCard,
  BuildExplorer,
  Callout,
  ChangeExplorer,
  ChangelogList,
  CritCalculator,
  FactList,
  Faq,
  FaqItem,
  Highlight,
  Highlights,
  MilestoneMap,
  PageLink,
  Pending,
  Priority,
  QuestionCards,
  RaceCards,
  SourceRefs,
  SourcesTable,
  SpecCards,
  Status: StatusBadge,
  StatusLegend,
  TalentExplorer,
  WatchList,
};
