/**
 * Words of the about page story (AboutStory.astro), in both languages. The
 * story is the author's real path through WoW: nothing here may be invented
 * (no dates, ranks or achievements he did not give).
 */
import type { Locale } from '../../i18n/routes';

export interface StoryCopy {
  label: string;
  chapters: string;
  hero: { kicker: string; title: string; lead: string; body: string[]; scroll: string };
  pandaria: {
    chapter: string;
    title: string;
    body: string[];
    note: string;
    timeline: { label: string; note: string; state: 'on' | 'gap' | 'back' }[];
  };
  hunter: {
    chapter: string;
    title: string;
    steps: { text: string; note?: string; caption: string }[];
  };
  classic: {
    chapter: string;
    title: string;
    steps: { text: string; punch?: string; caption: string }[];
  };
  progress: string[];
}

const en: StoryCopy = {
  label: 'Who am I: my story in World of Warcraft',
  chapters: 'Chapters of the story',
  hero: {
    kicker: 'Nxmpys · a player’s story',
    title: 'Who Am I?',
    lead: 'It all started with a very questionable relationship with PvE.',
    body: [
      'I started playing WoW back in Mists of Pandaria, when I was practically a teenager and PvP was pretty much all I cared about.',
      'Dungeons? Raids? Why would I do that when there were people to fight?',
      'Little did I know that, years later, I’d be spending my time obsessing over talent builds, dungeon routes and how to squeeze every last bit of value out of a class.',
    ],
    scroll: 'Scroll',
  },
  pandaria: {
    chapter: 'Chapter I — Mists of Pandaria',
    title: 'PvP first. Questions later.',
    body: [
      'My first main was a Destruction Warlock. Back then, I wasn’t looking for elaborate PvE rotations or perfect dungeon parses. I wanted to blow things up and fight other players.',
      'And honestly? That was enough.',
      'Then I took a break that lasted through two expansions. Turns out, even Azeroth can wait when real life has other plans.',
    ],
    note: 'Azeroth: still there.',
    timeline: [
      { label: 'Mists of Pandaria', note: 'Warlock, PvP', state: 'on' },
      { label: 'Warlords of Draenor', note: 'missed it', state: 'gap' },
      { label: 'Legion', note: 'missed it', state: 'gap' },
      { label: 'Battle for Azeroth', note: 'back', state: 'back' },
    ],
  },
  hunter: {
    chapter: 'Chapter II — From Battle for Azeroth to Midnight',
    title: 'The Demon Hunter era',
    steps: [
      {
        text: 'I eventually returned in Battle for Azeroth with a new main: a Demon Hunter, and a Mage as my alt.',
        caption: 'Main: Demon Hunter · Alt: Mage',
      },
      {
        text: 'And this time I discovered Mythic+. That was the beginning of a different side of WoW for me: I spent most of my time pushing keys.',
        caption: 'Battle for Azeroth · Mythic+',
      },
      {
        text: 'Shadowlands followed a similar path, although PvP found its way back into the picture. I played more, experimented more, and somehow kept coming back to the same green-glowing class.',
        note: 'PvP tier sets. Say no more.',
        caption: 'Shadowlands · PvP is back',
      },
      {
        text: 'Dragonflight, The War Within and Midnight have been a more relaxed ride for me. I’ve spent more time exploring different classes, trying new things and enjoying the game without always chasing the next upgrade.',
        caption: 'Dragonflight · The War Within · Midnight',
      },
    ],
  },
  classic: {
    chapter: 'Chapter III — Classic & TBC Anniversary',
    title: 'Plot twist: I actually like Classic Mage.',
    steps: [
      { text: 'Somewhere along the way, I also leveled my first Mage in Classic Anniversary.', caption: 'Classic Anniversary' },
      {
        text: 'Then came TBC Anniversary, and I realized how much I enjoyed the whole experience. Not just the class, but the journey of leveling, learning the toolkit and making every spell count.',
        caption: 'TBC Anniversary',
      },
      {
        text: 'So when WoW Forever comes around, the choice feels pretty obvious.',
        punch: 'One more Mage. One more adventure. Hopefully fewer questionable decisions.',
        caption: 'WoW Forever · Undead · Horde',
      },
    ],
  },
  progress: ['Start', 'Pandaria', 'BFA → Midnight', 'Classic'],
};

const es: StoryCopy = {
  label: 'Quién soy: mi historia en World of Warcraft',
  chapters: 'Capítulos de la historia',
  hero: {
    kicker: 'Nxmpys · la historia de un jugador',
    title: '¿Quién soy?',
    lead: 'Todo empezó con una relación muy cuestionable con el PvE.',
    body: [
      'Empecé a jugar a WoW en Mists of Pandaria, cuando era prácticamente un adolescente y lo único que me importaba era el JcJ.',
      '¿Mazmorras? ¿Bandas? ¿Para qué, si había gente con la que pelearse?',
      'Lo que no sabía es que, años después, me pasaría el tiempo obsesionado con builds de talentos, rutas de mazmorra y cómo exprimir hasta la última gota de una clase.',
    ],
    scroll: 'Desliza',
  },
  pandaria: {
    chapter: 'Capítulo I — Mists of Pandaria',
    title: 'Primero JcJ. Las preguntas, después.',
    body: [
      'Mi primer main fue un brujo Destrucción. Por aquel entonces no buscaba rotaciones de PvE elaboradas ni parses perfectos en mazmorras. Quería hacer volar cosas por los aires y pelearme con otros jugadores.',
      'Y, sinceramente, con eso me bastaba.',
      'Luego me tomé un descanso que duró dos expansiones enteras. Resulta que hasta Azeroth puede esperar cuando la vida real tiene otros planes.',
    ],
    note: 'Azeroth: seguía ahí.',
    timeline: [
      { label: 'Mists of Pandaria', note: 'brujo, JcJ', state: 'on' },
      { label: 'Warlords of Draenor', note: 'me la perdí', state: 'gap' },
      { label: 'Legion', note: 'me la perdí', state: 'gap' },
      { label: 'Battle for Azeroth', note: 'vuelta', state: 'back' },
    ],
  },
  hunter: {
    chapter: 'Capítulo II — De Battle for Azeroth a Midnight',
    title: 'La era del cazador de demonios',
    steps: [
      {
        text: 'Al final volví en Battle for Azeroth con un main nuevo: un cazador de demonios, y el Mago de alter.',
        caption: 'Main: cazador de demonios · Alter: Mago',
      },
      {
        text: 'Y esta vez descubrí las Míticas+. Ahí empezó otra cara de WoW para mí: pasé la mayor parte del tiempo subiendo llaves.',
        caption: 'Battle for Azeroth · Míticas+',
      },
      {
        text: 'Shadowlands siguió un camino parecido, aunque el JcJ volvió a colarse en la ecuación. Jugué más, experimenté más y, de alguna forma, siempre acababa volviendo a la misma clase que brilla en verde.',
        note: 'Sets de tier de JcJ. No digo más.',
        caption: 'Shadowlands · vuelve el JcJ',
      },
      {
        text: 'Dragonflight, The War Within y Midnight han sido un viaje más tranquilo para mí. He pasado más tiempo explorando clases distintas, probando cosas nuevas y disfrutando del juego sin perseguir siempre la siguiente mejora.',
        caption: 'Dragonflight · The War Within · Midnight',
      },
    ],
  },
  classic: {
    chapter: 'Capítulo III — Classic y TBC Anniversary',
    title: 'Giro de guion: resulta que me encanta el Mago de Classic.',
    steps: [
      { text: 'Por el camino, también subí mi primer Mago en Classic Anniversary.', caption: 'Classic Anniversary' },
      {
        text: 'Luego llegó TBC Anniversary y me di cuenta de lo mucho que disfrutaba toda la experiencia. No solo la clase: también el camino de subir de nivel, aprender a usar todas sus herramientas y hacer que cada hechizo cuente.',
        caption: 'TBC Anniversary',
      },
      {
        text: 'Así que, con WoW Forever a la vuelta de la esquina, la elección parece bastante obvia.',
        punch: 'Un Mago más. Una aventura más. Con suerte, menos decisiones cuestionables.',
        caption: 'WoW Forever · no-muerto · Horda',
      },
    ],
  },
  progress: ['Inicio', 'Pandaria', 'BFA → Midnight', 'Classic'],
};

export const STORY_COPY: Record<Locale, StoryCopy> = { en, es };
