export function getWeekDates(month, year, weekNumber) {
    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 = domingo
    const daysToMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    const firstMonday = new Date(year, month, 1 + daysToMonday - 1);

    const weekStartDate = new Date(firstMonday);
    weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7);

    const weekDates = [];

    for (let i = 0; i < 5; i++) {
        const day = new Date(weekStartDate);
        day.setDate(weekStartDate.getDate() + i);

        // Solo agregar si el día pertenece al mes actual
        if (day.getMonth() === month) {
            weekDates.push({
                dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][i],
                date: day.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
            });
        }
    }

    return weekDates;
}

export function getFilteredWeeks(month, year) {
    const weeks = [];

    for (let i = 1; i <= 6; i++) {
        const weekDates = getWeekDates(month, year, i);

        const hasValidDayInMonth = weekDates.some(({ date }) => {
        const [day, monthStr, yearStr] = date.split('/');
        const dateObj = new Date(`${yearStr}-${monthStr}-${day}`);
        const dayOfWeek = dateObj.getDay(); // 0 = domingo, 6 = sábado
        return (
                dateObj.getMonth() === month &&
                dayOfWeek >= 1 && dayOfWeek <= 6 // lunes a sábado
            );
        });

        if (hasValidDayInMonth) {
        weeks.push({ weekNumber: i, weekDates });
        }
    }

    return weeks;
}

