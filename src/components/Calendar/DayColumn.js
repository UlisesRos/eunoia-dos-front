import { Box, Heading, VStack } from '@chakra-ui/react';
import TimeSlot from './TimeSlot';
import { horariosPorDia } from '../../utils/horarios';

const DayColumn = ({ dayName, date, turnos }) => {
    const horarios = horariosPorDia[dayName.toLowerCase()] || [];

    return (
        <Box borderWidth="1px" borderRadius="lg" p={{ base: 2, md: 3 }} minW="230px">
            <Heading size="sm" textAlign="center" mb={2}>
                {dayName} - {date}
            </Heading>
            <VStack spacing={2} color='brand.primary' fontWeight='bold' textAlign='center'>
                {horarios.map((hora, idx) => {
                    const turno = turnos.find(t => t.day === dayName && t.hour === hora);                    
                    return (
                        <TimeSlot key={idx} hora={hora} usersInSlot={turno?.users || []} />
                    );
                })}
            </VStack>
        </Box>
    );
};

export default DayColumn;
