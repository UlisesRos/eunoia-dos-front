import { Box, Heading, VStack } from '@chakra-ui/react';
import TimeSlot from './TimeSlot';
import { horariosPorDia } from '../../utils/horarios';
import { useAuth } from '../../context/AuthContext';

const DayColumn = ({ dayName, date, turnos }) => {
    const horarios = horariosPorDia[dayName.toLowerCase()] || [];

    const { user } = useAuth();

    return (
        <Box
        borderWidth="1px"
        borderRadius="lg"
        p={{ base: 2, md: 3 }}
        minW={{ base: '100%', md: '230px' }} // en mobile ocupa 100%, en desktop mínimo 230px
        maxW="100%"
        boxSizing="border-box"
        >
            <Heading
                size="sm"
                textAlign="center"
                mb={2}
                fontSize={{ base: 'md', md: 'lg' }} // tamaño adaptable
                wordBreak="break-word"
            >
                {dayName}
            </Heading>

            <VStack
                spacing={2}
                color="brand.primary"
                fontWeight="bold"
                textAlign="center"
                w="100%"
            >
                {horarios.map((hora, idx) => {
                const turno = turnos.find(t => t.day === dayName && t.hour === hora);
                return (
                    <TimeSlot key={idx} hora={hora} usersInSlot={turno?.users || []} currentUser={`${user?.nombre} ${user?.apellido}`}/>
                );
                })}
            </VStack>
        </Box>
    );
};

export default DayColumn;

