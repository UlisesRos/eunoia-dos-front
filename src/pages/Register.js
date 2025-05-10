// src/pages/RegisterPage.jsx
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Heading,
    VStack,
    useToast,
    Image,
    Flex
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logos/logoE.png';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        celular: '',
        diasSemanales: '',
        password: '',
        confirmPassword: '',
    });

    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
        toast({
            title: 'Error',
            description: 'Las contraseñas no coinciden.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
        }

    // Aquí se enviarán los datos al backend con fetch o axios
    console.log('Datos del formulario:', formData);
    };

    return (
        <Flex minH="100vh" flexDir='column' align='center' justify={['start', 'start', 'center']} >
            <Image 
                src={logo}
                objectFit='cover'
                alt="Logo Eudonia"
                borderRadius='full'
                mt={5}  
                onClick={() => navigate('/')}
                cursor='pointer'
                />

            <Box 
                maxW='md'
                w="full" 
                mt={4}
                mb={10} 
                p={5} 
                boxShadow={['none','none',"0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)" ]}
                borderRadius="md"
                >
                <Heading mb={6} textAlign="center" color='brand.primary'>Registro</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Nombre</FormLabel>
                            <Input name="nombre" border='1px solid #6A8677' onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Apellido</FormLabel>
                            <Input name="apellido" border='1px solid #6A8677' onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" name="email" border='1px solid #6A8677' onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Celular</FormLabel>
                            <Input type="tel" name="celular" border='1px solid #6A8677' onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Días semanales</FormLabel>
                            <Select name="diasSemanales" placeholder="Seleccionar..." border='1px solid #6A8677' onChange={handleChange}>
                            <option value="1">1 vez por semana</option>
                            <option value="2">2 veces por semana</option>
                            <option value="3">3 veces por semana</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <Input type="password" name="password" border='1px solid #6A8677' onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Confirmar contraseña</FormLabel>
                            <Input type="password" name="confirmPassword" border='1px solid #6A8677' onChange={handleChange} />
                        </FormControl>

                        <Button type="submit" width="full">
                            Registrarse
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

export default Register;
