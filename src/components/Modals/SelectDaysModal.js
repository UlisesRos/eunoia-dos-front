import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, useToast, Text, Select, Box, VStack,
    Badge, Divider, HStack, Icon
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import { setUserSelections, setOriginalSelections } from '../../services/calendarAPI';

const diasDisponibles = ['Lunes', 'Miércoles', 'Viernes'];
const horasDisponibles = {
    'Lunes': ['18:00', '19:00', '20:00'],
    'Miércoles': ['18:00', '19:00', '20:00'],
    'Viernes': ['18:00', '19:00']
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
    const [loading, setLoading] = useState(false);

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
        if (!selectedDay || !selectedHour) {
            toast({
                title: 'Seleccioná día y hora',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const clave = `${selectedDay}-${selectedHour}`;
        if (turnosLlenos.has(clave)) {
            toast({
                title: 'Turno completo',
                description: 'Ese horario ya está lleno, elegí otro.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const yaExiste = selections.some(s => s.day === selectedDay && s.hour === selectedHour);
        if (yaExiste) {
            toast({
                title: 'Ya agregado',
                description: 'Ese turno ya está en tu lista.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if (selections.length >= diasSemanales) {
            toast({
                title: 'Límite alcanzado',
                description: `Solo podés seleccionar ${diasSemanales} turno${diasSemanales > 1 ? 's' : ''}.`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSelections([...selections, { day: selectedDay, hour: selectedHour }]);
        setSelectedDay('');
        setSelectedHour('');
    };

    const handleEliminar = (day, hour) => {
        setSelections(selections.filter(s => !(s.day === day && s.hour === hour)));
    };

    const handleGuardar = async () => {
        if (selections.length !== diasSemanales) {
            toast({
                title: 'Cantidad incorrecta',
                description: `Debés seleccionar exactamente ${diasSemanales} turno${diasSemanales > 1 ? 's' : ''}.`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            if (modoOriginal) {
                await setOriginalSelections(selections);
                toast({
                    title: 'Turnos permanentes actualizados',
                    description: 'Tus nuevos horarios fijos quedaron guardados.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await setUserSelections(selections);
                toast({
                    title: esPrimerIngreso ? 'Turnos asignados' : 'Cambio temporal guardado',
                    description: esPrimerIngreso
                        ? 'Tus turnos semanales quedaron registrados.'
                        : 'Tus turnos cambiaron para esta semana.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onClose();
            onUpdate?.();
        } catch (error) {
            toast({
                title: 'Error al guardar',
                description: error.response?.data?.message || 'No se pudo guardar la selección.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const restantes = diasSemanales - selections.length;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay bg="blackAlpha.600" />
            <ModalContent>
                <ModalHeader textAlign="center" pb={1}>
                    {esPrimerIngreso
                        ? 'Elegí tus turnos semanales'
                        : modoOriginal
                        ? 'Ajustar turnos permanentes'
                        : 'Cambiar turno'}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    {esPrimerIngreso && (
                        <Box bg="teal.50" border="1px solid" borderColor="teal.200" borderRadius="md" p={3} mb={4}>
                            <Text fontWeight="bold" color="teal.700" textAlign="center">
                                Bienvenido/a al estudio
                            </Text>
                            <Text color="teal.600" textAlign="center" fontSize="sm" mt={1}>
                                Elegí tus {diasSemanales} turno{diasSemanales > 1 ? 's' : ''} fijo{diasSemanales > 1 ? 's' : ''} de la semana. Podrás cambiarlos hasta 2 veces por mes.
                            </Text>
                        </Box>
                    )}

                    {modoOriginal && !esPrimerIngreso && (
                        <Box bg="orange.50" border="1px solid" borderColor="orange.200" borderRadius="md" p={3} mb={4}>
                            <Text fontWeight="bold" color="orange.700" textAlign="center" fontSize="sm">
                                Tus días semanales cambiaron. Ajustá tus turnos permanentes para que coincidan con los nuevos días asignados.
                            </Text>
                        </Box>
                    )}

                    {/* Selector de día y hora */}
                    <Box bg="gray.50" borderRadius="md" p={3} mb={4}>
                        <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.600">
                            Agregar turno ({restantes} {restantes === 1 ? 'lugar restante' : 'lugares restantes'})
                        </Text>
                        <Select
                            placeholder="Seleccioná el día"
                            value={selectedDay}
                            onChange={(e) => {
                                setSelectedDay(e.target.value);
                                setSelectedHour('');
                            }}
                            mb={2}
                            size="sm"
                        >
                            {diasDisponibles.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </Select>

                        {selectedDay && (
                            <Select
                                placeholder="Seleccioná el horario"
                                value={selectedHour}
                                onChange={(e) => setSelectedHour(e.target.value)}
                                mb={2}
                                size="sm"
                            >
                                {(horasDisponibles[selectedDay] || []).map(h => {
                                    const lleno = turnosLlenos.has(`${selectedDay}-${h}`);
                                    return (
                                        <option key={h} value={h} disabled={lleno}>
                                            {h} hs {lleno ? '— Completo' : ''}
                                        </option>
                                    );
                                })}
                            </Select>
                        )}

                        <Button
                            size="sm"
                            colorScheme="teal"
                            w="100%"
                            onClick={handleAgregar}
                            isDisabled={!selectedDay || !selectedHour || restantes <= 0}
                            leftIcon={<Icon as={CheckIcon} />}
                        >
                            Agregar turno
                        </Button>
                    </Box>

                    {/* Lista de turnos seleccionados */}
                    <Divider mb={3} />
                    <Text fontWeight="bold" fontSize="sm" color="gray.600" mb={2}>
                        Turnos seleccionados ({selections.length}/{diasSemanales})
                    </Text>

                    {selections.length === 0 ? (
                        <Text fontSize="sm" color="gray.400" textAlign="center" py={3}>
                            Todavía no agregaste ningún turno
                        </Text>
                    ) : (
                        <VStack spacing={2} align="stretch">
                            {selections.map((s, i) => (
                                <HStack
                                    key={i}
                                    bg="teal.50"
                                    border="1px solid"
                                    borderColor="teal.200"
                                    borderRadius="md"
                                    px={3}
                                    py={2}
                                    justifyContent="space-between"
                                >
                                    <HStack spacing={2}>
                                        <Badge colorScheme="teal" variant="solid" borderRadius="full" w={5} h={5} display="flex" alignItems="center" justifyContent="center" fontSize="xs">
                                            {i + 1}
                                        </Badge>
                                        <Text fontWeight="semibold" fontSize="sm">
                                            {s.day} — {s.hour} hs
                                        </Text>
                                    </HStack>
                                    <Button
                                        size="xs"
                                        colorScheme="red"
                                        variant="ghost"
                                        leftIcon={<DeleteIcon />}
                                        onClick={() => handleEliminar(s.day, s.hour)}
                                    >
                                        Quitar
                                    </Button>
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter gap={2}>
                    <Button variant="ghost" onClick={onClose} isDisabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="teal"
                        onClick={handleGuardar}
                        isLoading={loading}
                        isDisabled={selections.length !== diasSemanales}
                    >
                        Guardar {selections.length === diasSemanales ? '✓' : `(${selections.length}/${diasSemanales})`}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
