export function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

    // Si es sábado (6) o domingo (0), avanzar a lunes siguiente
    const daysToMonday = day === 0
        ? 1     // domingo → lunes siguiente
        : day === 6
        ? 2     // sábado → lunes siguiente
        : 1 - day; // resto de días: lunes a viernes

    const monday = new Date(today);
    monday.setDate(today.getDate() + daysToMonday);

    const weekDates = [];

    for (let i = 0; i < 5; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push({
            dayName: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][i],
            date
        });
    }

    return weekDates;
}



