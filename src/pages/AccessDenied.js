import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <Box textAlign="center" py={20} px={6}>
            <Heading as="h2" size="2xl" mb={4} color="red.500">
                Acceso Denegado
            </Heading>
            <Text fontSize="lg" mb={6}>
                No tenés permisos para acceder a esta sección.
            </Text>
            <Button as={Link} to="/" colorScheme="teal">
                Volver al inicio
            </Button>
        </Box>
    );
};

export default AccessDenied;
