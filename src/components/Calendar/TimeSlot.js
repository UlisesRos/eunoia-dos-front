import { Box, Text, Tag, Tooltip } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';


const TimeSlot = ({ hora, usersInSlot = [], currentUser, onNombreClick, dia }) => {
    const cantidadMaxima = 7;
    const lugares = [...usersInSlot];

    const { user: authUser } = useAuth();
    const esAdmin = authUser?.rol === 'admin';

    while (lugares.length < cantidadMaxima) {
        lugares.push(null);
    }

    return (
        <Box
        borderWidth="1px"
        borderRadius="md"
        p={{ base: 2, md: 3 }}
        w="100%"
        bg="gray.50"
        _hover={{ bg: 'gray.100' }}
        >
            <Text
                fontWeight="bold"
                mb={2}
                fontSize={{ base: 'sm', md: 'md' }}
                textAlign="center"
            >
                {hora} hs
            </Text>

            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={2}
            >
                {lugares.map((user, i) => {
                    const esActual = user && user.nombre === currentUser;
                    const esClickeable = esAdmin || (user && user.nombre === currentUser);

                    const tag = (
                        <Tag
                            key={i}
                            colorScheme={
                                !user ? 'gray'
                                : user.tipo === 'original' ? 'green'
                                : 'red'
                            }
                            border={user ? esActual ? '1.5px solid black' : 'none' : 'none'}
                            textTransform='capitalize'
                            color='black'
                            fontWeight={user ? 'bold' : 'normal'}
                            fontSize={{ base: 'xs', md: 'sm' }}
                            px={3}
                            py={1}
                            maxW="150px"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            cursor={esActual || esAdmin ? 'pointer' : 'default'}
                            onClick={() => {
                                if (user && esClickeable && onNombreClick) {
                                    onNombreClick(dia, hora, user); 
                                }
                            }}
                            boxShadow={esActual || esAdmin ? "lg" : "none"}
                            transition="all 0.2s ease"
                            _hover={esActual || esAdmin ? {
                                transform: "scale(1.1)",
                                boxShadow: "xl",
                                zIndex: 1,
                                bg: 'blue.300'
                            } : {}}
                        >
                            {user ? user.nombre : 'Libre'}
                        </Tag>
                    );

                    return esActual ? (
                        <Tooltip key={i} label="Realizar cambio semanal" hasArrow placement="top">
                            {tag}
                        </Tooltip>
                    ) : tag;
                })}
            </Box>
        </Box>
    );
};

export default TimeSlot;


