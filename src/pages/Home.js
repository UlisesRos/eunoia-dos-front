import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import SidebarMenu from '../components/SidebarMenu';
import Footer from '../components/Footer';

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);

const Home = () => {
    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            minH='100vh'
            bg='brand.primary'
            overflow="hidden"
        >
            <SidebarMenu />

            <Box
                flex={1}
                display='flex'
                flexDir='column'
                alignItems='center'
                justifyContent='center'
                bg='brand.primary'
                color='brand.secondary'
                textAlign='center'
                position="relative"
                px={6}
                pb={{ base: '72px', md: 0 }}
                overflow="hidden"
            >
                {/* Círculos decorativos de fondo */}
                <Box
                    position="absolute"
                    top="10%"
                    right="5%"
                    w={{ base: "200px", md: "350px" }}
                    h={{ base: "200px", md: "350px" }}
                    borderRadius="full"
                    border="1px solid rgba(235,235,235,0.08)"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    top="15%"
                    right="10%"
                    w={{ base: "130px", md: "230px" }}
                    h={{ base: "130px", md: "230px" }}
                    borderRadius="full"
                    border="1px solid rgba(235,235,235,0.06)"
                    pointerEvents="none"
                />
                <Box
                    position="absolute"
                    bottom="15%"
                    left="5%"
                    w={{ base: "150px", md: "260px" }}
                    h={{ base: "150px", md: "260px" }}
                    borderRadius="full"
                    border="1px solid rgba(235,235,235,0.06)"
                    pointerEvents="none"
                />

                {/* Línea decorativa superior */}
                <MotionBox
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    w={{ base: "60px", md: "80px" }}
                    h="1px"
                    bg="rgba(235,235,235,0.4)"
                    mb={6}
                />

                {/* Subtítulo superior */}
                <MotionText
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    fontFamily="'Questrial', sans-serif"
                    fontSize={{ base: "xs", md: "sm" }}
                    letterSpacing="0.3em"
                    textTransform="uppercase"
                    color="rgba(235,235,235,0.55)"
                    mb={4}
                >
                    Estudio de Pilates
                </MotionText>

                {/* Título principal */}
                <MotionHeading
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    fontFamily="'Playfair Display', serif"
                    fontWeight="700"
                    fontSize={{ base: '58px', md: '80px', lg: '110px' }}
                    letterSpacing={{ base: "10px", md: "18px" }}
                    color="brand.secondary"
                    textShadow="0 0 60px rgba(143, 169, 155, 0.3)"
                    lineHeight="1"
                    mb={3}
                >
                    EUNOIA
                </MotionHeading>

                {/* Divisor */}
                <MotionBox
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    w={{ base: "40px", md: "60px" }}
                    h="1px"
                    bg="brand.secondary"
                    my={4}
                />

                {/* Subtítulo */}
                <MotionHeading
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    fontFamily="'Playfair Display', serif"
                    fontWeight="400"
                    fontStyle="italic"
                    fontSize={{ base: '22px', md: '30px', lg: '38px' }}
                    letterSpacing={{ base: "6px", md: "10px" }}
                    textTransform="uppercase"
                    color="brand.secondary"
                    opacity={0.85}
                >
                    Pilates Reformer
                </MotionHeading>

                {/* Profe */}
                <MotionText
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    fontFamily="'Questrial', sans-serif"
                    fontSize={{ base: "xs", md: "sm" }}
                    letterSpacing="0.25em"
                    textTransform="uppercase"
                    color="rgba(235,235,235,0.45)"
                    mt={3}
                >
                    con el Profe Facundo
                </MotionText>

                {/* Footer posicionado abajo */}
                <Box
                    display='flex'
                    position={{ base: 'fixed', md: 'absolute' }}
                    bottom={{ base: '20px', md: '32px' }}
                    left="50%"
                    transform="translateX(-50%)"
                >
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.9 }}
                    >
                        <Footer />
                    </MotionBox>
                </Box>
            </Box>
        </Flex>
    );
};

export default Home;
