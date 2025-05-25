import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    VStack,
    Input,
    Button,
    useToast,
    FormControl,
    FormLabel,
    Heading
} from '@chakra-ui/react';
import axios from 'axios';
import backendUrl from '../config';

const ResetPasswordFrom = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();

        // Validación previa en frontend
        if (password !== confirmarPassword) {
            toast({
                title: 'Error',
                description: 'Las contraseñas no coinciden.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/auth/reset-password/${token}`, {
                password,
                confirmarPassword
            });

            toast({
                title: 'Éxito',
                description: res.data.message,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            navigate('/login');
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Ocurrió un error.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            } finally {
            setLoading(false);
        }
    };

    return (
        <VStack as="form" onSubmit={handleReset} spacing={4} mt={8} maxW="md" mx="auto">
            <Heading size="md">Restablecer Contraseña</Heading>

            <FormControl>
                <FormLabel>Nueva Contraseña</FormLabel>
                <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </FormControl>

            <FormControl>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
                />
            </FormControl>

            <Button
                type="submit"
                colorScheme="teal"
                isLoading={loading}
            >
                Guardar nueva contraseña
            </Button>
        </VStack>
    );
};

export default ResetPasswordFrom;
