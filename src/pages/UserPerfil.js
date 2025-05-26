import { Box, Heading, Text, Badge, VStack, Image, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import logo from '../img/logos/faviconE.png';
import { useNavigate } from "react-router-dom";

const UserPerfil = () => {
    const { user } = useAuth();

    const navigate = useNavigate();

    if (!user) {
        return <Text textAlign="center" mt={10}>Cargando perfil...</Text>;
    }

    const { nombre, apellido, email, diasSemanales, pago } = user;

    return (
        <Box
        w="100%"
        minH="100vh"
        bg="brand.primary"
        display="flex"
        justifyContent="start"
        alignItems="center"
        flexDirection="column"
        px={4}
        py={8}
        >
            <Box
                display="flex"
                justifyContent="center"
                mb={1}
            >
                <Image
                src={logo}
                borderRadius="full"
                w={{ base: "180px", md: "150px" }}
                />
            </Box>

            <Button border='solid 2px' borderColor='brand.secondary' bg='brand.primary' color='brand.secondary' fontWeight='bold'
                onClick={() => navigate("/calendario")}
                mb='50px'
                >
                Volver al Calendario
            </Button>

            <Box
                w="100%"
                maxW="md"
                bg="white"
                p={{ base: 4, md: 6 }}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="md"
            >
                <VStack spacing={4} align="start">
                    <Heading size="md" textAlign="center" w="100%">
                        Perfil de Usuario
                    </Heading>

                    <Box w="100%">
                        <Text fontWeight="bold">Nombre:</Text>
                        <Text textTransform="capitalize">{nombre}</Text>
                    </Box>

                    <Box w="100%">
                        <Text fontWeight="bold">Apellido:</Text>
                        <Text textTransform="capitalize">{apellido}</Text>
                    </Box>

                    <Box w="100%">
                        <Text fontWeight="bold">Días x semana:</Text>
                        <Text>{diasSemanales} días</Text>
                    </Box>

                    <Box w="100%">
                        <Text fontWeight="bold">Email:</Text>
                        <Text>{email}</Text>
                    </Box>

                    <Box w="100%">
                        <Text fontWeight="bold">Estado de Pago:</Text>
                        <Badge colorScheme={pago ? "green" : "red"}>
                        {pago ? "Pagado" : "No Pagado"}
                        </Badge>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
};

export default UserPerfil;

