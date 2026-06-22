// Verifica se il prodotto è stato creato nelle ultime 24 ore
export const isNew = (date) => {
    const created = new Date(date);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60);
    return diff < 24;
};