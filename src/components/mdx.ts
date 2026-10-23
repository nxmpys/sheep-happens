/**
 * Components available inside every MDX page without importing them.
 * Editors write <ChangeExplorer />, <Pending why="…" />, etc. directly.
 */
import AbilityGrid from './guide/AbilityGrid.astro';
import AboutStory from './about/AboutStory.astro';
import AboutLinks from './guide/AboutLinks.astro';
import AddonDetail from './guide/AddonDetail.astro';
import AddonLink from './guide/AddonLink.astro';
import BuildCard from './guide/BuildCard.astro';
import BuildExplorer from './guide/BuildExplorer.astro';
import BuildPicker from './guide/BuildPicker.astro';
import Callout from './guide/Callout.astro';
import CampBuffs from './guide/CampBuffs.astro';
import ChangeExplorer from './guide/ChangeExplorer.astro';
import ChangeSummaryList from './guide/ChangeSummaryList.astro';
import ChangelogList from './guide/ChangelogList.astro';
import ClassQuestList from './guide/ClassQuestList.astro';
import CritCalculator from './guide/CritCalculator.astro';
import HitCalculator from './guide/HitCalculator.astro';
import FactList from './guide/FactList.astro';
import FactionFilter from './guide/FactionFilter.astro';
import Faq from './guide/Faq.astro';
import Glossary from './guide/Glossary.astro';
import FaqItem from './guide/FaqItem.astro';
import Highlight from './guide/Highlight.astro';
import Highlights from './guide/Highlights.astro';
import HubCards from './guide/HubCards.astro';
import ItemCards from './guide/ItemCards.astro';
import LevelView from './guide/LevelView.astro';
import LevelingSpells from './guide/LevelingSpells.astro';
import LegacyBuildCard from './guide/LegacyBuildCard.astro';
import LegacyPerks from './guide/LegacyPerks.astro';
import LevelingStatus from './guide/LevelingStatus.astro';
import LibraryBooks from './guide/LibraryBooks.astro';
import MilestoneMap from './guide/MilestoneMap.astro';
import Notices from './guide/Notices.astro';
import PageLink from './guide/PageLink.astro';
import Pending from './guide/Pending.astro';
import Priority from './guide/Priority.astro';
import ProfessionDetail from './guide/ProfessionDetail.astro';
import ProfessionPairs from './guide/ProfessionPairs.astro';
import ProfessionPicks from './guide/ProfessionPicks.astro';
import ProfessionTable from './guide/ProfessionTable.astro';
import QuestionCards from './guide/QuestionCards.astro';
import RaceCards from './guide/RaceCards.astro';
import RacePicks from './guide/RacePicks.astro';
import ScrollGuide from './guide/ScrollGuide.astro';
import SourceRefs from './guide/SourceRefs.astro';
import SourcesTable from './guide/SourcesTable.astro';
import SpecCards from './guide/SpecCards.astro';
import SpellStrong from './guide/SpellStrong.astro';
import StatusBadge from './guide/StatusBadge.astro';
import StatusLegend from './guide/StatusLegend.astro';
import TalentCalculator from './guide/TalentCalculator.astro';
import WatchList from './guide/WatchList.astro';
import Table from './ui/Table.astro';
import WeeklyChanges from './guide/WeeklyChanges.astro';

export const mdxComponents = {
  table: Table,
  // Bold spell names become tooltip triggers (see SpellStrong.astro).
  strong: SpellStrong,
  AbilityGrid,
  AboutStory,
  AboutLinks,
  AddonDetail,
  AddonLink,
  BuildCard,
  BuildExplorer,
  BuildPicker,
  Callout,
  CampBuffs,
  ChangeExplorer,
  ChangeSummaryList,
  ChangelogList,
  ClassQuestList,
  CritCalculator,
  HitCalculator,
  FactList,
  FactionFilter,
  Faq,
  FaqItem,
  Glossary,
  Highlight,
  Highlights,
  HubCards,
  ItemCards,
  LevelView,
  LevelingSpells,
  LegacyBuildCard,
  LegacyPerks,
  LevelingStatus,
  LibraryBooks,
  MilestoneMap,
  Notices,
  PageLink,
  Pending,
  Priority,
  ProfessionDetail,
  ProfessionPairs,
  ProfessionPicks,
  ProfessionTable,
  QuestionCards,
  RaceCards,
  RacePicks,
  ScrollGuide,
  SourceRefs,
  SourcesTable,
  SpecCards,
  Status: StatusBadge,
  StatusLegend,
  TalentCalculator,
  WatchList,
  WeeklyChanges,
};
