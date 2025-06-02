import { Box, Text, Tag } from '@chakra-ui/react';

const TimeSlot = ({ hora, usersInSlot = [], currentUser }) => {
    const cantidadMaxima = 7;
    const lugares = [...usersInSlot];

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
                {lugares.map((user, i) => (
                <Tag
                    key={i}
                    colorScheme={user ? user === currentUser ? 'red' : 'green' : 'gray'}
                    color='black'
                    textTransform="capitalize"
                    fontWeight={user ? 'bold' : 'normal'}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    px={3}
                    py={1}
                    maxW="150px"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    >
                    {user || 'Libre'}
                </Tag>
                ))}
            </Box>
        </Box>
    );
};

export default TimeSlot;


