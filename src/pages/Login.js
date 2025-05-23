import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    VStack,
    useToast,
    Flex,
    Image,
    Link,
    InputGroup,
    InputRightElement,
    IconButton,
    Spinner
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logos/logoE.png';
import { useAuth } from '../context/AuthContext';
import backendUrl from '../config';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [ showPassword, setShowPassword ] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para controlar el loading

    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth(); // Funcion de login del context

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Activar el estado de loading

        if (!formData.email || !formData.password) {
            toast({
                title: 'Error',
                description: 'Todos los campos son obligatorios.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const res = await axios.post(`${backendUrl}/api/auth/login`, formData);

            // Guardamos el usuario y token con el context
            login(res.data.user, res.data.token);

            toast({
                title: 'Bienvenido/a a Eunoia',
                description: `Hola ${res.data.user.nombre.charAt(0).toUpperCase()}${res.data.user.nombre.slice(1).toLowerCase()}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            navigate('/calendario');
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Ocurrió un error al iniciar sesión.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false); // Desactivar el estado de loading
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Flex minH="100vh" flexDir='column' align='center' justify={['start', 'start', 'center']}>
            <Image 
                src={logo}
                objectFit='cover'
                alt="Logo Eudonia"
                borderRadius='full'
                mt={5}
                mb={2}
                onClick={() => navigate('/')}
                cursor='pointer'
            />
            <Box 
                maxW='md' 
                w="full" 
                mt={10}
                mb={10} 
                p={5} 
                boxShadow={['none','none',"0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)" ]}
                borderRadius="md"
            >
                <Heading mb={6} textAlign="center" color='brand.primary'>Iniciar Sesión</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                border='1px solid #6A8677'
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    border='1px solid #6A8677'
                                    onChange={handleChange}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={togglePasswordVisibility}
                                        variant="ghost"
                                        size="sm"
                                    />
                                </InputRightElement>  
                            </InputGroup>
                        </FormControl>

                        <Link as={RouterLink} to="/olvide-contrasena" color='brand.primary'>
                            ¿Olvidaste tu contraseña?
                        </Link>

                        <Button type="submit" colorScheme="teal" width="full"
                            isLoading={loading}
                            spinner={<Spinner size='sm' />} 
                            >
                            {loading ? '' : 'Ingresar'}
                        </Button>

                        <Button onClick={() => navigate('/')} width="full">
                            Volver al Inicio
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default Login;
