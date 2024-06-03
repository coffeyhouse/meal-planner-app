// utils/date.js

export function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

export function isThisWeek(date) {
    const now = new Date();
    return getWeekNumber(now) === getWeekNumber(new Date(date.split(' ')[0]));
}

export function isNextWeek(date) {
    const now = new Date();
    return getWeekNumber(now) + 1 === getWeekNumber(new Date(date.split(' ')[0]));
}

export function formatDate(dateString) {
    const date = new Date(dateString.split(' ')[0]);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
}

export function formatDateConsistent(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
