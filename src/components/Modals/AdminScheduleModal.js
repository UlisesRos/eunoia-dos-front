import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    ModalCloseButton, Box, Flex, Text, Button, IconButton, Heading,
    Wrap, WrapItem, Spinner, useToast, Tabs, TabList,
    Tab, TabPanels, TabPanel
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { getSchedule, addHourToSchedule, removeHourFromSchedule } from '../../services/calendarAPI';

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

// Genera todos los horarios posibles de 05:00 a 23:00
const ALL_HOURS = Array.from({ length: 19 }, (_, i) => {
    const h = i + 5;
    return `${String(h).padStart(2, '0')}:00`;
});

const DaySchedulePanel = ({ day, hours, onAdd, onRemove, loading }) => {
    const availableToAdd = ALL_HOURS.filter(h => !hours.includes(h));

    return (
        <Box>
            {/* Horarios actuales */}
            <Text
                fontFamily="'Questrial', sans-serif"
                fontSize="xs"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.1em"
                textTransform="uppercase"
                mb={3}
            >
                Horarios activos
            </Text>

            {hours.length === 0 ? (
                <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="gray.400" mb={4}>
                    Sin horarios configurados.
                </Text>
            ) : (
                <Wrap spacing={2} mb={5}>
                    {hours.map(hour => (
                        <WrapItem key={hour}>
                            <Flex
                                align="center"
                                gap={1.5}
                                bg="brand.primary"
                                borderRadius="xl"
                                pl={3}
                                pr={1.5}
                                py={1}
                            >
                                <Text
                                    fontFamily="'Questrial', sans-serif"
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="white"
                                >
                                    {hour} hs
                                </Text>
                                <IconButton
                                    aria-label={`Eliminar ${hour}`}
                                    icon={<DeleteIcon />}
                                    size="xs"
                                    variant="ghost"
                                    color="rgba(255,255,255,0.6)"
                                    _hover={{ color: 'red.300', bg: 'rgba(255,255,255,0.15)' }}
                                    borderRadius="full"
                                    isLoading={loading === `remove-${day}-${hour}`}
                                    onClick={() => onRemove(day, hour)}
                                />
                            </Flex>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

            {/* Agregar horarios */}
            <Text
                fontFamily="'Questrial', sans-serif"
                fontSize="xs"
                fontWeight="700"
                color="gray.500"
                letterSpacing="0.1em"
                textTransform="uppercase"
                mb={3}
            >
                Agregar horario
            </Text>

            {availableToAdd.length === 0 ? (
                <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="gray.400">
                    Ya están todos los horarios disponibles.
                </Text>
            ) : (
                <Wrap spacing={2}>
                    {availableToAdd.map(hour => (
                        <WrapItem key={hour}>
                            <Button
                                size="xs"
                                variant="outline"
                                borderColor="brand.muted"
                                color="brand.dark"
                                borderRadius="xl"
                                fontFamily="'Questrial', sans-serif"
                                fontWeight="600"
                                leftIcon={<AddIcon boxSize={2.5} />}
                                isLoading={loading === `add-${day}-${hour}`}
                                onClick={() => onAdd(day, hour)}
                                _hover={{ bg: 'brand.primary', color: 'white', borderColor: 'brand.primary' }}
                            >
                                {hour}
                            </Button>
                        </WrapItem>
                    ))}
                </Wrap>
            )}
        </Box>
    );
};

const AdminScheduleModal = ({ isOpen, onClose, onScheduleUpdated }) => {
    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        getSchedule()
            .then(data => setSchedule(data))
            .catch(() => toast({ title: 'Error al cargar el horario', status: 'error', duration: 3000, isClosable: true }))
            .finally(() => setIsLoading(false));
    }, [isOpen, toast]);

    const handleAdd = async (day, hour) => {
        setActionLoading(`add-${day}-${hour}`);
        try {
            const res = await addHourToSchedule(day, hour);
            setSchedule(prev => ({ ...prev, [day]: res.hours }));
            toast({ title: `${hour} agregado al ${day}`, status: 'success', duration: 2500, isClosable: true });
            onScheduleUpdated && onScheduleUpdated();
        } catch (err) {
            toast({ title: err.response?.data?.message || 'Error al agregar', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setActionLoading('');
        }
    };

    const handleRemove = async (day, hour) => {
        setActionLoading(`remove-${day}-${hour}`);
        try {
            const res = await removeHourFromSchedule(day, hour);
            setSchedule(prev => ({ ...prev, [day]: res.hours }));
            toast({ title: `${hour} eliminado del ${day}`, status: 'info', duration: 2500, isClosable: true });
            onScheduleUpdated && onScheduleUpdated();
        } catch (err) {
            toast({ title: err.response?.data?.message || 'Error al eliminar', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setActionLoading('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay bg="rgba(0,0,0,0.5)" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
                {/* Header */}
                <Box bg="brand.primary" px={6} pt={5} pb={4}>
                    <ModalCloseButton color="brand.secondary" top={4} right={4} />
                    <ModalHeader p={0}>
                        <Heading
                            fontFamily="'Playfair Display', serif"
                            fontSize="xl"
                            fontWeight="700"
                            color="brand.secondary"
                            letterSpacing="0.04em"
                        >
                            Gestión de Horarios
                        </Heading>
                        <Text
                            fontFamily="'Questrial', sans-serif"
                            fontSize="sm"
                            color="rgba(235,235,235,0.6)"
                            mt={0.5}
                        >
                            Agregar o eliminar horarios permanentes por día
                        </Text>
                    </ModalHeader>
                </Box>

                <ModalBody px={6} py={5} bg="white">
                    {isLoading ? (
                        <Flex justify="center" align="center" py={10}>
                            <Spinner color="brand.primary" size="lg" />
                        </Flex>
                    ) : (
                        <Tabs colorScheme="green" variant="soft-rounded">
                            <TabList gap={1} flexWrap="wrap" mb={5}>
                                {DIAS.map(day => (
                                    <Tab
                                        key={day}
                                        fontFamily="'Questrial', sans-serif"
                                        fontSize="sm"
                                        textTransform="capitalize"
                                        borderRadius="xl"
                                        _selected={{ bg: 'brand.primary', color: 'white' }}
                                    >
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </Tab>
                                ))}
                            </TabList>
                            <TabPanels>
                                {DIAS.map(day => (
                                    <TabPanel key={day} p={0}>
                                        <DaySchedulePanel
                                            day={day}
                                            hours={schedule[day] || []}
                                            onAdd={handleAdd}
                                            onRemove={handleRemove}
                                            loading={actionLoading}
                                        />
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </Tabs>
                    )}
                </ModalBody>

                <ModalFooter bg="white" borderTop="1px solid" borderColor="gray.100">
                    <Button
                        onClick={onClose}
                        bg="brand.primary"
                        color="white"
                        borderRadius="xl"
                        fontFamily="'Questrial', sans-serif"
                        px={6}
                        _hover={{ bg: 'brand.dark' }}
                    >
                        Listo
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AdminScheduleModal;
