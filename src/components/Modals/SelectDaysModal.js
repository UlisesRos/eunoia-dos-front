
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Checkbox,
    CheckboxGroup,
    VStack,
    useToast,
    Box,
    Spinner
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { setUserSelections } from '../../services/calendarAPI';
import { useAuth } from '../../context/AuthContext';

    const availableDays = [
        { day: 'Lunes', hours: ['08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'] },
        { day: 'Martes', hours: ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'] },
        { day: 'Miércoles', hours: ['08:00', '09:00', '17:00', '18:00', '19:00', '20:00'] },
        { day: 'Jueves', hours: ['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00', '20:00'] },
        { day: 'Viernes', hours: ['08:00', '09:00', '10:00', '17:00', '18:00', '19:00'] },
    ];

    function toKey(day, hour) {
        return `${day}-${hour}`;
    }

    function fromKey(key) {
    const [day, hour] = key.split('-');
    return { day, hour };
    }

    export default function SelectDaysModal({
            isOpen,
            onClose,
            diasSemanales,
            existingSelections,
            cambiosRestantes,
            onUpdate,
            turnosOcupados = [] 
        }) {
        const toast = useToast();
        const [selectedKeys, setSelectedKeys] = useState(new Set());
        const [loading, setLoading] = useState(false); // Estado para controlar el loading

        const { user } = useAuth()

        const { nombre, apellido } = user
        const nombreC = `${nombre} ${apellido}`

        const turnosCompletos = new Set(
            turnosOcupados
                .filter(t => t.users.length >= 7 && !t.users.includes(nombreC))
                .map(t => toKey(t.day, t.hour))
        );


        useEffect(() => {
            if (!isOpen) return;
            const keys = new Set(existingSelections.map(({ day, hour }) => toKey(day, hour)));
            setSelectedKeys(keys);
        }, [isOpen, existingSelections]);

        const toggleSelection = (key) => {
            const newSelected = new Set(selectedKeys);
            if (newSelected.has(key)) {
                newSelected.delete(key);
            } else {
            if (newSelected.size >= diasSemanales) {
                toast({
                title: 'Límite alcanzado',
                description: `Solo puedes seleccionar hasta ${diasSemanales} horarios.`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                });
                return;
            }
            newSelected.add(key);
            }
            setSelectedKeys(newSelected);
        };

        const handleSave = async () => {
            setLoading(true); // Activar el estado de loading
            const selections = Array.from(selectedKeys).map(fromKey);
            if (cambiosRestantes <= 0) {
                toast({
                    title: 'Límite alcanzado',
                    description: 'Ya alcanzaste el máximo de 2 cambios este mes.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
                return; 
            }

            try {
                await setUserSelections(selections);
                toast({
                    title: 'Guardado',
                    description: 'Tus días fueron actualizados.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
                onUpdate();
                window.location.reload(); // Recargar la página para reflejar los cambios
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message || 'No se pudieron guardar los turnos.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false); // Desactivar el estado de loading
            }
        };

        return (
            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent w={{ base: '95%', md: 'auto' }} color='brand.primary' fontWeight='bold'>
                <ModalHeader>Seleccioná tus días y horarios de entrenamiento</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <VStack spacing={4} align="stretch">
                    {availableDays.map(({ day, hours }) => (
                    <div key={day} style={{ textAlign: 'left' }}>
                        <strong>{day}</strong>
                        <CheckboxGroup>
                        <VStack align="start" pl={4} mt='10px'>
                            <Box
                            display="grid"
                            gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                            gap={2}
                            w="100%"
                            >
                            {hours.map((hour) => {
                                const key = toKey(day, hour);
                                const isDisabled = turnosCompletos.has(key);
                                return (
                                <Checkbox
                                    key={key}
                                    isChecked={selectedKeys.has(key)}
                                    onChange={() => toggleSelection(key)}
                                    isDisabled={isDisabled}
                                    borderRadius="md"
                                    px={4}
                                    py={2}
                                    border="1px solid"
                                    borderColor={selectedKeys.has(key) ? 'teal.500' : 'gray.300'}
                                    bg={selectedKeys.has(key) ? 'teal.500' : isDisabled ? 'gray.200' : 'white'}
                                    color={selectedKeys.has(key) ? 'white' : 'brand.primary'}
                                    fontWeight="medium"
                                    _hover={{ bg: isDisabled ? 'gray.200' : selectedKeys.has(key) ? 'teal.600' : 'gray.100' }}
                                    _checked={{ bg: 'brand.primary', color: 'white', borderColor: 'teal.500' }}
                                >
                                    {hour}
                                </Checkbox>
                                );
                            })}
                            </Box>
                        </VStack>
                        </CheckboxGroup>
                    </div>
                    ))}
                </VStack>
                </ModalBody>
                <ModalFooter>
                <Button mr={3} onClick={onClose}>Cancelar</Button>
                <Button colorScheme="teal" onClick={handleSave}
                    isLoading={loading}
                    spinner={<Spinner size='sm' />} 
                    >{loading ? '' : 'Guardar'}</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        );
    }
