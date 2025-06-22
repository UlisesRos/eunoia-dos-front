export function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

    // Calcular cuántos días restar para llegar al lunes (o avanzar si es sábado)
    const daysToMonday = day === 6 ? 2 : (day === 0 ? -6 : 1 - day);
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


