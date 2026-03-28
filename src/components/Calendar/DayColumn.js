import { Box, Heading, Text, VStack, Button, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import TimeSlot from './TimeSlot';
import { horariosPorDia } from '../../utils/horarios';
import { useAuth } from '../../context/AuthContext';

const MotionBox = motion(Box);

const DayColumn = ({ dayName, date, turnos, onNombreClick, feriados = [], onMarcarFeriado, onQuitarFeriado, searchQuery = '', schedule = {}, closedSlots = [], onToggleClosed }) => {
    const horarios = (schedule[dayName.toLowerCase()] || horariosPorDia[dayName.toLowerCase()] || []);

    const fechaISO = new Date(date).toISOString().slice(0, 10);
    const esFeriado = feriados.some(f => f.date === fechaISO);

    const fechaObj = new Date(date);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const fechaFormateada = `${dia}/${mes}`;

    const { user } = useAuth();
    const esAdmin = user?.rol === 'admin';

    const query = searchQuery.trim().toLowerCase();
    const tieneCoincidencia = query.length >= 2 && turnos.some(t =>
        t.day === dayName &&
        t.users?.some(u => u.nombre.toLowerCase().includes(query))
    );

    return (
        <MotionBox
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            borderRadius="2xl"
            overflow="hidden"
            minW={{ base: '100%', md: '210px' }}
            maxW="100%"
            bg={esFeriado ? 'rgba(220,53,69,0.15)' : 'rgba(255,255,255,0.1)'}
            border="1px solid"
            borderColor={
                tieneCoincidencia
                    ? 'rgba(235,235,235,0.7)'
                    : esFeriado
                    ? 'rgba(220,53,69,0.4)'
                    : 'rgba(235,235,235,0.22)'
            }
            boxShadow={tieneCoincidencia ? '0 0 20px rgba(235,235,235,0.15)' : '0 4px 20px rgba(0,0,0,0.15)'}
        >
            {/* Header del día */}
            <Box
                bg={esFeriado ? 'rgba(220,53,69,0.3)' : 'rgba(255,255,255,0.14)'}
                borderBottom="1px solid"
                borderColor={esFeriado ? 'rgba(220,53,69,0.35)' : 'rgba(235,235,235,0.18)'}
                px={3}
                py={3}
                textAlign="center"
            >
                {esFeriado ? (
                    <Heading
                        fontFamily="'Playfair Display', serif"
                        fontSize="md"
                        fontWeight="700"
                        color="red.200"
                        letterSpacing="0.1em"
                    >
                        FERIADO
                    </Heading>
                ) : (
                    <>
                        <Heading
                            fontFamily="'Playfair Display', serif"
                            fontSize={{ base: 'md', md: 'sm' }}
                            fontWeight="700"
                            color="brand.secondary"
                            letterSpacing="0.06em"
                            textTransform="capitalize"
                        >
                            {dayName}
                        </Heading>
                        <Text
                            fontFamily="'Questrial', sans-serif"
                            fontSize="xs"
                            color="rgba(235,235,235,0.75)"
                            mt={0.5}
                            letterSpacing="0.05em"
                        >
                            {fechaFormateada}
                        </Text>
                    </>
                )}

                {esAdmin && (
                    <Flex justifyContent="center" mt={2}>
                        {esFeriado ? (
                            <Button
                                size="xs"
                                bg="rgba(220,53,69,0.25)"
                                borderColor="red.300"
                                color="red.200"
                                border="1px solid"
                                borderRadius="lg"
                                fontFamily="'Questrial', sans-serif"
                                fontSize="10px"
                                letterSpacing="0.05em"
                                _hover={{ bg: 'rgba(220,53,69,0.45)', color: 'white' }}
                                onClick={() => onQuitarFeriado(fechaISO)}
                            >
                                Quitar feriado
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                bg="rgba(235,235,235,0.12)"
                                border="1px solid"
                                borderColor="rgba(235,235,235,0.45)"
                                color="rgba(235,235,235,0.9)"
                                borderRadius="lg"
                                fontFamily="'Questrial', sans-serif"
                                fontSize="10px"
                                letterSpacing="0.05em"
                                _hover={{ bg: 'rgba(220,53,69,0.3)', borderColor: 'red.300', color: 'red.200' }}
                                onClick={() => onMarcarFeriado(fechaISO)}
                            >
                                Marcar feriado
                            </Button>
                        )}
                    </Flex>
                )}
            </Box>

            {/* Slots */}
            <VStack spacing={2} p={2} w="100%">
                {horarios.map((hora, idx) => {
                    const turno = turnos.find(t => t.day === dayName && t.hour === hora);
                    return (
                        <TimeSlot
                            key={idx}
                            dia={dayName}
                            hora={hora}
                            usersInSlot={turno?.users || []}
                            currentUser={`${user?.nombre} ${user?.apellido}`}
                            onNombreClick={(dia, hora, u) => onNombreClick(dia, hora, u)}
                            searchQuery={searchQuery}
                            isClosed={closedSlots.some(cs => cs.date === fechaISO && cs.hour === hora)}
                            onToggleClosed={onToggleClosed}
                        />
                    );
                })}
            </VStack>
        </MotionBox>
    );
};

export default DayColumn;
