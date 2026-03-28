import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
    Button, Select, VStack, Box, Text, useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import backendUrl from '../../config';

const ModalEditarUsuario = ({ isOpen, onClose, user, onUsuarioActualizado }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        celular: '',
        email: '',
        diasSemanales: '',
    });

    const toast = useToast();

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                apellido: user.apellido || '',
                celular: user.celular || '',
                email: user.email || '',
                diasSemanales: user.diasSemanales || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${backendUrl}/api/usuarios/edit/${user._id}`, formData);
            toast({
                title: 'Usuario actualizado',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onUsuarioActualizado(user._id, formData);
            onClose();
        } catch (err) {
            console.error(err);
            toast({
                title: 'Error al actualizar usuario',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const inputProps = {
        size: 'md',
        borderRadius: 'xl',
        bg: 'brand.cream',
        border: '1.5px solid',
        borderColor: 'brand.muted',
        fontFamily: "'Questrial', sans-serif",
        _focus: {
            borderColor: 'brand.primary',
            boxShadow: '0 0 0 2px rgba(106,134,119,0.25)',
            bg: 'white',
        },
        _placeholder: { color: 'gray.400' },
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="rgba(0,0,0,0.5)" backdropFilter="blur(4px)" />
            <ModalContent
                borderRadius="2xl"
                boxShadow="0 20px 60px rgba(0,0,0,0.2)"
                w={['90%', '80%', '480px']}
                overflow="hidden"
            >
                <Box bg="brand.primary" px={6} pt={5} pb={4}>
                    <ModalCloseButton color="brand.secondary" top={4} right={4} />
                    <ModalHeader p={0}>
                        <Text
                            fontFamily="'Playfair Display', serif"
                            fontSize="xl"
                            fontWeight="700"
                            color="brand.secondary"
                            letterSpacing="0.04em"
                        >
                            Editar usuario
                        </Text>
                        {user && (
                            <Text
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="rgba(235,235,235,0.55)"
                                mt={0.5}
                                textTransform="capitalize"
                            >
                                {user.nombre} {user.apellido}
                            </Text>
                        )}
                    </ModalHeader>
                </Box>

                <ModalBody px={6} py={5} bg="white">
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="brand.dark"
                                fontWeight="600"
                                letterSpacing="0.04em"
                            >
                                Nombre
                            </FormLabel>
                            <Input name="nombre" value={formData.nombre} onChange={handleChange} {...inputProps} />
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="brand.dark"
                                fontWeight="600"
                                letterSpacing="0.04em"
                            >
                                Apellido
                            </FormLabel>
                            <Input name="apellido" value={formData.apellido} onChange={handleChange} {...inputProps} />
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="brand.dark"
                                fontWeight="600"
                                letterSpacing="0.04em"
                            >
                                Celular
                            </FormLabel>
                            <Input name="celular" value={formData.celular} onChange={handleChange} {...inputProps} />
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="brand.dark"
                                fontWeight="600"
                                letterSpacing="0.04em"
                            >
                                Email
                            </FormLabel>
                            <Input name="email" value={formData.email} onChange={handleChange} {...inputProps} />
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="brand.dark"
                                fontWeight="600"
                                letterSpacing="0.04em"
                            >
                                Días semanales
                            </FormLabel>
                            <Select
                                name="diasSemanales"
                                value={formData.diasSemanales}
                                onChange={handleChange}
                                placeholder="Seleccioná cantidad"
                                {...inputProps}
                            >
                                <option value="1">1 día por semana</option>
                                <option value="2">2 días por semana</option>
                                <option value="3">3 días por semana</option>
                            </Select>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter bg="white" px={6} pb={5} pt={2} gap={3} borderTop="1px solid" borderColor="gray.100">
                    <Button
                        onClick={handleUpdate}
                        bg="brand.primary"
                        color="white"
                        borderRadius="xl"
                        fontFamily="'Questrial', sans-serif"
                        letterSpacing="0.06em"
                        px={6}
                        _hover={{ bg: 'brand.dark', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(74,97,87,0.35)' }}
                        transition="all 0.2s ease"
                    >
                        Guardar cambios
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        borderColor="brand.muted"
                        color="brand.dark"
                        borderRadius="xl"
                        fontFamily="'Questrial', sans-serif"
                        _hover={{ bg: 'brand.cream' }}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalEditarUsuario;
