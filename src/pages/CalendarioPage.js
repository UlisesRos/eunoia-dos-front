import { Button, Box, Heading, Text, Flex, Image, HStack, Tag, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentWeekDates } from '../utils/calendarUtils';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import EditSingleTurnModal from '../components/Modals/EditSingleTurnModal';
import AdminEditTurnModal from '../components/Modals/AdminEditTurnModal';
import SelectDaysModal from '../components/Modals/SelectDaysModal';
import RecuperarTurnoModal from '../components/Modals/RecuperarTurnoModal';
import InfoModal from '../components/Modals/InfoModal';
import AdminInfoModal from '../components/Modals/AdminInfoModal';
import AdminScheduleModal from '../components/Modals/AdminScheduleModal';
import { getFeriados, getTurnosPorHorario, getUserSelections, marcarFeriado, quitarFeriado, listarTurnosRecuperables, listarTodosLosTurnosRecuperadosUsados, getSchedule, getClosedSlots, cerrarHorario, abrirHorario } from '../services/calendarAPI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@chakra-ui/react';
import logo from '../img/logos/faviconE.png';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CalendarioPage = () => {
    const today = new Date();

    const [isLoading, setIsLoading] = useState(true);
    const [userSelections, setUserSelectionsState] = useState([]);
    const [cambiosRestantes, setCambiosRestantes] = useState(2);
    const [showEditModal, setShowEditModal] = useState(false);
    const [horarioActual, setHorarioActual] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [feriados, setFeriados] = useState([]);
    const [showRecuperarModal, setShowRecuperarModal] = useState(false);
    const [turnosRecuperables, setTurnosRecuperables] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [mostrarBannerAjusteOriginal, setMostrarBannerAjusteOriginal] = useState(false);
    const [esPrimerIngreso, setEsPrimerIngreso] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [schedule, setSchedule] = useState({});
    const [closedSlots, setClosedSlots] = useState([]);

    const selectedMonth = today.getMonth();
    const selectedYear = today.getFullYear();
    const [turnos, setTurnos] = useState([]);
    const [showSelectModal, setShowSelectModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const weekDates = useMemo(() => getCurrentWeekDates(), []);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const fetchAllTurnos = async () => {
        if (!weekDates || weekDates.length === 0) return;
        try {
            const [turnosNormales, turnosRecuperados] = await Promise.all([
                getTurnosPorHorario(),
                listarTodosLosTurnosRecuperadosUsados(
                    weekDates[0].date,
                    weekDates[weekDates.length - 1].date
                )
            ]);
            const turnosCombinados = [...turnosNormales];
            for (let rec of turnosRecuperados) {
                const existente = turnosCombinados.find(
                    t => t.day === rec.day && t.hour === rec.hour
                );
                if (existente) {
                    existente.users.push({ nombre: rec.nombre, tipo: rec.tipo });
                } else {
                    turnosCombinados.push({
                        day: rec.day, hour: rec.hour,
                        users: [{ nombre: rec.nombre, tipo: rec.tipo }]
                    });
                }
            }
            setTurnos(turnosCombinados);
        } catch (err) {
            console.error('Error al cargar turnos combinados:', err);
        }
    };

    useEffect(() => {
        getFeriados()
            .then(setFeriados)
            .catch(() => console.error('No se pudieron obtener los feriados.'));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Cargar horarios dinámicos del schedule
    useEffect(() => {
        if (!user) return;
        getSchedule()
            .then(setSchedule)
            .catch(() => console.error('No se pudo obtener el horario.'));
    }, [user]);

    // Cargar closed slots para la semana actual
    useEffect(() => {
        if (!weekDates || weekDates.length === 0) return;
        const startDate = weekDates[0].date;
        const endDate = weekDates[weekDates.length - 1].date;
        getClosedSlots(startDate, endDate)
            .then(setClosedSlots)
            .catch(() => setClosedSlots([]));
    }, [weekDates]);

    useEffect(() => {
        if (!user) return;
        listarTurnosRecuperables()
            .then(setTurnosRecuperables)
            .catch(() => setTurnosRecuperables([]));
    }, [user]);

    const handleLogout = () => {
        toast({
            title: 'Sesión cerrada',
            description: "Has cerrado sesión correctamente.",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        logout();
        navigate('/');
    };

    useEffect(() => {
        if (!user) return;
        getUserSelections()
            .then((data) => {
                const { selections, changesThisMonth, originalSelections = [] } = data;
                setUserSelectionsState(selections || []);
                setCambiosRestantes(2 - (changesThisMonth || 0));

                if (user.rol === 'admin') {
                    setShowSelectModal(false);
                    setMostrarBannerAjusteOriginal(false);
                    return;
                }

                const tieneOriginales = originalSelections.length > 0;
                const coincideConDias = originalSelections.length === user.diasSemanales;

                if (!tieneOriginales) {
                    setEsPrimerIngreso(true);
                    setShowSelectModal(true);
                    setMostrarBannerAjusteOriginal(false);
                } else if (!coincideConDias) {
                    setEsPrimerIngreso(false);
                    setShowSelectModal(false);
                    setMostrarBannerAjusteOriginal(true);
                } else {
                    setEsPrimerIngreso(false);
                    setShowSelectModal(false);
                    setMostrarBannerAjusteOriginal(false);
                }
            })
            .catch(() => {
                if (user?.rol !== 'admin') {
                    setShowSelectModal(true);
                }
            });
    }, [user]);

    useEffect(() => {
        fetchAllTurnos();
    }, [weekDates]);

    const estaBloqueadoPorPago = (user) => {
        const hoy = new Date();
        const diaDelMes = hoy.getDate();
        return !user.pago && diaDelMes > 10;
    };

    const handleToggleClosed = async (dayName, hora) => {
        // Obtener la fecha ISO del día clickeado
        const weekDay = weekDates.find(w => w.dayName === dayName);
        if (!weekDay) return;
        const fechaISO = new Date(weekDay.date).toISOString().slice(0, 10);
        const yaEstaСerrado = closedSlots.some(cs => cs.date === fechaISO && cs.hour === hora);

        try {
            if (yaEstaСerrado) {
                await abrirHorario(fechaISO, hora);
                setClosedSlots(prev => prev.filter(cs => !(cs.date === fechaISO && cs.hour === hora)));
                toast({ title: `${hora} reabierto`, status: 'info', duration: 2000, isClosable: true });
            } else {
                await cerrarHorario(fechaISO, hora);
                setClosedSlots(prev => [...prev, { date: fechaISO, hour: hora }]);
                toast({ title: `${hora} cerrado para ese día`, status: 'warning', duration: 2000, isClosable: true });
            }
        } catch (err) {
            toast({ title: 'Error', description: err.response?.data?.message || 'No se pudo actualizar.', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const handleNombreClick = (dia, hora, clickedUser) => {
        if (user.rol === 'admin') {
            setSelectedUsuario(clickedUser);
            setHorarioActual({ day: dia, hour: hora });
            setShowAdminModal(true);
        } else if (`${user.nombre} ${user.apellido}` === clickedUser?.nombre) {
            setHorarioActual({ day: dia, hour: hora, tipo: clickedUser.tipo });
            setShowEditModal(true);
        }
    };

    const handleMarcarFeriado = async (fechaISO) => {
        try {
            await marcarFeriado(fechaISO);
            toast({ title: 'Feriado marcado', description: `El día ${fechaISO} fue marcado como feriado.`, status: 'success', duration: 3000, isClosable: true });
            getFeriados().then(setFeriados);
        } catch (error) {
            toast({ title: 'Error', description: error.response?.data?.message || 'No se pudo marcar el feriado.', status: 'error', duration: 3000, isClosable: true });
        }
    };

    const handleQuitarFeriado = async (fechaISO) => {
        try {
            await quitarFeriado(fechaISO);
            toast({ title: 'Feriado quitado', description: `Se quitó el feriado del día ${fechaISO}.`, status: 'info', duration: 3000, isClosable: true });
            getFeriados().then(setFeriados);
        } catch (error) {
            toast({ title: 'Error', description: error.response?.data?.message || 'No se pudo quitar el feriado.', status: 'error', duration: 3000, isClosable: true });
        }
    };

    if (isLoading) {
        return (
            <Flex
                minH="100vh"
                bg="brand.primary"
                align="center"
                justify="center"
                flexDirection="column"
                gap={4}
            >
                <MotionBox
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    w="48px"
                    h="48px"
                    borderRadius="full"
                    border="3px solid"
                    borderColor="brand.secondary"
                    borderTopColor="transparent"
                />
                <Text
                    fontFamily="'Questrial', sans-serif"
                    color="brand.secondary"
                    opacity={0.7}
                    fontSize="sm"
                    letterSpacing="0.1em"
                >
                    Cargando calendario...
                </Text>
            </Flex>
        );
    }

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            w="100vw"
            maxW="100%"
            overflowX="hidden"
            bg="brand.primary"
            color="brand.secondary"
            minH="100vh"
            pb={20}
        >
            {/* Header */}
            <Box
                bg="rgba(0,0,0,0.12)"
                backdropFilter="blur(8px)"
                borderBottom="1px solid rgba(235,235,235,0.1)"
                px={{ base: 4, md: 6 }}
                py={4}
            >
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                    justify="space-between"
                    maxW="1400px"
                    mx="auto"
                    gap={4}
                >
                    {/* Logo + título */}
                    <Flex align="center" gap={3}>
                        <Image
                            src={logo}
                            borderRadius="full"
                            w="52px"
                            h="52px"
                            boxShadow="0 4px 16px rgba(0,0,0,0.2)"
                            border="2px solid rgba(235,235,235,0.2)"
                            className="anim-float"
                            cursor="pointer"
                            onClick={() => navigate('/')}
                        />
                        <Box>
                            <Heading
                                fontFamily="'Playfair Display', serif"
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontWeight="700"
                                color="brand.secondary"
                                letterSpacing="0.06em"
                                lineHeight="1.2"
                            >
                                {monthNames[selectedMonth]} {selectedYear}
                            </Heading>
                            <Text
                                fontFamily="'Questrial', sans-serif"
                                fontSize="xs"
                                color="rgba(235,235,235,0.6)"
                                letterSpacing="0.08em"
                                textTransform="capitalize"
                            >
                                {user.rol === 'admin' ? 'Admin' : 'Hola'}, {user?.nombre} {user?.apellido}
                            </Text>
                        </Box>
                    </Flex>

                    {/* Acciones */}
                    <Flex wrap="wrap" gap={2} justify={{ base: 'center', md: 'flex-end' }} align="center">
                        {user.rol === 'usuario' && (
                            <>
                                <Button variant="onGreen" size="sm" onClick={() => navigate('/perfil')} px={5}>
                                    Mi perfil
                                </Button>
                                {turnosRecuperables.length > 0 && (
                                    <Button
                                        variant="onGreen"
                                        size="sm"
                                        px={5}
                                        onClick={() => setShowRecuperarModal(true)}
                                        position="relative"
                                    >
                                        Recuperar turno
                                        <Box
                                            as="span"
                                            position="absolute"
                                            top="-6px"
                                            right="-6px"
                                            bg="red.400"
                                            color="white"
                                            borderRadius="full"
                                            w="18px"
                                            h="18px"
                                            fontSize="10px"
                                            fontWeight="bold"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            {turnosRecuperables.length}
                                        </Box>
                                    </Button>
                                )}
                            </>
                        )}
                        {user.rol === 'admin' && (
                            <>
                                <Button variant="onGreen" size="sm" px={5} onClick={() => setShowInfoModal(true)}>
                                    Crear novedad
                                </Button>
                                <Button variant="onGreen" size="sm" px={5} onClick={() => navigate('/registro')}>
                                    Clientes
                                </Button>
                                <Button variant="onGreen" size="sm" px={5} onClick={() => setShowScheduleModal(true)}>
                                    Horarios
                                </Button>
                            </>
                        )}
                        <Button
                            size="sm"
                            px={5}
                            bg="rgba(235,235,235,0.1)"
                            color="brand.secondary"
                            border="1px solid rgba(235,235,235,0.25)"
                            borderRadius="xl"
                            fontFamily="'Questrial', sans-serif"
                            letterSpacing="0.05em"
                            _hover={{ bg: "rgba(235,235,235,0.2)" }}
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </Button>
                    </Flex>
                </Flex>
            </Box>

            {/* Contenido principal */}
            <Box maxW="1400px" mx="auto" px={{ base: 3, md: 6 }} pt={5}>

                {/* Info usuario + cambios */}
                {user.rol === 'usuario' && (
                    <MotionFlex
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        wrap="wrap"
                        gap={3}
                        mb={5}
                        align="center"
                    >
                        <Box
                            bg="rgba(255,255,255,0.08)"
                            border="1px solid rgba(235,235,235,0.15)"
                            borderRadius="xl"
                            px={4}
                            py={2}
                        >
                            <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="brand.secondary">
                                Cambios mensuales:{' '}
                                <Box as="span" fontWeight="bold" color={cambiosRestantes === 0 ? 'red.300' : 'brand.secondary'}>
                                    {cambiosRestantes} / 2
                                </Box>
                            </Text>
                        </Box>

                        {cambiosRestantes === 0 && (
                            <Box
                                bg="rgba(220,53,69,0.15)"
                                border="1px solid rgba(220,53,69,0.3)"
                                borderRadius="xl"
                                px={4}
                                py={2}
                            >
                                <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="red.300">
                                    Sin cambios disponibles este mes
                                </Text>
                            </Box>
                        )}

                        {estaBloqueadoPorPago(user) && (
                            <Box
                                bg="rgba(220,53,69,0.15)"
                                border="1px solid rgba(220,53,69,0.3)"
                                borderRadius="xl"
                                px={4}
                                py={2}
                            >
                                <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="red.300">
                                    Cambios bloqueados por falta de pago
                                </Text>
                            </Box>
                        )}
                    </MotionFlex>
                )}

                {/* Buscador */}
                <MotionBox
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    mb={4}
                >
                    <InputGroup maxW={{ base: '100%', md: '320px' }}>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="rgba(235,235,235,0.4)" boxSize={3.5} />
                        </InputLeftElement>
                        <Input
                            placeholder={user.rol === 'admin' ? 'Buscar alumna...' : 'Buscar tu nombre en el calendario...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="sm"
                            bg="rgba(255,255,255,0.08)"
                            border="1px solid rgba(235,235,235,0.18)"
                            borderRadius="xl"
                            color="brand.secondary"
                            fontFamily="'Questrial', sans-serif"
                            fontSize="sm"
                            _placeholder={{ color: 'rgba(235,235,235,0.35)', fontFamily: "'Questrial', sans-serif" }}
                            _focus={{ bg: 'rgba(255,255,255,0.13)', borderColor: 'rgba(235,235,235,0.4)', boxShadow: 'none' }}
                            _hover={{ borderColor: 'rgba(235,235,235,0.3)' }}
                        />
                    </InputGroup>
                </MotionBox>

                {/* Leyenda */}
                <MotionFlex
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    wrap="wrap"
                    gap={2}
                    mb={5}
                    align="center"
                >
                    <Text
                        fontFamily="'Questrial', sans-serif"
                        fontSize="xs"
                        color="rgba(235,235,235,0.5)"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        mr={1}
                    >
                        Referencias:
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                        {[
                            { label: 'Turno fijo', scheme: 'green' },
                            { label: 'Turno cambiado', scheme: 'red' },
                            { label: 'Turno recuperado', scheme: 'blue' },
                            { label: 'Libre', scheme: 'gray' },
                        ].map(({ label, scheme }) => (
                            <Tag key={label} size="sm" colorScheme={scheme} color="black" fontWeight="600" borderRadius="full">
                                {label}
                            </Tag>
                        ))}
                    </HStack>
                </MotionFlex>

                {/* Calendario */}
                <MotionBox
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <CalendarGrid
                        weekDates={weekDates}
                        turnos={turnos}
                        onNombreClick={handleNombreClick}
                        feriados={feriados}
                        onMarcarFeriado={handleMarcarFeriado}
                        onQuitarFeriado={handleQuitarFeriado}
                        searchQuery={searchQuery}
                        schedule={schedule}
                        closedSlots={closedSlots}
                        onToggleClosed={user.rol === 'admin' ? handleToggleClosed : undefined}
                    />
                </MotionBox>
            </Box>

            {/* Modales */}
            <SelectDaysModal
                isOpen={showSelectModal}
                onClose={() => setShowSelectModal(false)}
                diasSemanales={user?.diasSemanales || 1}
                existingSelections={userSelections}
                cambiosRestantes={cambiosRestantes}
                turnosOcupados={turnos}
                modoOriginal={mostrarBannerAjusteOriginal}
                esPrimerIngreso={esPrimerIngreso}
                onUpdate={() => {
                    getUserSelections().then((data) => {
                        setUserSelectionsState(data.selections || []);
                        setCambiosRestantes(2 - (data.changesThisMonth || 0));
                    });
                    fetchAllTurnos();
                }}
            />

            <EditSingleTurnModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                userSelections={userSelections}
                turnosOcupados={turnos}
                cambiosRestantes={cambiosRestantes}
                horarioActual={horarioActual}
                feriados={feriados}
                weekDates={weekDates}
                onUpdate={() => {
                    getUserSelections().then(data => {
                        setUserSelectionsState(data.selections || []);
                        setCambiosRestantes(2 - (data.changesThisMonth || 0));
                    });
                    fetchAllTurnos();
                }}
            />

            <AdminEditTurnModal
                isOpen={showAdminModal}
                onClose={() => setShowAdminModal(false)}
                selectedUser={selectedUsuario}
                horarioActual={horarioActual}
                turnosOcupados={turnos}
                onUpdate={() => {
                    fetchAllTurnos();
                    getUserSelections().then(data => {
                        setUserSelectionsState(data.selections || []);
                        setCambiosRestantes(2 - (data.changesThisMonth || 0));
                    });
                }}
            />

            <RecuperarTurnoModal
                isOpen={showRecuperarModal}
                onClose={() => setShowRecuperarModal(false)}
                turnosRecuperables={turnosRecuperables}
                turnosOcupados={turnos}
                nombreUsuario={`${user?.nombre} ${user?.apellido}`}
                onUpdate={() => {
                    fetchAllTurnos();
                    listarTurnosRecuperables().then(setTurnosRecuperables);
                    getUserSelections().then(data => {
                        setUserSelectionsState(data.selections || []);
                        setCambiosRestantes(2 - (data.changesThisMonth || 0));
                    });
                }}
                horasDisponiblesPorDia={{
                    Lunes: ['18:00', '19:00', '20:00'],
                    Miércoles: ['18:00', '19:00', '20:00'],
                    Viernes: ['18:00', '19:00']
                }}
            />

            {user?.rol === 'usuario' && <InfoModal />}

            <AdminInfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                onSuccess={() => {}}
            />

            <AdminScheduleModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onScheduleUpdated={() => {
                    getSchedule().then(setSchedule);
                }}
            />

            {/* Banners inferiores */}
            <AnimatePresence>
                {user?.rol === 'usuario' && userSelections.length === 0 && (
                    <MotionBox
                        key="banner-sin-turnos"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        position="fixed"
                        bottom="0"
                        left="0"
                        w="100%"
                        bg="rgba(40,55,50,0.96)"
                        backdropFilter="blur(8px)"
                        borderTop="1px solid rgba(235,235,235,0.15)"
                        py={4}
                        px={6}
                        zIndex={1000}
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        gap={3}
                    >
                        <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="brand.secondary" fontWeight="600">
                            Todavía no elegiste ningún turno
                        </Text>
                        <Button
                            size="sm"
                            bg="brand.secondary"
                            color="brand.primary"
                            borderRadius="xl"
                            fontFamily="'Questrial', sans-serif"
                            fontWeight="700"
                            px={6}
                            _hover={{ bg: "white" }}
                            onClick={() => setShowSelectModal(true)}
                        >
                            Asignar turno
                        </Button>
                    </MotionBox>
                )}

                {user?.rol === 'usuario' && mostrarBannerAjusteOriginal && (
                    <MotionBox
                        key="banner-ajuste"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        position="fixed"
                        bottom="0"
                        left="0"
                        w="100%"
                        bg="rgba(40,55,50,0.96)"
                        backdropFilter="blur(8px)"
                        borderTop="1px solid rgba(235,235,235,0.15)"
                        py={4}
                        px={6}
                        zIndex={1000}
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        gap={3}
                    >
                        <Text fontFamily="'Questrial', sans-serif" fontSize="sm" color="brand.secondary" fontWeight="600">
                            Tus días semanales cambiaron. Debés ajustar tus turnos originales.
                        </Text>
                        <Button
                            size="sm"
                            bg="brand.secondary"
                            color="brand.primary"
                            borderRadius="xl"
                            fontFamily="'Questrial', sans-serif"
                            fontWeight="700"
                            px={6}
                            _hover={{ bg: "white" }}
                            onClick={() => setShowSelectModal(true)}
                        >
                            Ajustar turnos
                        </Button>
                    </MotionBox>
                )}
            </AnimatePresence>
        </MotionBox>
    );
};

export default CalendarioPage;
