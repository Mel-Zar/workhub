export const capitalize = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export const cleanCategory = str =>
    str ? str.replace(/[0-9]/g, "").trim() : "";

export const formatCategory = str => {
    if (!str) return "";
    const firstWord = str.split(/\s+/)[0];
    return capitalize(firstWord);
};
