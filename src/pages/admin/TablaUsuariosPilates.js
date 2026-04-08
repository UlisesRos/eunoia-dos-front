import {
    Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody,
    Box, Heading, Text, Flex, Image, Button, Input, Portal,
    Tooltip, useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import logo from '../../img/logos/faviconE.png';
import { useNavigate } from 'react-router-dom';
import ModalEditarUsuario from './ModalEditarUsuario';
import axios from 'axios';
import pagado from '../../img/pagado.png';
import noPagado from '../../img/nopago.png';
import backendUrl from '../../config';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const TablaUsuariosPilates = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroPago, setFiltroPago] = useState('todos');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/auth/users`);
                setUsuarios(res.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleDelete = async (id) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('¿Estás seguro que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`${backendUrl}/api/usuarios/delete/${id}`);
                setUsuarios((prev) => prev.filter((u) => u._id !== id));
            } catch (err) {
                console.error('Error al eliminar usuario:', err);
                alert('No se pudo eliminar el usuario.');
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        onOpen();
    };

    const handleUsuarioActualizado = (id, updatedData) => {
        setUsuarios((prev) =>
            prev.map((u) => (u._id === id ? { ...u, ...updatedData } : u))
        );
    };

    const handleTogglePago = async (userId, currentPago) => {
        try {
            const res = await axios.patch(`${backendUrl}/api/usuarios/updatePago/${userId}`, {
                pago: !currentPago,
            });
            setUsuarios((prev) =>
                prev.map((u) => (u._id === userId ? res.data : u))
            );
        } catch (error) {
            console.error('Error al actualizar pago:', error);
            alert('No se pudo actualizar el estado de pago.');
        }
    };

    const usuariosFiltrados = usuarios
        .filter(u => u.rol !== 'admin')
        .filter(u => `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase()))
        .filter(u => {
            if (filtroPago === 'pagado') return u.pago === true;
            if (filtroPago === 'noPagado') return u.pago === false;
            return true;
        });

    return (
        <Box
            minH="100vh"
            bg="brand.primary"
            color="brand.secondary"
            px={{ base: 4, md: 6 }}
            py={8}
            position="relative"
            overflow="hidden"
        >
            {/* Decoración */}
            <Box position="absolute" top="-60px" right="-60px" w="260px" h="260px"
                borderRadius="full" bg="rgba(255,255,255,0.03)" pointerEvents="none" />
            <Box position="absolute" bottom="-60px" left="-60px" w="220px" h="220px"
                borderRadius="full" bg="rgba(255,255,255,0.03)" pointerEvents="none" />

            {/* Header */}
            <MotionFlex
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                direction="column"
                align="center"
                mb={8}
            >
                <Image
                    src={logo}
                    borderRadius="full"
                    w="72px"
                    mb={4}
                    boxShadow="0 8px 24px rgba(0,0,0,0.2)"
                    border="3px solid rgba(255,255,255,0.15)"
                    className="anim-float"
                    cursor="pointer"
                    onClick={() => navigate('/')}
                />
                <Heading
                    fontFamily="'Playfair Display', serif"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="700"
                    color="brand.secondary"
                    letterSpacing="0.06em"
                    textAlign="center"
                    mb={1}
                >
                    Registro de Alumnas/os
                </Heading>
                <Text
                    fontFamily="'Questrial', sans-serif"
                    fontSize="sm"
                    color="rgba(235,235,235,0.5)"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    mb={4}
                >
                    Panel de Administración
                </Text>
                <Button variant="onGreen" size="sm" onClick={() => navigate('/calendario')} px={7}>
                    ← Volver al calendario
                </Button>
            </MotionFlex>

            {isLoading ? (
                <Flex justify="center" align="center" h="200px" direction="column" gap={3}>
                    <Box
                        as={motion.div}
                        animate={{ rotate: 360 }}
                        // @ts-ignore
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        w="40px"
                        h="40px"
                        borderRadius="full"
                        border="3px solid"
                        borderColor="brand.secondary"
                        borderTopColor="transparent"
                    />
                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="rgba(235,235,235,0.5)">
                        Cargando usuarios...
                    </Text>
                </Flex>
            ) : (
                <MotionBox
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    maxW="1200px"
                    mx="auto"
                >
                    {/* Filtros */}
                    <Flex
                        mb={5}
                        flexDir={{ base: 'column', md: 'row' }}
                        gap={3}
                        align="center"
                        justify="space-between"
                    >
                        <Flex gap={3} flexDir={{ base: 'column', sm: 'row' }} w={{ base: '100%', md: 'auto' }}>
                            <Input
                                placeholder="Buscar por nombre o apellido"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                size="sm"
                                w={{ base: '100%', sm: '240px' }}
                                bg="rgba(255,255,255,0.08)"
                                border="1px solid rgba(235,235,235,0.2)"
                                borderRadius="xl"
                                color="brand.secondary"
                                fontFamily="'Questrial', sans-serif"
                                _placeholder={{ color: 'rgba(235,235,235,0.4)' }}
                                _focus={{ borderColor: 'brand.secondary', bg: 'rgba(255,255,255,0.12)' }}
                            />
                            <Box
                                as="select"
                                value={filtroPago}
                                onChange={(e) => setFiltroPago(e.target.value)}
                                bg="rgba(255,255,255,0.08)"
                                border="1px solid rgba(235,235,235,0.2)"
                                borderRadius="xl"
                                color="brand.secondary"
                                fontFamily="'Questrial', sans-serif"
                                fontSize="sm"
                                px={3}
                                py={1.5}
                                w={{ base: '100%', sm: '180px' }}
                                cursor="pointer"
                                sx={{
                                    option: {
                                        bg: '#4a6157',
                                        color: 'white',
                                    }
                                }}
                            >
                                <option value="todos">Todos</option>
                                <option value="pagado">Pagaron</option>
                                <option value="noPagado">No pagaron</option>
                            </Box>
                        </Flex>

                        <Box
                            bg="rgba(255,255,255,0.08)"
                            border="1px solid rgba(235,235,235,0.15)"
                            borderRadius="xl"
                            px={4}
                            py={2}
                        >
                            <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="brand.secondary">
                                <Box as="span" fontWeight="700">{usuariosFiltrados.length}</Box> usuario{usuariosFiltrados.length !== 1 ? 's' : ''}
                                {filtroPago !== 'todos' && (
                                    <Box as="span" color="rgba(235,235,235,0.5)">
                                        {' '}({filtroPago === 'pagado' ? 'pagaron' : 'no pagaron'})
                                    </Box>
                                )}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Tabla / Cards */}
                    <Box
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(235,235,235,0.1)"
                        borderRadius="2xl"
                        overflow="hidden"
                    >
                        {/* Header tabla */}
                        <Box
                            display={{ base: 'none', md: 'grid' }}
                            gridTemplateColumns="40px 1fr 1fr 1fr 80px 100px 140px"
                            gap={3}
                            px={5}
                            py={3}
                            bg="rgba(255,255,255,0.06)"
                            borderBottom="1px solid rgba(235,235,235,0.1)"
                        >
                            {['N°', 'Nombre', 'Apellido', 'Email', 'Pago', 'Fecha pago', 'Acciones'].map(col => (
                                <Text
                                    key={col}
                                    fontFamily="'Questrial', sans-serif"
                                    fontSize="xs"
                                    fontWeight="700"
                                    color="rgba(235,235,235,0.45)"
                                    letterSpacing="0.1em"
                                    textTransform="uppercase"
                                >
                                    {col}
                                </Text>
                            ))}
                        </Box>

                        {/* Filas */}
                        {usuariosFiltrados.map((user, index) => (
                            <MotionBox
                                key={user._id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                borderBottom="1px solid rgba(235,235,235,0.06)"
                                _last={{ borderBottom: 'none' }}
                                _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                                transition2="background 0.2s ease"
                            >
                                {/* Desktop row */}
                                <Box
                                    display={{ base: 'none', md: 'grid' }}
                                    gridTemplateColumns="40px 1fr 1fr 1fr 80px 100px 140px"
                                    gap={3}
                                    px={5}
                                    py={3.5}
                                    alignItems="center"
                                >
                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="rgba(235,235,235,0.4)">
                                        {index + 1}
                                    </Text>

                                    <Popover trigger="click" placement="bottom-start">
                                        <PopoverTrigger>
                                            <Text
                                                fontFamily="'Questrial', sans-serif"
                                                fontSize="sm"
                                                fontWeight="600"
                                                color="brand.secondary"
                                                cursor="pointer"
                                                textTransform="capitalize"
                                                _hover={{ color: 'brand.muted', textDecoration: 'underline' }}
                                            >
                                                {user.nombre}
                                            </Text>
                                        </PopoverTrigger>
                                        <Portal>
                                            <PopoverContent
                                                bg="brand.dark"
                                                border="1px solid rgba(235,235,235,0.15)"
                                                borderRadius="xl"
                                                color="brand.secondary"
                                                w="auto"
                                                minW="200px"
                                                boxShadow="0 8px 32px rgba(0,0,0,0.25)"
                                                px={4}
                                                py={3}
                                            >
                                                <PopoverArrow bg="brand.dark" />
                                                <PopoverBody p={0}>
                                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" mb={1}>
                                                        Celular: <Box as="span" fontWeight="600">{user.celular || '-'}</Box>
                                                    </Text>
                                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" mb={1}>
                                                        Días/semana: <Box as="span" fontWeight="600">{user.diasSemanales}</Box>
                                                    </Text>
                                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm">
                                                        Desde: <Box as="span" fontWeight="600">{new Date(user.fechaRegistro).toLocaleDateString()}</Box>
                                                    </Text>
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Portal>
                                    </Popover>

                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="brand.secondary" textTransform="capitalize">
                                        {user.apellido}
                                    </Text>
                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="rgba(235,235,235,0.65)" textTransform="lowercase">
                                        {user.email}
                                    </Text>

                                    <Tooltip
                                        label={user.pago ? 'Cambiar a no pagado' : 'Cambiar a pagado'}
                                        hasArrow
                                        placement="top"
                                        bg="brand.dark"
                                        color="brand.secondary"
                                        fontSize="xs"
                                    >
                                        <Box cursor="pointer" onClick={() => handleTogglePago(user._id, user.pago)} w="fit-content">
                                            <Image w="36px" src={user.pago ? pagado : noPagado} />
                                        </Box>
                                    </Tooltip>

                                    <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="rgba(235,235,235,0.55)">
                                        {user.fechaPago ? new Date(user.fechaPago).toLocaleDateString() : '-'}
                                    </Text>

                                    <Flex gap={2}>
                                        <Button
                                            size="xs"
                                            bg="rgba(255,255,255,0.1)"
                                            color="brand.secondary"
                                            borderRadius="lg"
                                            fontFamily="'Questrial', sans-serif"
                                            border="1px solid rgba(235,235,235,0.15)"
                                            _hover={{ bg: 'rgba(255,255,255,0.18)', borderColor: 'rgba(235,235,235,0.3)' }}
                                            onClick={() => handleEdit(user)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="xs"
                                            bg="rgba(220,53,69,0.15)"
                                            color="red.300"
                                            borderRadius="lg"
                                            fontFamily="'Questrial', sans-serif"
                                            border="1px solid rgba(220,53,69,0.25)"
                                            _hover={{ bg: 'rgba(220,53,69,0.25)' }}
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Flex>
                                </Box>

                                {/* Mobile card */}
                                <Box
                                    display={{ base: 'block', md: 'none' }}
                                    px={4}
                                    py={4}
                                >
                                    <Flex justify="space-between" align="center" mb={2}>
                                        <Box>
                                            <Text fontFamily="'Questrial', sans-serif" fontWeight="700" fontSize="sm" color="brand.secondary" textTransform="capitalize">
                                                {user.nombre} {user.apellido}
                                            </Text>
                                            <Text fontFamily="'Questrial', sans-serif" fontSize="xs" color="rgba(235,235,235,0.5)" textTransform="lowercase">
                                                {user.email}
                                            </Text>
                                        </Box>
                                        <Flex align="center" gap={2}>
                                            <Tooltip label={user.pago ? 'Cambiar a no pagado' : 'Cambiar a pagado'} hasArrow>
                                                <Image w="32px" src={user.pago ? pagado : noPagado} cursor="pointer" onClick={() => handleTogglePago(user._id, user.pago)} />
                                            </Tooltip>
                                        </Flex>
                                    </Flex>
                                    <Flex gap={2} mt={3}>
                                        <Button
                                            size="xs"
                                            bg="rgba(255,255,255,0.1)"
                                            color="brand.secondary"
                                            borderRadius="lg"
                                            fontFamily="'Questrial', sans-serif"
                                            border="1px solid rgba(235,235,235,0.15)"
                                            _hover={{ bg: 'rgba(255,255,255,0.18)' }}
                                            onClick={() => handleEdit(user)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="xs"
                                            bg="rgba(220,53,69,0.15)"
                                            color="red.300"
                                            borderRadius="lg"
                                            fontFamily="'Questrial', sans-serif"
                                            border="1px solid rgba(220,53,69,0.2)"
                                            _hover={{ bg: 'rgba(220,53,69,0.25)' }}
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </Flex>
                                </Box>
                            </MotionBox>
                        ))}

                        {usuariosFiltrados.length === 0 && (
                            <Flex justify="center" align="center" py={12} direction="column" gap={2}>
                                <Text fontFamily="'Playfair Display', serif" fontSize="lg" color="rgba(235,235,235,0.3)">
                                    Sin resultados
                                </Text>
                                <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="rgba(235,235,235,0.2)">
                                    Probá con otro filtro
                                </Text>
                            </Flex>
                        )}
                    </Box>
                </MotionBox>
            )}

            <ModalEditarUsuario
                isOpen={isOpen}
                onClose={onClose}
                user={selectedUser}
                onUsuarioActualizado={handleUsuarioActualizado}
            />
        </Box>
    );
};

export default TablaUsuariosPilates;
