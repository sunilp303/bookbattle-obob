export const books = [
  { id: 'caterpillar-summer', title: 'Caterpillar Summer', author: 'Gillian McDunn' },
  { id: 'connect-the-stars', title: 'Connect the Stars', author: 'Marisa de los Santos and David Teague' },
  { id: 'dogtown', title: 'Dogtown', author: 'Katherine Applegate and Gennifer Choldenko' },
  { id: 'esperanza-rising', title: 'Esperanza Rising', author: 'Pam Muñoz Ryan' },
  { id: 'frindle', title: 'Frindle', author: 'Andrew Clements' },
  { id: 'grace-of-wild-things', title: 'The Grace of Wild Things', author: 'Heather Fawcett' },
  { id: 'guardian-test', title: 'The Guardian Test', author: 'Christina Soontornvat' },
  { id: 'bathing-suit', title: 'It’s the End of the World and I’m in My Bathing Suit', author: 'Justin A. Reynolds' },
  { id: 'kind-of-spark', title: 'A Kind of Spark', author: 'Elle McNicoll' },
  { id: 'light-and-air', title: 'Light and Air', author: 'Mindy Nichols Wendell' },
  { id: 'lightning-thief', title: 'The Lightning Thief', author: 'Rick Riordan' },
  { id: 'magic-misfits', title: 'The Magic Misfits', author: 'Neil Patrick Harris' },
  { id: 'family-fletcher', title: 'The Misadventures of the Family Fletcher', author: 'Dana Alison Levy' },
  { id: 'murder-at-the-museum', title: 'Murder at the Museum', author: 'Alasdair Beckett-King' },
  { id: 'snow-and-rose', title: 'Snow and Rose', author: 'Emily Winfield Martin' },
  { id: 'witch-boy', title: 'The Witch Boy', author: 'Lee Knox Ostertag' },
];

export type Book = (typeof books)[number];
