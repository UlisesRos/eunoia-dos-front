import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Input, Textarea, useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import backendUrl from '../../config';

const API_URL = `${backendUrl}/api/info`;

const AdminInfoModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async () => {
        if (!title || !description) {
            toast({
                title: 'Faltan datos',
                description: 'El título y la descripción son obligatorios.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/info-modal`, { title, description, link });
            toast({
                title: 'Novedad publicada',
                description: 'La información fue guardada correctamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setTitle('');
            setDescription('');
            setLink('');
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'No se pudo guardar la novedad.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        const confirm = window.confirm('¿Estás seguro de que querés borrar todas las novedades?');
        if (!confirm) return;

        setLoading(true);
        try {
            await axios.post(`${API_URL}/info-modal/clear`);
            toast({
                title: 'Novedades eliminadas',
                description: 'Ya no se mostrará ninguna novedad a los usuarios.',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            toast({
                title: 'Error',
                description: 'No se pudieron eliminar las novedades.',
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
                <ModalHeader>Crear nueva novedad</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" gap={4}>
                    <Input
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                        placeholder="Link (opcional)"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading}>
                        Publicar
                    </Button>
                    <Button
                        colorScheme="red"
                        variant="outline"
                        ml={3}
                        onClick={handleClearAll}
                        isLoading={loading}
                    >
                        Borrar Novedades
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AdminInfoModal;
