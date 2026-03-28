import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from '../img/logos/faviconE.png';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }
    }),
    hover: {
        y: -8,
        scale: 1.02,
        transition: { duration: 0.25, ease: "easeOut" }
    }
};

const options = [
    {
        label: "Pilates Reformer",
        sub: "Clases grupales con reformer",
        href: null,
        internal: '/home',
        gradient: "linear(135deg, #4a6157 0%, #6A8677 60%, #8fa99b 100%)",
    },
    {
        label: "Pilates Cadillac",
        sub: "Clases en aparato Cadillac",
        href: "https://cadillac-three.vercel.app/",
        internal: null,
        gradient: "linear(135deg, #6A8677 0%, #8fa99b 60%, #b8cec7 100%)",
    },
];

function PagePrincipal() {
    const navigate = useNavigate();

    return (
        <Box
            minH="100vh"
            bg="brand.primary"
            position="relative"
            overflow="hidden"
        >
            {/* Fondo decorativo */}
            <Box
                position="absolute"
                top="-120px"
                right="-120px"
                w="400px"
                h="400px"
                borderRadius="full"
                bg="rgba(255,255,255,0.04)"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                bottom="-80px"
                left="-80px"
                w="300px"
                h="300px"
                borderRadius="full"
                bg="rgba(255,255,255,0.04)"
                pointerEvents="none"
            />

            <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                minH="100vh"
                px={6}
                py={12}
                gap={12}
            >
                {/* Logo + Título */}
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={4}
                >
                    <Box
                        className="anim-float"
                        borderRadius="full"
                        p={2}
                        bg="rgba(255,255,255,0.1)"
                        backdropFilter="blur(8px)"
                        border="1px solid rgba(255,255,255,0.18)"
                        boxShadow="0 8px 32px rgba(0,0,0,0.12)"
                    >
                        <Image
                            src={logo}
                            borderRadius="full"
                            w={{ base: "90px", md: "110px" }}
                            display="block"
                        />
                    </Box>

                    <Heading
                        fontFamily="'Playfair Display', serif"
                        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                        fontWeight="700"
                        letterSpacing="0.2em"
                        color="brand.secondary"
                        textAlign="center"
                        textShadow="0 2px 20px rgba(0,0,0,0.15)"
                    >
                        ESTUDIO EUNOIA
                    </Heading>

                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize={{ base: "sm", md: "md" }}
                        color="rgba(235,235,235,0.65)"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        textAlign="center"
                    >
                        Rosario · Argentina
                    </Text>
                </MotionBox>

                {/* Cards de navegación */}
                <MotionFlex
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 5, md: 7 }}
                    alignItems="center"
                    justifyContent="center"
                    initial="hidden"
                    animate="visible"
                    w="100%"
                    maxW="700px"
                >
                    {options.map((opt, i) => (
                        <MotionBox
                            key={opt.label}
                            custom={i}
                            variants={cardVariants}
                            whileHover="hover"
                            whileTap={{ scale: 0.97 }}
                            cursor="pointer"
                            onClick={() => {
                                if (opt.internal) navigate(opt.internal);
                                else window.open(opt.href, '_blank');
                            }}
                            w={{ base: "100%", md: "280px" }}
                            borderRadius="2xl"
                            overflow="hidden"
                            position="relative"
                            boxShadow="0 8px 32px rgba(0,0,0,0.18)"
                            border="1px solid rgba(255,255,255,0.12)"
                        >
                            <Box
                                bgGradient={opt.gradient}
                                h="160px"
                                position="relative"
                            >
                                {/* Overlay decorativo */}
                                <Box
                                    position="absolute"
                                    inset={0}
                                    bgGradient="linear(to-b, transparent 40%, rgba(0,0,0,0.25) 100%)"
                                />
                            </Box>
                            <Box
                                bg="rgba(255,255,255,0.92)"
                                backdropFilter="blur(12px)"
                                px={6}
                                py={5}
                            >
                                <Heading
                                    fontFamily="'Playfair Display', serif"
                                    fontSize="xl"
                                    fontWeight="600"
                                    color="brand.dark"
                                    mb={1}
                                >
                                    {opt.label}
                                </Heading>
                                <Text
                                    fontFamily="'Questrial', sans-serif"
                                    fontSize="sm"
                                    color="brand.primary"
                                    letterSpacing="0.03em"
                                >
                                    {opt.sub}
                                </Text>
                                <Box
                                    mt={3}
                                    display="inline-flex"
                                    alignItems="center"
                                    gap={1}
                                    fontSize="xs"
                                    fontFamily="'Questrial', sans-serif"
                                    color="brand.light"
                                    letterSpacing="0.08em"
                                    textTransform="uppercase"
                                >
                                    Ingresar →
                                </Box>
                            </Box>
                        </MotionBox>
                    ))}
                </MotionFlex>

                {/* Tagline */}
                <MotionBox
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    textAlign="center"
                >
                    <Text
                        fontFamily="'Playfair Display', serif"
                        fontStyle="italic"
                        fontSize={{ base: "sm", md: "md" }}
                        color="rgba(235,235,235,0.45)"
                        letterSpacing="0.05em"
                    >
                        Eunoia · claridad mental y pensamiento positivo
                    </Text>
                </MotionBox>
            </Flex>
        </Box>
    );
}

export default PagePrincipal;
