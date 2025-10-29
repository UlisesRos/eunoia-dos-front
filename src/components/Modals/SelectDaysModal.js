import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, useToast, Text, Select, Box, VStack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { setUserSelections, setOriginalSelections } from '../../services/calendarAPI';

const diasDisponibles = ['Lunes', 'Miércoles'];
const horasDisponibles = {
    'Lunes': ['17:00', '18:00', '19:00', '20:00'],
    'Miércoles': ['17:00', '18:00', '19:00', '20:00'],
    'Viernes': ['17:00', '18:00', '19:00'],
};

export default function SelectDaysModal({
    isOpen,
    onClose,
    diasSemanales,
    existingSelections = [],
    turnosOcupados = [],
    modoOriginal = false,
    esPrimerIngreso = false,
    onUpdate
}) {
    const toast = useToast();
    const [selections, setSelections] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelections(existingSelections || []);
            setSelectedDay('');
            setSelectedHour('');
        }
    }, [isOpen, existingSelections]);

    const turnosLlenos = new Set(
        turnosOcupados
            .filter(t => t.users.length >= 4)
            .map(t => `${t.day}-${t.hour}`)
    );

    const handleAgregar = () => {
        if (!selectedDay || !selectedHour) return;

        const clave = `${selectedDay}-${selectedHour}`;
        if (turnosLlenos.has(clave)) {
            toast({
                title: 'Turno completo',
                description: 'Ese horario ya está lleno.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const yaExiste = selections.some(s => s.day === selectedDay && s.hour === selectedHour);
        if (yaExiste) return;

        if (selections.length >= diasSemanales) {
            toast({
                title: 'Límite alcanzado',
                description: `Solo podés seleccionar ${diasSemanales} turnos.`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSelections([...selections, { day: selectedDay, hour: selectedHour }]);
    };

    const handleEliminar = (day, hour) => {
        const nuevas = selections.filter(s => !(s.day === day && s.hour === hour));
        setSelections(nuevas);
    };

    const handleGuardar = async () => {
        if (selections.length !== diasSemanales) {
            toast({
                title: 'Cantidad incorrecta',
                description: `Debés seleccionar exactamente ${diasSemanales} turnos.`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;         
        }

        try {
            if (modoOriginal) {
                await setOriginalSelections(selections);
                toast({
                    title: 'Turnos originales actualizados',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await setUserSelections(selections);
                toast({
                    title: 'Cambio temporal guardado',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }

            onClose();
            onUpdate?.();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo guardar la selección.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">
                    {esPrimerIngreso ? 'Elegí tus turnos semanales' : 'Ajustar turnos originales'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {esPrimerIngreso ? (
                        <Text fontWeight="bold" color="teal.500" mb={4} textAlign="center">
                            Bienvenido/a. Elegí tus turnos semanales permanentes para comenzar.
                        </Text>
                    ) : modoOriginal ? (
                        <Text fontWeight="bold" color="yellow.400" mb={4} textAlign="center">
                            Tus días semanales cambiaron. Por favor, ajustá tus turnos originales.
                        </Text>
                    ) : null}


                    <Select placeholder="Día" onChange={(e) => {
                        setSelectedDay(e.target.value);
                        setSelectedHour('');
                    }} mb={3}>
                        {diasDisponibles.map(d => <option key={d} value={d}>{d}</option>)}
                    </Select>

                    {selectedDay && (
                        <Select placeholder="Hora" value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} mb={3}>
                            {(horasDisponibles[selectedDay] || []).map(h => {
                                const lleno = turnosLlenos.has(`${selectedDay}-${h}`);
                                return (
                                    <option key={h} value={h} disabled={lleno}>
                                        {h} {lleno ? '(Lleno)' : ''}
                                    </option>
                                );
                            })}
                        </Select>
                    )}

                    <Button size="sm" onClick={handleAgregar} mb={4}>
                        Agregar turno
                    </Button>

                    <VStack spacing={2} align="start">
                        {selections.map((s, i) => (
                            <Box key={i} w="100%" display="flex" justifyContent="space-between" alignItems="center">
                                <Text>{s.day} - {s.hour}</Text>
                                <Button size="xs" colorScheme="red" onClick={() => handleEliminar(s.day, s.hour)}>Eliminar</Button>
                            </Box>
                        ))}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} mr={3}>Cancelar</Button>
                    <Button colorScheme="teal" onClick={handleGuardar}>Guardar turnos</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
