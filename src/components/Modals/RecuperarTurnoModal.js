// components/Modals/RecuperarTurnoModal.js
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Select, useToast
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
            t.users.length >= 7 &&
            !t.users.some(u => u.nombre === nombreUsuario)
        )
        .map(t => `${t.day}-${t.hour}`)
    );

    const formatearFecha = (iso) => {
        const date = new Date(iso);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dia = dias[date.getDay()];
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        return `${dia} ${dd}/${mm}`;
    };  

    const horasFiltradas = selectedDay ? horasDisponiblesPorDia[selectedDay] || [] : [];
    
    const handleRecuperar = async () => {
        if (!selectedTurnId || !selectedDay || !selectedHour) {
        toast({
            title: 'Faltan datos',
            description: 'Seleccioná el turno pendiente y un nuevo horario disponible.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });
        return;
        }

        const clave = `${selectedDay}-${selectedHour}`;
        if (turnosLlenos.has(clave)) {
        toast({
            title: 'Turno lleno',
            description: 'Ese horario ya está completo.',
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
            description: 'Tu turno fue asignado correctamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onClose();
        onUpdate();
        } catch (err) {
        toast({
            title: 'Error',
            description: err.response?.data?.message || 'No se pudo recuperar el turno.',
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
            <ModalContent>
                <ModalHeader>Recuperar un turno</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <Select
                    placeholder="Turno pendiente"
                    value={selectedTurnId}
                    onChange={(e) => setSelectedTurnId(e.target.value)}
                    mb={4}
                >
                    {turnosRecuperables.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.cancelDate ? `Recuperar Turno del ${formatearFecha(t.cancelDate)} ${t.originalHour} hs` : ''}
                        </option>
                    ))}
                </Select>

                <Select
                    placeholder="Día para recuperar"
                    value={selectedDay}
                    onChange={(e) => {
                    setSelectedDay(e.target.value);
                    setSelectedHour('');
                    }}
                    mb={4}
                >
                    {Object.keys(horasDisponiblesPorDia).map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                    ))}
                </Select>

                {selectedDay && (
                    <Select
                    placeholder="Hora"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    mb={4}
                    >
                    {horasFiltradas.map(hora => {
                        const clave = `${selectedDay}-${hora}`;
                        const disabled = turnosLlenos.has(clave);
                        return (
                        <option key={hora} value={hora} disabled={disabled}>
                            {hora} {disabled ? '(Lleno)' : ''}
                        </option>
                        );
                    })}
                    </Select>
                )}
                </ModalBody>

                <ModalFooter>
                <Button onClick={onClose} mr={3}>
                    Cancelar
                </Button>
                <Button onClick={handleRecuperar} colorScheme="teal" isLoading={loading}>
                    Recuperar turno
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

