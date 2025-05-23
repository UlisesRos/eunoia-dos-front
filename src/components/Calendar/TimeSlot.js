import { Box, Text, Tag } from '@chakra-ui/react';

const TimeSlot = ({ hora, usersInSlot = [] }) => {
    const cantidadMaxima = 7;

    // Rellenamos hasta 7 lugares con 'Libre'
    const lugares = [...usersInSlot];
    while (lugares.length < cantidadMaxima) {
        lugares.push(null);
    }

    console.log('Lugares:', lugares);

    return (
        <Box
            borderWidth="1px"
            borderRadius="md"
            p={{ base: 2, md: 3 }}
            w="100%"
            bg="gray.50"
            _hover={{ bg: 'gray.100' }}
            >
            <Text fontWeight="bold" mb={1}>
                {hora} hs
            </Text>
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {lugares.map((user, i) => (
                    <Tag key={i} colorScheme={user ? 'green' : 'gray'} textTransform='capitalize' fontWeight={user ? 'bold' : 'normal'}>
                        {user || 'Libre'}
                    </Tag>
                ))}
            </Box>
        </Box>
    );
};

export default TimeSlot;
