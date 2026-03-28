// components/Modals/RecuperarTurnoModal.js
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast, Box, Text,
    Badge, Divider, HStack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { usarTurnoRecuperado } from '../../services/calendarAPI';

export default function RecuperarTurnoModal({
    isOpen,
    onClose,
    turnosRecuperables = [],
    turnosOcupados = [],
    onUpdate,
    horasDisponiblesPorDia,
    nombreUsuario
}) {
    const toast = useToast();
    const [selectedTurnId, setSelectedTurnId] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedTurnId('');
            setSelectedDay('');
            setSelectedHour('');
        }
    }, [isOpen]);

    const turnosLlenos = new Set(
        turnosOcupados
            .filter(t =>
                t.users.length >= 4 &&
                !t.users.some(u => u.nombre === nombreUsuario)
            )
            .map(t => `${t.day}-${t.hour}`)
    );

    const formatearFecha = (iso) => {
        if (!iso) return 'fecha desconocida';
        const date = new Date(iso);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dia = dias[date.getUTCDay()];
        const dd = String(date.getUTCDate()).padStart(2, '0');
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        return `${dia} ${dd}/${mm}`;
    };

    const horasFiltradas = selectedDay ? horasDisponiblesPorDia[selectedDay] || [] : [];

    const turnoSeleccionado = turnosRecuperables.find(t => t._id === selectedTurnId);

    const handleRecuperar = async () => {
        if (!selectedTurnId || !selectedDay || !selectedHour) {
            toast({
                title: 'Faltan datos',
                description: 'Seleccioná el turno pendiente y elegí un día y horario disponible.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const clave = `${selectedDay}-${selectedHour}`;
        if (turnosLlenos.has(clave)) {
            toast({
                title: 'Horario completo',
                description: 'Ese horario ya está lleno. Elegí otro.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await usarTurnoRecuperado(selectedTurnId, selectedDay, selectedHour);
            toast({
                title: 'Turno recuperado',
                description: `Quedaste anotado/a el ${selectedDay} a las ${selectedHour} hs.`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (err) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'No se pudo recuperar el turno.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay bg="blackAlpha.600" />
            <ModalContent>
                <ModalHeader textAlign="center">Recuperar turno pendiente</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Info sobre turnos pendientes */}
                    <Box bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="md" p={3} mb={4}>
                        <Text fontSize="sm" color="blue.800" textAlign="center">
                            Tenés <strong>{turnosRecuperables.length}</strong> turno{turnosRecuperables.length !== 1 ? 's' : ''} pendiente{turnosRecuperables.length !== 1 ? 's' : ''}.
                            Elegí cuál usar y en qué horario lo querés tomar esta semana.
                        </Text>
                    </Box>

                    {/* Paso 1: Elegir turno pendiente */}
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                        Paso 1: Elegí el turno que querés usar
                    </Text>
                    <Select
                        placeholder="Seleccioná un turno pendiente"
                        value={selectedTurnId}
                        onChange={(e) => setSelectedTurnId(e.target.value)}
                        mb={1}
                        size="sm"
                    >
                        {turnosRecuperables.map(t => (
                            <option key={t._id} value={t._id}>
                                {t.cancelDate
                                    ? `Turno del ${formatearFecha(t.cancelDate)} — ${t.originalDay} ${t.originalHour} hs`
                                    : `${t.originalDay} ${t.originalHour} hs`
                                }
                            </option>
                        ))}
                    </Select>

                    {/* Detalles del turno seleccionado */}
                    {turnoSeleccionado && (
                        <Box bg="gray.50" borderRadius="md" p={2} mb={4}>
                            <HStack spacing={2} flexWrap="wrap">
                                <Badge colorScheme="blue" fontSize="xs">Turno original</Badge>
                                <Text fontSize="xs" color="gray.600">
                                    {turnoSeleccionado.originalDay} — {turnoSeleccionado.originalHour} hs
                                </Text>
                                {turnoSeleccionado.cancelDate && (
                                    <>
                                        <Badge colorScheme="orange" fontSize="xs">Cancelado</Badge>
                                        <Text fontSize="xs" color="gray.600">
                                            semana del {formatearFecha(turnoSeleccionado.cancelDate)}
                                        </Text>
                                    </>
                                )}
                            </HStack>
                        </Box>
                    )}

                    <Divider mb={4} />

                    {/* Paso 2: Elegir nuevo horario */}
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                        Paso 2: Elegí cuándo querés tomarlo esta semana
                    </Text>
                    <Select
                        placeholder="Elegí el día"
                        value={selectedDay}
                        onChange={(e) => {
                            setSelectedDay(e.target.value);
                            setSelectedHour('');
                        }}
                        mb={2}
                        size="sm"
                        isDisabled={!selectedTurnId}
                    >
                        {Object.keys(horasDisponiblesPorDia).map(dia => (
                            <option key={dia} value={dia}>{dia}</option>
                        ))}
                    </Select>

                    {selectedDay && (
                        <Select
                            placeholder="Elegí el horario"
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                            size="sm"
                        >
                            {horasFiltradas.map(hora => {
                                const clave = `${selectedDay}-${hora}`;
                                const disabled = turnosLlenos.has(clave);
                                return (
                                    <option key={hora} value={hora} disabled={disabled}>
                                        {hora} hs {disabled ? '— Completo' : ''}
                                    </option>
                                );
                            })}
                        </Select>
                    )}

                    {/* Resumen de la selección */}
                    {selectedTurnId && selectedDay && selectedHour && (
                        <Box bg="teal.50" border="1px solid" borderColor="teal.300" borderRadius="md" p={3} mt={4}>
                            <Text fontSize="sm" color="teal.800" textAlign="center">
                                Vas a recuperar el turno el <strong>{selectedDay}</strong> a las <strong>{selectedHour} hs</strong>
                            </Text>
                        </Box>
                    )}
                </ModalBody>

                <ModalFooter gap={2}>
                    <Button variant="ghost" onClick={onClose} isDisabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="teal"
                        onClick={handleRecuperar}
                        isLoading={loading}
                        isDisabled={!selectedTurnId || !selectedDay || !selectedHour}
                    >
                        Confirmar recuperación
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
