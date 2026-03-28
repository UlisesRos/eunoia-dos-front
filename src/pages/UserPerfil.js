import { Box, Heading, Text, Flex, Image, Button, Divider } from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { useAuth } from "../context/AuthContext";
import logo from '../img/logos/faviconE.png';
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const InfoRow = ({ label, value, delay = 0 }) => (
    <MotionBox
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
    >
        <Flex justify="space-between" align="center" py={3}>
            <Text
                fontFamily="'Questrial', sans-serif"
                fontSize="sm"
                color="gray.500"
                letterSpacing="0.06em"
                textTransform="uppercase"
                fontWeight="500"
            >
                {label}
            </Text>
            <Text
                fontFamily="'Questrial', sans-serif"
                fontSize="sm"
                color="gray.800"
                fontWeight="600"
                textTransform="capitalize"
                textAlign="right"
                maxW="200px"
            >
                {value}
            </Text>
        </Flex>
        <Divider borderColor="rgba(235,235,235,0.08)" />
    </MotionBox>
);

const UserPerfil = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <Flex minH="100vh" bg="brand.primary" align="center" justify="center">
                <Text fontFamily="'Questrial', sans-serif" color="brand.secondary" opacity={0.6}>
                    Cargando perfil...
                </Text>
            </Flex>
        );
    }

    const { nombre, apellido, email, diasSemanales, pago } = user;

    return (
        <Flex
            minH="100vh"
            bg="brand.primary"
            align="flex-start"
            justify="center"
            px={4}
            py={10}
            position="relative"
            overflow="hidden"
        >
            {/* Decoración fondo */}
            <Box position="absolute" top="-80px" right="-80px" w="300px" h="300px"
                borderRadius="full" bg="rgba(255,255,255,0.03)" pointerEvents="none" />
            <Box position="absolute" bottom="-60px" left="-60px" w="250px" h="250px"
                borderRadius="full" bg="rgba(255,255,255,0.03)" pointerEvents="none" />

            <MotionFlex
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                direction="column"
                align="center"
                w="100%"
                maxW="440px"
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
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="700"
                        color="brand.secondary"
                        letterSpacing="0.06em"
                    >
                        Mi Perfil
                    </Heading>
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize="sm"
                        color="rgba(235,235,235,0.55)"
                        mt={1}
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                    >
                        Eunoia Pilates
                    </Text>
                </MotionBox>

                {/* Card */}
                <MotionBox
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3 }}
                    w="100%"
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 6, md: 8 }}
                    boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                >
                    {/* Avatar inicial */}
                    <Flex justify="center" mb={6}>
                        <Box
                            w="64px"
                            h="64px"
                            borderRadius="full"
                            bg="brand.primary"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="0 4px 16px rgba(106,134,119,0.35)"
                        >
                            <Text
                                fontFamily="'Playfair Display', serif"
                                fontSize="xl"
                                fontWeight="700"
                                color="white"
                                textTransform="uppercase"
                            >
                                {nombre?.charAt(0)}{apellido?.charAt(0)}
                            </Text>
                        </Box>
                    </Flex>

                    <InfoRow label="Nombre" value={nombre} delay={0.35} />
                    <InfoRow label="Apellido" value={apellido} delay={0.4} />
                    <InfoRow label="Email" value={email} delay={0.45} />
                    <InfoRow label="Días por semana" value={`${diasSemanales} día${diasSemanales > 1 ? 's' : ''}`} delay={0.5} />

                    {/* Estado de pago */}
                    <MotionBox
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.55 }}
                    >
                        <Flex justify="space-between" align="center" py={3}>
                            <Text
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                color="gray.500"
                                letterSpacing="0.06em"
                                textTransform="uppercase"
                                fontWeight="500"
                                _light={{ color: "gray.500" }}
                            >
                                Estado de pago
                            </Text>
                            <Box
                                px={3}
                                py={1}
                                borderRadius="full"
                                bg={pago ? 'green.50' : 'red.50'}
                                border="1px solid"
                                borderColor={pago ? 'green.200' : 'red.200'}
                            >
                                <Text
                                    fontFamily="'Questrial', sans-serif"
                                    fontSize="xs"
                                    fontWeight="700"
                                    color={pago ? 'green.600' : 'red.500'}
                                    letterSpacing="0.06em"
                                    textTransform="uppercase"
                                >
                                    {pago ? 'Al día' : 'Pendiente'}
                                </Text>
                            </Box>
                        </Flex>
                    </MotionBox>
                </MotionBox>

                {/* Botón volver */}
                <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    mt={5}
                >
                    <Button variant="onGreen" size="md" onClick={() => navigate('/calendario')} px={8}>
                        ← Volver al calendario
                    </Button>
                </MotionBox>
            </MotionFlex>
        </Flex>
    );
};

export default UserPerfil;
