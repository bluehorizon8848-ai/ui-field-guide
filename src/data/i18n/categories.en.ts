import type { CategoryTranslations } from './types';

/**
 * English blurbs for the 8 categories.
 * id / name / chineseName / tint / accent all stay in the source file.
 */
export const categoryTranslations: CategoryTranslations = {
  navigation: {
    blurb: 'Move people between screens and layers, and always keep them aware of exactly where they are right now.',
  },
  actions: {
    blurb: 'Let people trigger something. These are the pressable parts of your interface that do the work.',
  },
  input: {
    blurb: 'Collect whatever the user knows: typed text, picked options, flipped toggles, drags, and uploads.',
  },
  containers: {
    blurb: 'Group related things together, or unfold a temporary layer that floats above the page below it.',
  },
  feedback: {
    blurb: 'Tell the user what just happened, what state things are in now, and what they can do next.',
  },
  data: {
    blurb: 'Lay out information so people can actually read it: lists, tables, tags, and plain old numbers.',
  },
  interaction: {
    blurb: 'Not components but habits — the gestures people expect, like long press, swipe, and pull to refresh.',
  },
  general: {
    blurb: 'Belongs to no single category, yet these are the everyday basics you will see on nearly every screen.',
  },
  layout: {
    blurb: 'Governs spatial framing and visual flow — how content is placed, max-width bounds, and screen division.',
  },
};