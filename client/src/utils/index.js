export const parseDate = (input) => {
    if (!input) return null;

    const parts = input.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}\.\d{3}) ([+-]\d{2}:\d{2})/);
    if (!parts) {
        console.error("Invalid date format:", input);
        return null;
    }

    const dateString = `${parts[1]}T${parts[2]}${parts[3]}`;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error("Invalid date parsed:", dateString);
        return null;
    }
    return date;
};

export const getDateRange = (start, end) => {
    let startDate = parseDate(start);
    const endDate = parseDate(end);

    if (!startDate || !endDate) {
        console.error('Invalid start or end date', { start, end });
        return [];
    }

    const dates = [];
    while (startDate <= endDate) {
        dates.push(startDate.toISOString().split('T')[0]);
        startDate = new Date(startDate.setDate(startDate.getDate() + 1));
    }

    return dates;
};

export const formatDayAndWeekday = (dateString) => {
    const weekdayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const date = new Date(dateString);
    const day = date.getDate();
    const weekdayIndex = date.getDay();
    const weekdayInitial = weekdayInitials[weekdayIndex];
    return { day, weekdayInitial };
};
