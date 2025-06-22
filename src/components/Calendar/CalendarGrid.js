import { Grid, Box } from '@chakra-ui/react';
import DayColumn from './DayColumn';

const CalendarGrid = ({ weekDates, turnos, onNombreClick, feriados = [], onMarcarFeriado, onQuitarFeriado }) => {
    return (
        <Box overflowX="auto">
            <Grid
                templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }}
                gap={4}
                minW={{ base: '100%', md: '768px' }} // asegura el layout correcto en desktop
                px={2} // un poco de padding horizontal
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
                    />                
                ))}
            </Grid> 
        </Box>
    );
};

export default CalendarGrid;

