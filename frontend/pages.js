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
  {
    title: 'Happy Birthday, Emma!',
    text: 'Turn the page →',
    theme: 'dark',
  },
  {
    image: '01.jpg',
    text: 'Sound on! 🔊',
  },
  {
    image: '02.jpg',
    text: 'Turn the page →',
  },
  {
    image: '03.jpg',
  },
  {
    title: 'Here’s to the next one 🥂',
    text: 'With love.',
    theme: 'dark',
  },
];

// Background music: drop a file into frontend/audio/ and set the name here.
// Leave as empty string ('') to disable audio entirely.
window.BIRTHDAY_AUDIO = 'song.mp3';
