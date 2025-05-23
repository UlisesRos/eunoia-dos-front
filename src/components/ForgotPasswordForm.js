import { useState } from 'react';
import { Input, Button, Text, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../config';
import axios from 'axios';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);
    const toast = useToast();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/api/auth/forgot-password`, { email });
            setEnviado(true);
            toast({
                title: 'Correo enviado.',
                description: 'Revisá tu bandeja de entrada para continuar.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Ocurrió un error.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack as="form" onSubmit={handleSubmit} spacing={4} w={['80%','60%','50%']} maxW='400px' mx='auto' mt='50px'>
            <Button
                onClick={() => navigate('/')}
                mb={6}
                >
                Volver al Inicio
            </Button>
            {!enviado ? (
                <>
                <Text>Ingresá tu email y te enviaremos un enlace para recuperar tu contraseña.</Text>
                <Input
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                />
                <Button type="submit" colorScheme="teal">Enviar</Button>
                </>
            ) : (
                <Text>Revisá tu correo para cambiar tu contraseña.</Text>
            )}
        </VStack>
    );
};

export default ForgotPasswordForm;
