import { Grid, Box, Stack } from '@chakra-ui/react';
import DayColumn from './DayColumn';

const CalendarGrid = ({ weekDates, turnos }) => {
    return (
        <Box>
            {/* Stack en móvil, Grid en desktop */}
            <Box display={{ base: 'block', md: 'none' }}>
                <Stack spacing={4}>
                {weekDates.map(({ dayName, date }, index) => (
                    <DayColumn key={index} dayName={dayName} date={date} turnos={turnos} />
                ))}
                </Stack>
            </Box>

            <Box display={{ base: 'none', md: 'block' }} overflowX="unset">
                <Grid
                templateColumns="repeat(5, 1fr)"
                gap={4}
                overflowX="auto"
                >
                {weekDates.map(({ dayName, date }, index) => (
                    <DayColumn key={index} dayName={dayName} date={date} turnos={turnos} />
                ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default CalendarGrid;

