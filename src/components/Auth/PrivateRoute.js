import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Flex
                minH="100vh"
                bg="brand.primary"
                align="center"
                justify="center"
                direction="column"
                gap={4}
            >
                <Box
                    as={motion.div}
                    animate={{ rotate: 360 }}
                    // @ts-ignore
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    w="44px"
                    h="44px"
                    borderRadius="full"
                    border="3px solid"
                    borderColor="brand.secondary"
                    borderTopColor="transparent"
                />
                <Text
                    fontFamily="'Questrial', sans-serif"
                    color="rgba(235,235,235,0.55)"
                    fontSize="sm"
                    letterSpacing="0.1em"
                >
                    Cargando...
                </Text>
            </Flex>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
