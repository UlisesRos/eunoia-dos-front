import { useState } from 'react';
import {
    Box, Button, Input, Text, Flex, Heading, FormControl, FormLabel, VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import backendUrl from '../config';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${backendUrl}/api/auth/forgot-password`, { email });
            setEnviado(true);
            toast({
                title: 'Correo enviado',
                description: 'Revisá tu bandeja de entrada.',
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex
            minH="100vh"
            bg="brand.primary"
            align="center"
            justify="center"
            px={4}
            position="relative"
            overflow="hidden"
        >
            <Box position="absolute" top="-100px" right="-100px" w="300px" h="300px"
                borderRadius="full" bg="rgba(255,255,255,0.04)" pointerEvents="none" />
            <Box position="absolute" bottom="-80px" left="-80px" w="250px" h="250px"
                borderRadius="full" bg="rgba(255,255,255,0.04)" pointerEvents="none" />

            <MotionFlex
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                direction="column"
                align="center"
                w="100%"
                maxW="420px"
            >
                <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    textAlign="center"
                    mb={8}
                >
                    <Heading
                        fontFamily="'Playfair Display', serif"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="700"
                        color="brand.secondary"
                        letterSpacing="0.06em"
                    >
                        Recuperar contraseña
                    </Heading>
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize="sm"
                        color="rgba(235,235,235,0.6)"
                        mt={1}
                    >
                        Te enviamos un enlace a tu correo
                    </Text>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    w="100%"
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 6, md: 8 }}
                    boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                >
                    {!enviado ? (
                        <VStack as="form" onSubmit={handleSubmit} spacing={5}>
                            <FormControl isRequired>
                                <FormLabel color="brand.dark">Tu email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    size="lg"
                                    borderRadius="xl"
                                    bg="brand.cream"
                                    border="1.5px solid"
                                    borderColor="brand.muted"
                                    _focus={{
                                        borderColor: "brand.primary",
                                        boxShadow: "0 0 0 2px rgba(106,134,119,0.25)",
                                        bg: "white"
                                    }}
                                    _placeholder={{ color: "gray.400" }}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                w="100%"
                                size="lg"
                                bg="brand.primary"
                                color="white"
                                borderRadius="xl"
                                letterSpacing="0.08em"
                                fontFamily="'Questrial', sans-serif"
                                isLoading={loading}
                                loadingText="Enviando..."
                                _hover={{
                                    bg: "brand.dark",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 24px rgba(74,97,87,0.35)"
                                }}
                                transition="all 0.25s ease"
                            >
                                Enviar enlace
                            </Button>
                        </VStack>
                    ) : (
                        <VStack spacing={4} textAlign="center">
                            <Box fontSize="3xl">✓</Box>
                            <Heading
                                fontFamily="'Playfair Display', serif"
                                fontSize="xl"
                                color="brand.dark"
                            >
                                Correo enviado
                            </Heading>
                            <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="gray.600">
                                Revisá tu bandeja de entrada y seguí el enlace para restablecer tu contraseña.
                            </Text>
                        </VStack>
                    )}
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    mt={5}
                >
                    <Button variant="onGreen" size="md" onClick={() => navigate('/login')} px={8}>
                        ← Volver al inicio de sesión
                    </Button>
                </MotionBox>
            </MotionFlex>
        </Flex>
    );
};

export default ForgotPasswordForm;
