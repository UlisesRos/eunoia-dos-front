import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Select
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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={['90%', '80%', '60%']}>
            <ModalHeader>Editar Usuario</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl mb={3}>
                    <FormLabel>Nombre</FormLabel>
                    <Input name="nombre" value={formData.nombre} onChange={handleChange} />
                </FormControl>
                <FormControl mb={3}>
                    <FormLabel>Apellido</FormLabel>
                    <Input name="apellido" value={formData.apellido} onChange={handleChange} />
                </FormControl>
                <FormControl mb={3}>
                    <FormLabel>Celular</FormLabel>
                    <Input name="celular" value={formData.celular} onChange={handleChange} />
                </FormControl>
                <FormControl mb={3}>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" value={formData.email} onChange={handleChange} />
                </FormControl>
                <FormControl mb={3}>
                    <FormLabel>Días semanales</FormLabel>
                    <Select
                        name="diasSemanales"
                        value={formData.diasSemanales}
                        onChange={handleChange}
                        placeholder="Seleccioná cantidad"
                    >
                        <option value="1">1 día</option>
                        <option value="2">2 días</option>
                        <option value="3">3 días</option>
                    </Select>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
                    Guardar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
};

export default ModalEditarUsuario;
