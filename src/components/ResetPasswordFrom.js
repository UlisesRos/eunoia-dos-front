import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Box, Button, Input, Flex, Heading, Text, FormControl, FormLabel,
    VStack, InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useToast } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import backendUrl from '../config';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const ResetPasswordFrom = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmarPassword) {
            toast({ title: 'Las contraseñas no coinciden', status: 'error', duration: 4000, isClosable: true });
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/auth/reset-password/${token}`, {
                password,
                confirmarPassword
            });
            toast({ title: 'Contraseña actualizada', description: res.data.message, status: 'success', duration: 5000, isClosable: true });
            navigate('/login');
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Ocurrió un error.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const inputProps = {
        size: "lg",
        borderRadius: "xl",
        bg: "brand.cream",
        border: "1.5px solid",
        borderColor: "brand.muted",
        _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 2px rgba(106,134,119,0.25)",
            bg: "white"
        },
        _placeholder: { color: "gray.400" },
    };

    return (
        <Flex
            minH="100vh"
            bg="brand.primary"
            align="center"
            justify="center"
            px={4}
            position="relative"
            overflow="hidden"
        >
            <Box position="absolute" top="-100px" right="-100px" w="300px" h="300px"
                borderRadius="full" bg="rgba(255,255,255,0.04)" pointerEvents="none" />

            <MotionFlex
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                direction="column"
                align="center"
                w="100%"
                maxW="420px"
            >
                <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    textAlign="center"
                    mb={8}
                >
                    <Heading
                        fontFamily="'Playfair Display', serif"
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="700"
                        color="brand.secondary"
                        letterSpacing="0.06em"
                    >
                        Nueva contraseña
                    </Heading>
                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="rgba(235,235,235,0.6)" mt={1}>
                        Elegí una contraseña segura para tu cuenta
                    </Text>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    w="100%"
                    bg="white"
                    borderRadius="2xl"
                    p={{ base: 6, md: 8 }}
                    boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                >
                    <VStack as="form" onSubmit={handleReset} spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="brand.dark">Nueva contraseña</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    {...inputProps}
                                />
                                <InputRightElement h="100%">
                                    <IconButton
                                        aria-label="Ver contraseña"
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        size="sm"
                                        color="brand.primary"
                                        _hover={{ bg: "transparent" }}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="brand.dark">Confirmar contraseña</FormLabel>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repetí la contraseña"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                {...inputProps}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            w="100%"
                            size="lg"
                            bg="brand.primary"
                            color="white"
                            borderRadius="xl"
                            letterSpacing="0.08em"
                            fontFamily="'Questrial', sans-serif"
                            isLoading={loading}
                            loadingText="Guardando..."
                            _hover={{
                                bg: "brand.dark",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 24px rgba(74,97,87,0.35)"
                            }}
                            transition="all 0.25s ease"
                        >
                            Guardar nueva contraseña
                        </Button>
                    </VStack>
                </MotionBox>
            </MotionFlex>
        </Flex>
    );
};

export default ResetPasswordFrom;
