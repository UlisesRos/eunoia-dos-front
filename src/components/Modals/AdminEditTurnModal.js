import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast, Spinner, Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import backendUrl from '../../config';

const API_URL = `${backendUrl}/api/calendar`;

const diasDisponibles = ['Lunes', 'Miércoles', 'Viernes'];
const horasDisponibles = {
    'Lunes': ['18:00', '19:00', '20:00'],
    'Miércoles': ['18:00', '19:00', '20:00'],
    'Viernes': ['17:00', '18:00', '19:00'],
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

    const handleAdminCancelarTurno = async () => {
    const confirmacion = window.confirm(
        `¿Querés cancelar el turno de ${selectedUser?.nombre.trim()} el ${horarioActual?.day} a las ${horarioActual?.hour} solo por esta semana?`
    );
    if (!confirmacion) return;

    setLoading(true);
    try {
        await axios.post(`${API_URL}/admin-cancelar-temporalmente`, {
            userFullName: selectedUser?.nombre.trim(), // ej: "María López"
            day: horarioActual?.day,
            hour: horarioActual?.hour
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        toast({
            title: 'Turno cancelado',
            description: `Se canceló el turno de ${selectedUser?.nombre.trim()} para esta semana.`,
            status: 'info',
            duration: 3000,
            isClosable: true,
        });

        onClose();
        onUpdate();
    } catch (err) {
        toast({
            title: 'Error',
            description: err.response?.data?.message || 'No se pudo cancelar el turno.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } finally {
        setLoading(false);
    }
};

const handleEliminarTurnoRecuperado = async () => {
    const confirmacion = window.confirm(
        `¿Querés eliminar el turno recuperado de ${selectedUser?.nombre.trim()}?
        El usuario podrá volver a usarlo más adelante.`
    );
    if(!confirmacion) return;

    setLoading(true);
    try {
        
        await axios.post(`${API_URL}/admin-eliminar-turno-recuperado`, {
            userFullName: selectedUser?.nombre.trim(),
            day: horarioActual?.day,
            hour: horarioActual?.hour
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        toast({
            title: 'Turno recuperado eliminado',
            description: `El turno recuperado de ${selectedUser?.nombre.trim()} fue eliminado. Ahora el usuario puede volver a usarlo.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        onClose();
        onUpdate();

    } catch (err) {
        toast({
            title: 'Error',
            description: err.response?.data?.message || 'No se pudo eliminar el turno recuperado.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } finally {
        setLoading(false);
    }
}

const handleResetToOriginals = async () => {
    const confirmacion = window.confirm(
        `¿Querés eliminar todos los turnos temporales de ${selectedUser?.nombre.trim()} y devolverle el cambio mensual?`
    );
    if (!confirmacion) return;

    setLoading(true);
    try {
        await axios.post(`${API_URL}/admin-reset-a-originales`, {
            userFullName: selectedUser?.nombre.trim()
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        toast({
            title: 'Restaurado',
            description: `Se restauraron los turnos originales de ${selectedUser?.nombre.trim()}.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        onClose();
        onUpdate();
    } catch (err) {
        toast({
            title: 'Error',
            description: err.response?.data?.message || 'No se pudo restaurar los turnos.',
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
            .filter(t => t.users.length >= 4 && !t.users.some(u => u.nombre.trim() === selectedUser?.nombre.trim()))
            .map(t => `${t.day}-${t.hour}`)
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            {
                selectedUser && selectedUser.tipo === 'recuperado' ? (
                    <ModalContent color="brand.primary" fontWeight="bold">
                        <ModalHeader>Eliminar turno recuperado</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text mb={2} textTransform='capitalize'><strong>Usuario:</strong> {selectedUser?.nombre.trim()}</Text>
                            <Text mb={4}><strong>Turno actual:</strong> {horarioActual?.day} {horarioActual?.hour}</Text>
                        </ModalBody>
                        <ModalFooter display='flex' flexWrap='wrap' justifyContent='center' alignItems='center' gap={3} w='100%'>
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={handleEliminarTurnoRecuperado}
                                isLoading={loading}
                                >
                                    {loading ? <Spinner size="sm" /> : 'Cancelar Turno Recuperado'}
                            </Button>

                        </ModalFooter>
                    </ModalContent>
                ) : (
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
                        <ModalFooter display='flex' flexWrap='wrap' justifyContent='center' alignItems='center' gap={3} w='100%'>
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button colorScheme="teal" onClick={handleSave} isLoading={loading}>
                                {loading ? <Spinner size="sm" /> : 'Guardar cambio'}
                            </Button>
                            <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={handleAdminCancelarTurno}
                                isLoading={loading}
                                >
                                    {loading ? <Spinner size="sm" /> : 'Cancelar Turno'}
                            </Button>
                            <Button
                                colorScheme="yellow"
                                variant="outline"
                                onClick={handleResetToOriginals}
                                isLoading={loading}
                                >
                                    {loading ? <Spinner size="sm" /> : 'Restaurar a originales'}
                                </Button>

                        </ModalFooter>
                    </ModalContent>
                )
            }
        </Modal>
    );
}
