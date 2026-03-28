import {
    Box, Button, FormControl, FormLabel, Input, Heading, VStack,
    useToast, Flex, Image, Text, InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import logo from '../img/logos/logoE.png';
import { useAuth } from '../context/AuthContext';
import backendUrl from '../config';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast({ title: 'Completá todos los campos', status: 'warning', duration: 3000, isClosable: true });
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/auth/login`, formData);
            login(res.data.user, res.data.token);
            toast({
                title: `Bienvenida, ${res.data.user.nombre.charAt(0).toUpperCase()}${res.data.user.nombre.slice(1)}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/calendario');
        } catch (error) {
            toast({
                title: 'Error al ingresar',
                description: error.response?.data?.message || 'Ocurrió un error.',
                status: 'error',
                duration: 4000,
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
            position="relative"
            overflow="hidden"
            px={4}
            py={10}
        >
            {/* Círculos decorativos */}
            <Box position="absolute" top="-100px" right="-100px" w="350px" h="350px"
                borderRadius="full" bg="rgba(255,255,255,0.04)" pointerEvents="none" />
            <Box position="absolute" bottom="-80px" left="-80px" w="280px" h="280px"
                borderRadius="full" bg="rgba(255,255,255,0.04)" pointerEvents="none" />

            <MotionFlex
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                direction="column"
                align="center"
                w="100%"
                maxW="420px"
            >
                {/* Logo */}
                <MotionBox
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    mb={6}
                    cursor="pointer"
                    onClick={() => navigate('/')}
                    className="anim-float"
                >
                    <Image
                        src={logo}
                        borderRadius="full"
                        w="90px"
                        boxShadow="0 8px 30px rgba(0,0,0,0.2)"
                        border="3px solid rgba(255,255,255,0.15)"
                    />
                </MotionBox>

                {/* Título */}
                <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    textAlign="center"
                    mb={8}
                >
                    <Heading
                        fontFamily="'Playfair Display', serif"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="700"
                        color="brand.secondary"
                        letterSpacing="0.08em"
                        textShadow="0 2px 12px rgba(0,0,0,0.1)"
                    >
                        Bienvenida
                    </Heading>
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize="sm"
                        color="rgba(235,235,235,0.6)"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        mt={1}
                    >
                        Ingresá a tu cuenta
                    </Text>
                </MotionBox>

                {/* Card del formulario */}
                <MotionBox
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3 }}
                    w="100%"
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 6, md: 8 }}
                    boxShadow="0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)"
                    border="1px solid rgba(255,255,255,0.6)"
                >
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={5}>
                            <FormControl isRequired>
                                <FormLabel color="brand.dark">Email</FormLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    onChange={handleChange}
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

                            <FormControl isRequired>
                                <FormLabel color="brand.dark">Contraseña</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Tu contraseña"
                                        onChange={handleChange}
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
                                    <InputRightElement>
                                        <IconButton
                                            aria-label="Mostrar contraseña"
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            size="sm"
                                            color="brand.primary"
                                            _hover={{ bg: "transparent" }}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            {/* Link olvidé contraseña */}
                            <Box w="100%" textAlign="right" mt={-2}>
                                <Text
                                    as={RouterLink}
                                    to="/olvide-contrasena"
                                    fontSize="xs"
                                    color="brand.primary"
                                    fontFamily="'Questrial', sans-serif"
                                    letterSpacing="0.02em"
                                    _hover={{ textDecoration: "underline" }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Text>
                            </Box>

                            {loading && (
                                <Text
                                    fontFamily="'Questrial', sans-serif"
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                    mt={-2}
                                >
                                    Esto puede demorar unos segundos...
                                </Text>
                            )}
                            <Button
                                type="submit"
                                w="100%"
                                size="lg"
                                bg="brand.primary"
                                color="white"
                                borderRadius="xl"
                                letterSpacing="0.1em"
                                fontFamily="'Questrial', sans-serif"
                                isLoading={loading}
                                loadingText="Conectando..."
                                _hover={{
                                    bg: "brand.dark",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 24px rgba(74,97,87,0.35)"
                                }}
                                _active={{ transform: "translateY(0)" }}
                                transition="all 0.25s ease"
                            >
                                Ingresar
                            </Button>
                        </VStack>
                    </form>
                </MotionBox>

                {/* Volver */}
                <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    mt={5}
                >
                    <Button
                        variant="onGreen"
                        size="md"
                        onClick={() => navigate('/')}
                        px={8}
                    >
                        ← Volver al inicio
                    </Button>
                </MotionBox>
            </MotionFlex>
        </Flex>
    );
};

export default Login;
