// components/Modals/EditSingleTurnModal.js

import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast, Spinner, Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { setUserSelections } from '../../services/calendarAPI';
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
    onUpdate
}) {
    const toast = useToast();
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const nombreC = `${user.nombre} ${user.apellido}`;

    useEffect(() => {
        if (isOpen) {
            setSelectedDay('');
            setSelectedHour('');
        }
    }, [isOpen]);

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

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent color="brand.primary" fontWeight="bold">
                <ModalHeader>Cambiar turno temporalmente</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {horarioActual && (
                        <Text mb={4}>
                            Estás intentando cambiar tu turno actual de: <strong>{horarioActual.day} {horarioActual.hour}</strong>
                        </Text>
                    )}

                    <Select placeholder="Nuevo día" onChange={(e) => {
                        setSelectedDay(e.target.value);
                        setSelectedHour('');
                    }}>
                        {diasDisponibles.map(dia => (
                            <option key={dia} value={dia}>{dia}</option>
                        ))}
                    </Select>

                    {selectedDay && (
                        <Select mt={4} placeholder="Nuevo horario" onChange={(e) => setSelectedHour(e.target.value)}>
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
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onClose}>Cancelar</Button>
                    <Button colorScheme="teal" onClick={handleSave} isLoading={loading}>
                        {loading ? <Spinner size="sm" /> : 'Guardar cambio'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
