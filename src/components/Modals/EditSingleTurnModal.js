// components/Modals/EditSingleTurnModal.js
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast, Spinner, Text,
    Flex
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { setUserSelections, resetUserSelections, cancelarTurnoTemporalmente, guardarTurnoParaRecuperar } from '../../services/calendarAPI';
import { useAuth } from '../../context/AuthContext';

const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horasDisponibles = {
    'Lunes': ['08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    'Martes': ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    'Miércoles': ['08:00', '09:00', '17:00', '18:00', '19:00', '20:00'],
    'Jueves': ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    'Viernes': ['08:00', '09:00', '10:00', '17:00', '18:00', '19:00']
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

    useEffect(() => {
        if (isOpen) {
            setSelectedDay('');
            setSelectedHour('');
        }
    }, [isOpen]);

    const diasFeriadosISO = feriados.map(f => f.date);
    const diasBloqueados = new Set();

    // Agregá los días de esta semana marcados como feriados
    weekDates?.forEach(({ dayName, date }) => {
        const iso = new Date(date).toISOString().slice(0, 10);
        if (diasFeriadosISO.includes(iso)) {
            diasBloqueados.add(dayName);
        }
    });

    const handleSave = async () => {
        if (!selectedDay || !selectedHour) {
            toast({
                title: 'Falta información',
                description: 'Elegí día y horario al que querés cambiarte.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (cambiosRestantes <= 0) {
            toast({
                title: 'Límite alcanzado',
                description: 'Ya hiciste 2 cambios este mes.',
                status: 'error',
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
                description: `Te movimos de ${horarioActual.day} ${horarioActual.hour} a ${nuevoTurno.day} ${nuevoTurno.hour}`,
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
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const turnosLlenos = new Set(
        turnosOcupados
            .filter(t => t.users.length >= 7 && !t.users.some(u => u.nombre === nombreC))
            .map(t => `${t.day}-${t.hour}`)
    );

    const horasFiltradas = selectedDay ? horasDisponibles[selectedDay] : [];

    const handleCancelarYGuardar = async () => {
        const confirmacion = window.confirm(`¿Querés guardar el turno de ${horarioActual.day} ${horarioActual.hour} para usarlo en otra semana?`);
        if (!confirmacion) return;

        setLoading(true);
        try {
            await guardarTurnoParaRecuperar(horarioActual.day, horarioActual.hour);
            await cancelarTurnoTemporalmente(horarioActual.day, horarioActual.hour);
            toast({
                title: 'Turno guardado',
                description: 'Podrás recuperar este turno más adelante.',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo guardar el turno.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarSinRecuperar = async () => {
        const confirmacion = window.confirm(`¿Estás seguro de que querés cancelar tu turno de ${horarioActual.day} ${horarioActual.hour} esta semana sin guardarlo?`);
        if (!confirmacion) return;

        setLoading(true);
        try {
            await cancelarTurnoTemporalmente(horarioActual.day, horarioActual.hour);
            toast({
                title: 'Turno cancelado',
                description: `No asistirás a ${horarioActual.day} ${horarioActual.hour} esta semana.`,
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
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarCambioTemporal = async () => {
        const confirmacion = window.confirm('¿Querés cancelar tus cambios temporales y volver a tus horarios originales?');
        if (!confirmacion) return;

        setLoading(true);
        try {
            await resetUserSelections();
            toast({
                title: 'Cambio cancelado',
                description: 'Volviste a tus horarios originales.',
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
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent color="brand.primary" fontWeight="bold" w={{ base: '95%', md: 'auto' }}>
                <ModalHeader
                    textAlign='center'
                    >
                    {esTurnoTemporal ? 'Cancelar turno temporal' : 'Cambiar turno temporalmente'}
                </ModalHeader>
                <ModalCloseButton />
                
                <ModalBody
                    textAlign='center'
                    >
                    {horarioActual && (
                        <Text mb={4}>
                            Estás editando tu turno de: <strong>{horarioActual.day} {horarioActual.hour}</strong>
                        </Text>
                    )}

                    {!esTurnoTemporal && (
                        <>
                            <Text display={!user.pago ? 'block' : 'none'} fontWeight='bold' color='red' mb={4}>
                                No puedes cambiar tu turno porque no has realizado el pago correspondiente.
                            </Text>
                            <Select display={user.pago ? 'block' : 'none' } placeholder="Nuevo día" onChange={(e) => {
                                setSelectedDay(e.target.value);
                                setSelectedHour('');
                            }}>
                                {diasDisponibles.map(dia => (
                                    <option key={dia} value={dia} disabled={diasBloqueados.has(dia)}>
                                        {dia} {diasBloqueados.has(dia) ? ' (Feriado)' : ''}
                                    </option>
                                ))}
                            </Select>

                            {selectedDay && (
                                <Select display={user.pago ? 'block' : 'none' } mt={4} placeholder="Nuevo horario" onChange={(e) => setSelectedHour(e.target.value)}>
                                    {horasFiltradas.map(hora => {
                                        const key = `${selectedDay}-${hora}`;
                                        const disabled = turnosLlenos.has(key);
                                        return (
                                            <option key={hora} value={hora} disabled={disabled}>
                                                {hora} {disabled ? ' (Completo)' : ''}
                                            </option>
                                        );
                                    })}
                                </Select>
                            )}
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Flex
                        wrap="wrap"
                        justifyContent="center"
                        alignItems="center"
                        rowGap={3}
                        >
                        <Button mr={3} onClick={onClose}>Cancelar</Button>

                        {!esTurnoTemporal && (
                            <Button
                                display={user.pago ? 'block' : 'none'}
                                textAlign='center'
                                mr={3}
                                colorScheme="teal"
                                onClick={handleSave}
                                isLoading={loading}
                                >
                                    {loading ? <Spinner size="sm" /> : 'Guardar Cambio'}
                                </Button>
                        )}

                        {!esTurnoTemporal && (
                            <Flex
                                justifyContent='center'
                                alignItems='center'
                                wrap='wrap'
                                w='90%'
                                columnGap={2}
                                rowGap={2}
                                >
                                <Button 
                                    colorScheme="red" 
                                    variant="outline" 
                                    onClick={handleCancelarSinRecuperar} 
                                    isLoading={loading}
                                    >
                                    {loading ? <Spinner size="sm" /> : 'Cancelar sin recuperar'}
                                </Button>

                                <Button 
                                    colorScheme="blue" 
                                    variant="outline" 
                                    onClick={handleCancelarYGuardar} 
                                    isLoading={loading}
                                    >
                                    {loading ? <Spinner size="sm" /> : 'Guardar para recuperar'}
                                </Button>
                            </Flex>

                        )}

                        {esTurnoTemporal && (
                            <Button
                                variant="solid"
                                colorScheme="red"
                                onClick={handleCancelarCambioTemporal}
                                isLoading={loading}
                            >
                                {loading ? <Spinner size="sm" /> : 'Volver a horarios originales'}
                            </Button>
                        )}
                    </Flex>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}
