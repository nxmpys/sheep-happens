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

export interface StoryImage {
  /** Path under public/, e.g. 'about/story/pandaria-valley.webp'. Empty: placeholder art. For a video, its poster. */
  src: string;
  /** Path under public/ of a looping, muted .mp4 shown over the poster while its scene is on screen. */
  video?: string;
  width: number;
  height: number;
  /** object-position of the crop, e.g. '60% 40%'. */
  focus: string;
  alt: { en: string; es: string };
}

const story = (file: string, width: number, height: number, focus: string, en: string, es: string): StoryImage => ({
  src: `about/story/${file}`,
  width,
  height,
  focus,
  alt: { en, es },
});

/** A live wallpaper: `<name>.mp4` with `<name>.webp` as its poster. */
const live = (name: string, width: number, height: number, focus: string, en: string, es: string): StoryImage => ({
  ...story(`${name}.webp`, width, height, focus, en, es),
  video: `about/story/${name}.mp4`,
});

export const STORY_IMAGES: Record<StoryArtName, StoryImage> = {
  pandaria: story(
    'pandaria-valley.webp', 1920, 1080, '68% 50%',
    'Stone pillars, pine trees and a red shrine in the misty valleys of Pandaria',
    'Pilares de roca, pinos y un santuario rojo en los valles con niebla de Pandaria',
  ),
  warlock: story(
    'warlock-fel-fire.webp', 1600, 900, '62% 50%',
    'A Warlock firing a bolt of green fel fire across an arena',
    'Un brujo lanzando un proyectil de fuego vil verde en una arena',
  ),
  hunter: live(
    'demon-hunter-live', 1280, 720, '55% 40%',
    'A Demon Hunter with horns and fel-green wings, her hair moving in the wind',
    'Una cazadora de demonios con cuernos y alas de fuego vil, el pelo movido por el viento',
  ),
  bfa: story(
    'bfa.webp', 1600, 960, '45% 45%',
    'Battle for Azeroth: Sylvanas and Anduin clash in the middle of the war',
    'Battle for Azeroth: Sylvanas y Anduin chocan en mitad de la guerra',
  ),
  shadowlands: live(
    'shadowlands-live', 1600, 670, '50% 50%',
    'The Shadowlands sky torn open in fire above a dark spire',
    'El cielo de Shadowlands desgarrado en fuego sobre una aguja oscura',
  ),
  dragonflight: live(
    'dragonflight-live', 1280, 720, '60% 50%',
    'Waterfalls and stone bridges of the Dragon Isles, a small dragon flying past',
    'Cascadas y puentes de piedra de las Islas Dragón, con un pequeño dragón volando',
  ),
  tbc: live(
    'tbc-live', 1280, 720, '45% 50%',
    'The Dark Portal seen from Outland, glowing fel green under a red sky',
    'El Portal Oscuro visto desde Terrallende, brillando en verde vil bajo un cielo rojo',
  ),
  mage: story(
    'mage-fire.webp', 1200, 675, '50% 28%',
    'A Blood Elf Mage conjuring fire with both hands',
    'Un Mago elfo de sangre conjurando fuego con las dos manos',
  ),
  forever: story(
    'wow-forever.webp', 1920, 1080, '50% 50%',
    'The World of Warcraft: Forever logo over green plains, mountains and a volcano',
    'El logo de World of Warcraft: Forever sobre llanuras verdes, montañas y un volcán',
  ),
  grimoire: story(
    'dalaran-library.webp', 1920, 1080, '50% 50%',
    'A quiet Mage library under a starry ceiling, books and candles',
    'Una biblioteca de magos tranquila bajo un techo estrellado, con libros y velas',
  ),
};
