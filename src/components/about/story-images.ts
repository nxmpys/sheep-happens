/**
 * The pictures of the about page story, one per scene: official World of
 * Warcraft art, screenshots and live wallpapers the author picked for each
 * moment (originals in img/, served from public/about/story/). An entry
 * with an empty `src` falls back to the drawn placeholder in StoryArt.astro.
 *
 * To change a picture: optimise it to .webp (≤1920 px wide), drop it in
 * public/about/story/, then set `src`, its real `width`/`height` and the
 * `focus` the crop should keep. A live wallpaper also sets `video`: a muted
 * .mp4 (H.264, 720p, 30 fps, no audio, faststart) whose first frame is the
 * `src` poster. No hotlinks and no AI images.
 */
export type StoryArtName =
  | 'pandaria'
  | 'warlock'
  | 'hunter'
  | 'bfa'
  | 'shadowlands'
  | 'dragonflight'
  | 'tbc'
  | 'mage'
  | 'forever'
  | 'grimoire';

/** The decorative frame drawn over a picture (StoryFrame.astro), chosen by what the picture shows. */
export type FrameStyle = 'pandaria' | 'fel' | 'loa' | 'shadow' | 'dragon' | 'fire' | 'arcane' | 'felrune' | 'classic';

/** Each frame's colours: main line, second line, glow. Captions take the main one. */
export const FRAME_COLORS: Record<FrameStyle, { a: string; b: string; glow: string }> = {
  pandaria: { a: '#e5c97f', b: '#6fc79a', glow: '#000000' },
  fel: { a: '#9dff6a', b: '#4fd12a', glow: '#7cff3a' },
  loa: { a: '#ece6d6', b: '#6fd3ff', glow: '#4fb8ff' },
  shadow: { a: '#cfd8e8', b: '#ff9a4a', glow: '#ff7a2a' },
  dragon: { a: '#e9b45a', b: '#5fd0c0', glow: '#e9b45a' },
  fire: { a: '#ffc46b', b: '#ff6a3a', glow: '#ff7a2a' },
  arcane: { a: '#dcc2ff', b: '#a98bff', glow: '#a98bff' },
  felrune: { a: '#b8ff8a', b: '#5fd12a', glow: '#7cff3a' },
  classic: { a: '#f0cf6e', b: '#5aa8ec', glow: '#f0cf6e' },
};

export interface StoryImage {
  /** Path under public/, e.g. 'about/story/pandaria-valley.webp'. Empty: placeholder art. For a video, its poster. */
  src: string;
  /** Path under public/ of a looping, muted .mp4 shown over the poster while its scene is on screen. */
  video?: string;
  width: number;
  height: number;
  /** object-position of the crop, e.g. '60% 40%'. */
  focus: string;
  frame: FrameStyle;
  alt: { en: string; es: string };
}

const story = (file: string, width: number, height: number, focus: string, frame: FrameStyle, en: string, es: string): StoryImage => ({
  src: `about/story/${file}`,
  width,
  height,
  focus,
  frame,
  alt: { en, es },
});

/** A live wallpaper: `<name>.mp4` with `<name>.webp` as its poster. */
const live = (name: string, width: number, height: number, focus: string, frame: FrameStyle, en: string, es: string): StoryImage => ({
  ...story(`${name}.webp`, width, height, focus, frame, en, es),
  video: `about/story/${name}.mp4`,
});

export const STORY_IMAGES: Record<StoryArtName, StoryImage> = {
  pandaria: story(
    'pandaria-valley.webp', 1920, 1080, '68% 50%', 'pandaria',
    'Stone pillars, pine trees and a red shrine in the misty valleys of Pandaria',
    'Pilares de roca, pinos y un santuario rojo en los valles con niebla de Pandaria',
  ),
  warlock: story(
    'warlock-fel-fire.webp', 1600, 900, '62% 50%', 'pandaria',
    'A Warlock firing a bolt of green fel fire across an arena',
    'Un brujo lanzando un proyectil de fuego vil verde en una arena',
  ),
  hunter: live(
    'demon-hunter-live', 1280, 720, '55% 40%', 'fel',
    'A Demon Hunter with horns and fel-green wings, her hair moving in the wind',
    'Una cazadora de demonios con cuernos y alas de fuego vil, el pelo movido por el viento',
  ),
  bfa: story(
    'bwonsamdi.webp', 1920, 1080, '55% 35%', 'loa',
    'Bwonsamdi, the loa of death from Battle for Azeroth, with a glowing skull mask',
    'Bwonsamdi, el loa de la muerte de Battle for Azeroth, con su máscara de calavera brillante',
  ),
  shadowlands: live(
    'shadowlands-live', 1600, 670, '50% 50%', 'shadow',
    'The Shadowlands sky torn open in fire above a dark spire',
    'El cielo de Shadowlands desgarrado en fuego sobre una aguja oscura',
  ),
  dragonflight: live(
    'dragonflight-live', 1280, 720, '60% 50%', 'dragon',
    'Waterfalls and stone bridges of the Dragon Isles, a small dragon flying past',
    'Cascadas y puentes de piedra de las Islas Dragón, con un pequeño dragón volando',
  ),
  tbc: story(
    'mage-guldan-illidan.webp', 1920, 1080, '50% 40%', 'felrune',
    'A young Mage holding a spellbook between Gul’dan and Illidan, under a fel-green sky',
    'Un joven Mago con un libro de hechizos entre Gul’dan e Illidan, bajo un cielo verde vil',
  ),
  mage: story(
    'mage-fire.webp', 1200, 675, '50% 28%', 'fire',
    'A Blood Elf Mage conjuring fire with both hands',
    'Un Mago elfo de sangre conjurando fuego con las dos manos',
  ),
  forever: story(
    'wow-forever.webp', 1920, 1080, '50% 50%', 'classic',
    'The World of Warcraft: Forever logo over green plains, mountains and a volcano',
    'El logo de World of Warcraft: Forever sobre llanuras verdes, montañas y un volcán',
  ),
  grimoire: story(
    'dalaran-library.webp', 1920, 1080, '50% 50%', 'arcane',
    'A quiet Mage library under a starry ceiling, books and candles',
    'Una biblioteca de magos tranquila bajo un techo estrellado, con libros y velas',
  ),
};
