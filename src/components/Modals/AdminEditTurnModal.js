import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast, Spinner, Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import backendUrl from '../../config';

const API_URL = `${backendUrl}/api/calendar`;

const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horasDisponibles = {
    'Lunes': ['08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    'Martes': ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    'Miércoles': ['08:00', '09:00', '17:00', '18:00', '19:00', '20:00'],
    'Jueves': ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    'Viernes': ['08:00', '09:00', '10:00', '17:00', '18:00', '19:00']
};

export default function AdminEditTurnModal({
    isOpen,
    onClose,
    selectedUser,
    horarioActual,
    onUpdate,
    turnosOcupados = [],
}) {
    const toast = useToast();
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedDay('');
            setSelectedHour('');
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!selectedUser || !selectedDay || !selectedHour) {
            toast({
                title: 'Falta información',
                description: 'Completá todos los campos.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await axios.put(`${API_URL}/admin-mover-usuario`, {
                userFullName: selectedUser.nombre, // ejemplo: "María López"
                current: horarioActual,
                newTurn: { day: selectedDay, hour: selectedHour },
                type: 'original'  // Siempre original
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }
            );

            toast({
                title: 'Cambio aplicado',
                description: `El usuario fue movido a ${selectedDay} ${selectedHour} (permanente)`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onUpdate();
        } catch (err) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'No se pudo aplicar el cambio.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const horasFiltradas = selectedDay ? horasDisponibles[selectedDay] : [];

    const turnosLlenos = new Set(
        turnosOcupados
            .filter(t => t.users.length >= 7 && !t.users.some(u => u.nombre.trim() === selectedUser?.nombre.trim()))
            .map(t => `${t.day}-${t.hour}`)
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent color="brand.primary" fontWeight="bold">
                <ModalHeader>Editar turno permanente del usuario</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mb={2} textTransform='capitalize'><strong>Usuario:</strong> {selectedUser?.nombre.trim()}</Text>
                    <Text mb={4}><strong>Turno actual:</strong> {horarioActual?.day} {horarioActual?.hour}</Text>

                    {/* Ya no mostramos opciones para tipo de turno */}

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
