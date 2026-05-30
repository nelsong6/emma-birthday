// Edit this file to change the birthday book.
//
// Each entry is one "page" Emma turns through. Fields:
//   image   – (optional) filename inside frontend/images/, e.g. "01.jpg"
//   title   – (optional) big heading text
//   text    – (optional) smaller caption / message (supports line breaks)
//   theme   – (optional) "light" or "dark" to flip text color for that page
//
// Add/remove/reorder freely. 5–10 pages is the sweet spot.
// Drop your resized photos into frontend/images/ with matching filenames.
window.BIRTHDAY_PAGES = [
  // Page 1 — intro: the forward-arrow sketch, full bleed.
  {
    image: '02.jpg',
    full: true,
  },
  // Page 2 — "Sound on": the speaker sketch, full bleed. Reaching this page
  // fades in the beach/ocean ambience (see `ambience` below), which then
  // carries through to the seascape on page 3.
  {
    image: '01.jpg',
    full: true,
    ambience: true,
  },
  // Page 3 — the Dana Hulburt seascape painting, full bleed.
  {
    image: '03.jpg',
    full: true,
  },
];

// Background music: loops from the first tap. Leave '' to disable.
window.BIRTHDAY_AUDIO = 'song.mp3';

// Ambience: a second looping track that fades in once the reader reaches the
// first page flagged `ambience: true` (and fades back out if they page back).
// Here it's the ocean-waves loop tied to the "Sound on" / seascape pages.
window.BIRTHDAY_AMBIENCE = 'ocean.mp3';
