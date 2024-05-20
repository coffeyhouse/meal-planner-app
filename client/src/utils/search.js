import Fuse from 'fuse.js';

export const searchItems = (items, keys, searchTerm, threshold = 0.3) => {
    const fuse = new Fuse(items, {
        keys,
        includeScore: true,
        threshold
    });

    return searchTerm ? fuse.search(searchTerm).map(result => result.item) : items;
};
