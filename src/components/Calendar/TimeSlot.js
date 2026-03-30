import { Box, Text, Tooltip, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MotionBox = motion(Box);

const tipoColor = {
    original: {
        bg: 'rgba(72,187,120,0.28)',
        border: 'rgba(72,187,120,0.65)',
        color: '#c6f6d5',
    },
    recuperado: {
        bg: 'rgba(99,179,237,0.28)',
        border: 'rgba(99,179,237,0.65)',
        color: '#bee3f8',
    },
    temporal: {
        bg: 'rgba(252,129,74,0.28)',
        border: 'rgba(252,129,74,0.6)',
        color: '#fed7d7',
    },
};

const UserChip = ({ user, esActual, esClickeable, onClick, highlighted }) => {
    const colors = tipoColor[user.tipo] || tipoColor.original;

    const chip = (
        <MotionBox
            as="span"
            display="inline-flex"
            alignItems="center"
            px={2}
            py={0.5}
            borderRadius="lg"
            fontSize="xs"
            fontFamily="'Questrial', sans-serif"
            fontWeight={esActual || highlighted ? '700' : '600'}
            letterSpacing="0.02em"
            textTransform="capitalize"
            bg={highlighted ? 'rgba(235,235,235,0.25)' : colors.bg}
            border="1px solid"
            borderColor={highlighted ? 'rgba(235,235,235,0.9)' : esActual ? colors.border : 'rgba(255,255,255,0.15)'}
            color={highlighted ? '#ffffff' : colors.color}
            cursor={esClickeable ? 'pointer' : 'default'}
            maxW="140px"
            overflow="hidden"
            whiteSpace="nowrap"
            style={{ textOverflow: 'ellipsis' }}
            onClick={esClickeable ? onClick : undefined}
            whileHover={esClickeable ? { scale: 1.05, borderColor: colors.border } : {}}
            whileTap={esClickeable ? { scale: 0.97 } : {}}
            transition={{ duration: 0.15 }}
            boxShadow={
                highlighted
                    ? '0 0 0 2px rgba(235,235,235,0.6), 0 0 12px rgba(235,235,235,0.25)'
                    : esActual
                    ? `0 0 0 2px ${colors.border}`
                    : 'none'
            }
            animate={highlighted ? { scale: [1, 1.04, 1] } : {}}
        >
            {user.nombre}
        </MotionBox>
    );

    if (esActual && !highlighted) {
        return (
            <Tooltip label="Toca para gestionar este turno" hasArrow placement="top" bg="brand.dark" color="brand.secondary" fontSize="xs">
                {chip}
            </Tooltip>
        );
    }
    return chip;
};

const EmptySlot = () => (
    <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        px={2}
        py={0.5}
        borderRadius="lg"
        fontSize="xs"
        fontFamily="'Questrial', sans-serif"
        color="rgba(235,235,235,0.5)"
        bg="rgba(255,255,255,0.07)"
        border="1px dashed rgba(235,235,235,0.25)"
        letterSpacing="0.02em"
    >
        Libre
    </Box>
);

const AdminButton = ({ onClick, children, isRed = false }) => (
    <Box
        as="button"
        onClick={onClick}
        fontSize="10px"
        fontFamily="'Questrial', sans-serif"
        fontWeight="600"
        color={isRed ? 'red.200' : 'rgba(235,235,235,0.75)'}
        bg={isRed ? 'rgba(220,53,69,0.2)' : 'rgba(255,255,255,0.1)'}
        border="1px solid"
        borderColor={isRed ? 'rgba(220,53,69,0.5)' : 'rgba(235,235,235,0.35)'}
        borderRadius="md"
        px={2}
        py={0.5}
        cursor="pointer"
        letterSpacing="0.04em"
        _hover={{
            color: isRed ? 'white' : 'red.200',
            bg: isRed ? 'rgba(220,53,69,0.35)' : 'rgba(220,53,69,0.2)',
            borderColor: 'rgba(220,53,69,0.55)',
        }}
        flexShrink={0}
        transition="all 0.15s ease"
    >
        {children}
    </Box>
);

const TimeSlot = ({ hora, usersInSlot = [], currentUser, onNombreClick, dia, searchQuery = '', isClosed = false, onToggleClosed }) => {
    const cantidadMaxima = 4;
    const lugares = [...usersInSlot.slice(0, cantidadMaxima)];

    const { user: authUser } = useAuth();
    const esAdmin = authUser?.rol === 'admin';

    while (lugares.length < cantidadMaxima) {
        lugares.push(null);
    }

    const query = searchQuery.trim().toLowerCase();

    if (isClosed) {
        return (
            <Box
                w="100%"
                borderRadius="xl"
                bg="rgba(220,53,69,0.18)"
                border="1px solid rgba(220,53,69,0.45)"
                px={3}
                py={2.5}
            >
                <Flex justify="space-between" align="center">
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontWeight="700"
                        fontSize="xs"
                        color="rgba(235,235,235,0.5)"
                        letterSpacing="0.08em"
                        textDecoration="line-through"
                    >
                        {hora} hs
                    </Text>
                    <Flex align="center" gap={2}>
                        <Text
                            fontFamily="'Questrial', sans-serif"
                            fontSize="10px"
                            fontWeight="700"
                            color="red.200"
                            letterSpacing="0.12em"
                            textTransform="uppercase"
                        >
                            Cerrado
                        </Text>
                        {esAdmin && onToggleClosed && (
                            <AdminButton onClick={() => onToggleClosed(dia, hora)}>
                                reabrir
                            </AdminButton>
                        )}
                    </Flex>
                </Flex>
            </Box>
        );
    }

    return (
        <Box
            w="100%"
            borderRadius="xl"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(235,235,235,0.16)"
            px={3}
            py={2.5}
            _hover={{ bg: 'rgba(255,255,255,0.13)', borderColor: 'rgba(235,235,235,0.25)' }}
            transition="all 0.2s ease"
        >
            <Flex justify="space-between" align="center" mb={2}>
                <Text
                    fontFamily="'Questrial', sans-serif"
                    fontWeight="700"
                    fontSize="xs"
                    color="rgba(235,235,235,0.9)"
                    letterSpacing="0.08em"
                    flex={1}
                    textAlign="center"
                >
                    {hora} hs
                </Text>
                {esAdmin && onToggleClosed && (
                    <AdminButton onClick={() => onToggleClosed(dia, hora)}>
                        cerrar
                    </AdminButton>
                )}
            </Flex>

            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                gap={1.5}
            >
                {lugares.map((user, i) => {
                    if (!user) return <EmptySlot key={i} />;

                    const esActual = user.nombre === currentUser;
                    const esClickeable = esAdmin || esActual;
                    const highlighted = query.length >= 2 &&
                        user.nombre.toLowerCase().includes(query);

                    return (
                        <UserChip
                            key={i}
                            user={user}
                            esActual={esActual}
                            esClickeable={esClickeable}
                            highlighted={highlighted}
                            onClick={() => onNombreClick && onNombreClick(dia, hora, user)}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};

export default TimeSlot;
