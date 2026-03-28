import { Grid, Box } from '@chakra-ui/react';
import DayColumn from './DayColumn';

const CalendarGrid = ({
    weekDates,
    turnos,
    onNombreClick,
    feriados = [],
    onMarcarFeriado,
    onQuitarFeriado,
    searchQuery = '',
    schedule = {},
    closedSlots = [],
    onToggleClosed
}) => {
    return (
        <Box overflowX="auto">
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }}
                gap={4}
                minW={{ base: '100%', md: '768px' }}
                px={2}
            >
                {weekDates.map(({ dayName, date }, index) => (
                    <DayColumn
                        key={index}
                        dayName={dayName}
                        date={date}
                        turnos={turnos}
                        onNombreClick={onNombreClick}
                        feriados={feriados}
                        onMarcarFeriado={onMarcarFeriado}
                        onQuitarFeriado={onQuitarFeriado}
                        searchQuery={searchQuery}
                        schedule={schedule}
                        closedSlots={closedSlots}
                        onToggleClosed={onToggleClosed}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default CalendarGrid;
