import {
    Box, Button, FormControl, FormLabel, Input, Select, Heading, VStack,
    useToast, Image, Flex, Text, InputGroup, InputRightElement, IconButton,
    SimpleGrid
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import logo from '../img/logos/logoE.png';
import backendUrl from '../config';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', email: '',
        celular: '', diasSemanales: '', password: '', confirmarPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmarPassword) {
            toast({ title: 'Las contraseñas no coinciden', status: 'error', duration: 3000, isClosable: true });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/auth/register`, {
                ...formData,
                diasSemanales: Number(formData.diasSemanales),
            });
            if (response.status === 201) {
                toast({ title: 'Registro exitoso', description: 'Ya podés iniciar sesión.', status: 'success', duration: 3000, isClosable: true });
                navigate('/login');
            }
        } catch (error) {
            toast({
                title: 'Error al registrarse',
                description: error.response?.data?.message || 'Error al registrar.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const inputProps = {
        size: "md",
        borderRadius: "xl",
        bg: "brand.cream",
        border: "1.5px solid",
        borderColor: "brand.muted",
        _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 2px rgba(106,134,119,0.25)",
            bg: "white"
        },
        _placeholder: { color: "gray.400" },
    };

    return (
        <Flex
            minH="100vh"
            bg="brand.primary"
            align={{ base: "flex-start", md: "center" }}
            justify="center"
            position="relative"
            overflow="hidden"
            px={4}
            py={10}
        >
            {/* Decoración fondo */}
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
                maxW="500px"
            >
                {/* Logo */}
                <MotionBox
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    mb={5}
                    cursor="pointer"
                    onClick={() => navigate('/')}
                    className="anim-float"
                >
                    <Image
                        src={logo}
                        borderRadius="full"
                        w="80px"
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
                    mb={7}
                >
                    <Heading
                        fontFamily="'Playfair Display', serif"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="700"
                        color="brand.secondary"
                        letterSpacing="0.06em"
                    >
                        Crear cuenta
                    </Heading>
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize="sm"
                        color="rgba(235,235,235,0.6)"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        mt={1}
                    >
                        Completá tus datos para registrarte
                    </Text>
                </MotionBox>

                {/* Card formulario */}
                <MotionBox
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3 }}
                    w="100%"
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 6, md: 8 }}
                    boxShadow="0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)"
                >
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                                <FormControl isRequired>
                                    <FormLabel color="brand.dark">Nombre</FormLabel>
                                    <Input name="nombre" placeholder="Ana" onChange={handleChange} {...inputProps} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="brand.dark">Apellido</FormLabel>
                                    <Input name="apellido" placeholder="García" onChange={handleChange} {...inputProps} />
                                </FormControl>
                            </SimpleGrid>

                            <FormControl isRequired>
                                <FormLabel color="brand.dark">Email</FormLabel>
                                <Input type="email" name="email" placeholder="tu@email.com" onChange={handleChange} {...inputProps} />
                            </FormControl>

                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="100%">
                                <FormControl isRequired>
                                    <FormLabel color="brand.dark">Celular</FormLabel>
                                    <Input
                                        type="tel"
                                        name="celular"
                                        placeholder="3413000000"
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        {...inputProps}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="brand.dark">Días por semana</FormLabel>
                                    <Select
                                        name="diasSemanales"
                                        placeholder="Seleccioná"
                                        onChange={handleChange}
                                        {...inputProps}
                                    >
                                        <option value="1">1 vez por semana</option>
                                        <option value="2">2 veces por semana</option>
                                        <option value="3">3 veces por semana</option>
                                    </Select>
                                </FormControl>
                            </SimpleGrid>

                            <FormControl isRequired>
                                <FormLabel color="brand.dark">Contraseña</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                                        onChange={handleChange}
                                        {...inputProps}
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

                            <FormControl isRequired>
                                <FormLabel color="brand.dark">Confirmar contraseña</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmarPassword"
                                        placeholder="Repetí tu contraseña"
                                        onChange={handleChange}
                                        {...inputProps}
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

                            {loading && (
                                <Text
                                    fontFamily="'Questrial', sans-serif"
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
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
                                mt={2}
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
                                Registrarse
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
                    <Button variant="onGreen" size="md" onClick={() => navigate('/')} px={8}>
                        ← Volver al inicio
                    </Button>
                </MotionBox>
            </MotionFlex>
        </Flex>
    );
};

export default Register;
