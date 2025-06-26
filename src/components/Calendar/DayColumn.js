import { Box, Heading, VStack, Button, Flex } from '@chakra-ui/react';
import TimeSlot from './TimeSlot';
import { horariosPorDia } from '../../utils/horarios';
import { useAuth } from '../../context/AuthContext';

const DayColumn = ({ dayName, date, turnos, onNombreClick, feriados = [], onMarcarFeriado, onQuitarFeriado }) => {
    const horarios = horariosPorDia[dayName.toLowerCase()] || [];

    const fechaISO = new Date(date).toISOString().slice(0, 10);
    const esFeriado = feriados.some(f => f.date === fechaISO);

    const fechaObj = new Date(date);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const fechaFormateada = `${dia}/${mes}`;

    const { user } = useAuth();
    const esAdmin = user?.rol === 'admin';


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
                color={esFeriado ? 'red.500' : 'inherit'}
            >
                {esFeriado ? (
                    'FERIADO'
                    ) : (
                    <>
                        {dayName}
                        <br />
                        {fechaFormateada}
                    </>
                    )}
            </Heading>

            {esAdmin && (
                <Flex justifyContent="center">
                    {esFeriado ? (
                    <Button
                        size="xs"
                        colorScheme="red"
                        variant="outline"
                        mb={2}
                        onClick={() => onQuitarFeriado(fechaISO)}
                    >
                        Quitar feriado
                    </Button>
                    ) : (
                    <Button
                        size="xs"
                        colorScheme="red"
                        variant="outline"
                        mb={2}
                        onClick={() => onMarcarFeriado(fechaISO)}
                    >
                        Marcar como feriado
                    </Button>
                    )}
                </Flex>
            )}

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
                    <TimeSlot
                        key={idx}
                        dia={dayName}
                        hora={hora}
                        usersInSlot={turno?.users || []}
                        currentUser={`${user?.nombre} ${user?.apellido}`}
                        onNombreClick={(dia, hora, user) => onNombreClick(dia, hora, user)}
                    />                
                );                                
            })}
            </VStack>
        </Box>
    );
};

export default DayColumn;

