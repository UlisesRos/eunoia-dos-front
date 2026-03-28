// components/Modals/EditSingleTurnModal.js
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast, Text,
    Flex, Box, Divider, VStack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { setUserSelections, resetUserSelections, cancelarTurnoTemporalmente, guardarTurnoParaRecuperar, usuarioEliminarTurnoRecuperado } from '../../services/calendarAPI';
import { useAuth } from '../../context/AuthContext';

const diasDisponibles = ['Lunes', 'Miércoles', 'Viernes'];
const horasDisponibles = {
    'Lunes': ['18:00', '19:00', '20:00'],
    'Miércoles': ['18:00', '19:00', '20:00'],
    'Viernes': ['18:00', '19:00']
};

export default function EditSingleTurnModal({
    isOpen,
    onClose,
    userSelections,
    turnosOcupados = [],
    cambiosRestantes,
    horarioActual,
    feriados = [],
    weekDates = [],
    onUpdate
}) {
    const toast = useToast();
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const nombreC = `${user.nombre} ${user.apellido}`;

    const esTurnoTemporal = horarioActual?.tipo === 'temporal';
    const esTurnoRecuperado = horarioActual?.tipo === 'recuperado';
    const estaBloqueadoPorPago = !user.pago && new Date().getDate() > 10;
    const sinCambios = cambiosRestantes <= 0;

    useEffect(() => {
        if (isOpen) {
            setSelectedDay('');
            setSelectedHour('');
        }
    }, [isOpen]);

    const diasFeriadosISO = feriados.map(f => f.date);
    const diasBloqueados = new Set();

    weekDates?.forEach(({ dayName, date }) => {
        const iso = new Date(date).toISOString().slice(0, 10);
        if (diasFeriadosISO.includes(iso)) {
            diasBloqueados.add(dayName);
        }
    });

    const turnosLlenos = new Set(
        turnosOcupados
            .filter(t => t.users.length >= 4 && !t.users.some(u => u.nombre === nombreC))
            .map(t => `${t.day}-${t.hour}`)
    );

    const horasFiltradas = selectedDay ? horasDisponibles[selectedDay] : [];

    const handleSave = async () => {
        if (!selectedDay || !selectedHour) {
            toast({
                title: 'Falta información',
                description: 'Elegí el día y horario al que querés moverte.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const nuevoTurno = { day: selectedDay, hour: selectedHour };
        const nuevaSeleccion = userSelections
            .filter(s => !(s.day === horarioActual.day && s.hour === horarioActual.hour))
            .concat(nuevoTurno);

        setLoading(true);
        try {
            await setUserSelections(nuevaSeleccion);
            toast({
                title: 'Cambio realizado',
                description: `Te moviste de ${horarioActual.day} ${horarioActual.hour} hs a ${nuevoTurno.day} ${nuevoTurno.hour} hs`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo realizar el cambio.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarYGuardar = async () => {
        const confirmacion = window.confirm(
            `¿Querés guardar el turno del ${horarioActual.day} ${horarioActual.hour} hs para usarlo en otra semana?\n\nEste turno quedará pendiente y podrás usarlo cuando quieras.`
        );
        if (!confirmacion) return;

        setLoading(true);
        try {
            await guardarTurnoParaRecuperar(horarioActual.day, horarioActual.hour);
            await cancelarTurnoTemporalmente(horarioActual.day, horarioActual.hour);
            toast({
                title: 'Turno guardado para recuperar',
                description: 'Usá el botón "Recuperar turno pendiente" cuando quieras asignarte ese turno en otra semana.',
                status: 'info',
                duration: 5000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo guardar el turno.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarSinRecuperar = async () => {
        const confirmacion = window.confirm(
            `¿Estás seguro de que querés cancelar tu turno del ${horarioActual.day} ${horarioActual.hour} hs esta semana?\n\nEste turno se perderá y no podrás recuperarlo.`
        );
        if (!confirmacion) return;

        setLoading(true);
        try {
            await cancelarTurnoTemporalmente(horarioActual.day, horarioActual.hour);
            toast({
                title: 'Turno cancelado',
                description: `No asistirás el ${horarioActual.day} ${horarioActual.hour} hs esta semana.`,
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo cancelar el turno.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarCambioTemporal = async () => {
        const confirmacion = window.confirm(
            '¿Querés deshacer los cambios de esta semana y volver a tus horarios originales?'
        );
        if (!confirmacion) return;

        setLoading(true);
        try {
            await resetUserSelections();
            toast({
                title: 'Volviste a tus horarios originales',
                description: 'Se anuló el cambio temporal y se recuperó el cambio mensual.',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo cancelar el cambio temporal.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarTurnoRecuperado = async () => {
        const confirmacion = window.confirm(
            `¿Querés eliminar tu turno recuperado del ${horarioActual.day} ${horarioActual.hour} hs?\n\nEste turno volverá al estado "pendiente" y podrás reutilizarlo.`
        );
        if (!confirmacion) return;

        setLoading(true);
        try {
            await usuarioEliminarTurnoRecuperado(horarioActual.day, horarioActual.hour);
            toast({
                title: 'Turno recuperado eliminado',
                description: 'El turno volvió a "pendiente". Podrás usarlo en otra semana.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo eliminar el turno recuperado.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // ─── Vista: Turno recuperado ────────────────────────────────────────
    if (esTurnoRecuperado) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent color="brand.primary" fontWeight="bold" w={{ base: '95%', md: 'auto' }}>
                    <ModalHeader textAlign="center">Turno recuperado</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody textAlign="center">
                        <Box bg="yellow.50" border="1px solid" borderColor="yellow.300" borderRadius="md" p={3}>
                            <Text fontSize="sm" color="yellow.800">
                                Este es un turno que recuperaste de una semana anterior.
                                Si lo eliminás, volverá a estar pendiente y podrás elegir otra fecha.
                            </Text>
                        </Box>
                        <Text mt={4} fontSize="sm">
                            <strong>Turno:</strong> {horarioActual?.day} — {horarioActual?.hour} hs
                        </Text>
                    </ModalBody>
                    <ModalFooter justifyContent="center" gap={3}>
                        <Button onClick={onClose} isDisabled={loading}>Cerrar</Button>
                        <Button
                            colorScheme="red"
                            variant="outline"
                            onClick={handleEliminarTurnoRecuperado}
                            isLoading={loading}
                        >
                            Eliminar y volver a pendiente
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }

    // ─── Vista: Turno temporal ───────────────────────────────────────────
    if (esTurnoTemporal) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent color="brand.primary" fontWeight="bold" w={{ base: '95%', md: 'auto' }}>
                    <ModalHeader textAlign="center">Turno cambiado esta semana</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody textAlign="center">
                        <Box bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md" p={3} mb={3}>
                            <Text fontSize="sm" color="red.700">
                                Este turno fue un cambio temporal para esta semana.
                                Si volvés a los originales, se devuelve el cambio mensual.
                            </Text>
                        </Box>
                        <Text fontSize="sm">
                            <strong>Turno temporal:</strong> {horarioActual?.day} — {horarioActual?.hour} hs
                        </Text>
                    </ModalBody>
                    <ModalFooter justifyContent="center" gap={3}>
                        <Button onClick={onClose} isDisabled={loading}>Cerrar</Button>
                        <Button
                            colorScheme="red"
                            onClick={handleCancelarCambioTemporal}
                            isLoading={loading}
                        >
                            Volver a mis horarios originales
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }

    // ─── Vista: Turno original ───────────────────────────────────────────
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent color="brand.primary" fontWeight="bold" w={{ base: '95%', md: 'auto' }}>
                <ModalHeader textAlign="center">
                    ¿Qué querés hacer con este turno?
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Box bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md" p={3} mb={4}>
                        <Text textAlign="center" fontSize="sm" color="green.800">
                            Turno fijo: <strong>{horarioActual?.day} — {horarioActual?.hour} hs</strong>
                        </Text>
                    </Box>

                    {estaBloqueadoPorPago ? (
                        <Box bg="red.50" border="1px solid" borderColor="red.300" borderRadius="md" p={3}>
                            <Text color="red.700" fontSize="sm" textAlign="center">
                                No podés realizar cambios porque tenés el pago pendiente.
                                Regularizá tu situación para poder modificar turnos.
                            </Text>
                        </Box>
                    ) : sinCambios ? (
                        <Box bg="orange.50" border="1px solid" borderColor="orange.300" borderRadius="md" p={3}>
                            <Text color="orange.700" fontSize="sm" textAlign="center">
                                Llegaste al límite de 2 cambios este mes. Igual podés cancelar sin recuperar o guardar para recuperar.
                            </Text>
                        </Box>
                    ) : (
                        <>
                            <Text fontSize="sm" fontWeight="normal" mb={2} color="gray.600">
                                Cambios restantes este mes: <strong>{cambiosRestantes}/2</strong>
                            </Text>
                            <Divider mb={3} />

                            {/* Selector de cambio de turno */}
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Cambiarme a otro horario esta semana:
                            </Text>
                            <Select
                                placeholder="Elegí el nuevo día"
                                size="sm"
                                onChange={(e) => {
                                    setSelectedDay(e.target.value);
                                    setSelectedHour('');
                                }}
                                mb={2}
                            >
                                {diasDisponibles.map(dia => (
                                    <option key={dia} value={dia} disabled={diasBloqueados.has(dia)}>
                                        {dia} {diasBloqueados.has(dia) ? '(Feriado)' : ''}
                                    </option>
                                ))}
                            </Select>

                            {selectedDay && (
                                <Select
                                    size="sm"
                                    placeholder="Elegí el nuevo horario"
                                    value={selectedHour}
                                    onChange={(e) => setSelectedHour(e.target.value)}
                                    mb={3}
                                >
                                    {horasFiltradas.map(hora => {
                                        const key = `${selectedDay}-${hora}`;
                                        const disabled = turnosLlenos.has(key);
                                        return (
                                            <option key={hora} value={hora} disabled={disabled}>
                                                {hora} hs {disabled ? '— Completo' : ''}
                                            </option>
                                        );
                                    })}
                                </Select>
                            )}
                        </>
                    )}

                    {/* Opciones de cancelación siempre visibles si no está bloqueado por pago */}
                    {!estaBloqueadoPorPago && (
                        <>
                            <Divider my={3} />
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                                Opciones de cancelación para esta semana:
                            </Text>
                            <VStack spacing={2} align="stretch">
                                <Box bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="md" p={2}>
                                    <Text fontSize="xs" color="blue.800">
                                        <strong>Guardar para recuperar:</strong> No vas esta semana pero el turno queda guardado para usarlo en otra semana cuando quieras.
                                    </Text>
                                </Box>
                                <Box bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="md" p={2}>
                                    <Text fontSize="xs" color="gray.700">
                                        <strong>Cancelar sin recuperar:</strong> No vas esta semana y el turno se pierde.
                                    </Text>
                                </Box>
                            </VStack>
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Flex wrap="wrap" justifyContent="center" alignItems="center" gap={2} w="100%">
                        <Button onClick={onClose} isDisabled={loading} size="sm">
                            Cerrar
                        </Button>

                        {!estaBloqueadoPorPago && !sinCambios && (
                            <Button
                                colorScheme="teal"
                                onClick={handleSave}
                                isLoading={loading}
                                isDisabled={!selectedDay || !selectedHour}
                                size="sm"
                            >
                                Confirmar cambio de turno
                            </Button>
                        )}

                        {!estaBloqueadoPorPago && (
                            <>
                                <Button
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={handleCancelarYGuardar}
                                    isLoading={loading}
                                    size="sm"
                                >
                                    Guardar para recuperar
                                </Button>
                                <Button
                                    colorScheme="red"
                                    variant="outline"
                                    onClick={handleCancelarSinRecuperar}
                                    isLoading={loading}
                                    size="sm"
                                >
                                    Cancelar sin recuperar
                                </Button>
                            </>
                        )}
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
