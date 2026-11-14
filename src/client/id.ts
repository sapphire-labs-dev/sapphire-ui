// Short unique ids for things stored in the browser (people, topics, decks).

let idCounter = 0;
export const newId = (): string => `${Date.now().toString(36)}${(idCounter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
