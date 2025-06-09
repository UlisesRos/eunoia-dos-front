import { Button, Box, Heading, Text, Spinner, Flex, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFilteredWeeks } from '../utils/calendarUtils';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import EditSingleTurnModal from '../components/Modals/EditSingleTurnModal';
import AdminEditTurnModal from '../components/Modals/AdminEditTurnModal';
import SelectDaysModal from '../components/Modals/SelectDaysModal';
import { getTurnosPorHorario, getUserSelections } from '../services/calendarAPI';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@chakra-ui/react';
import logo from '../img/logos/faviconE.png';


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

        useEffect(() => {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500); // Simula 1.5 segundos de carga

            return () => clearTimeout(timer);
        }, []);

        // Estado para mes y año seleccionados (por defecto hoy)
        const selectedMonth = today.getMonth();
        const selectedYear = today.getFullYear();
        const currentWeek = 1;
        const [turnos, setTurnos] = useState([]);

        // Modal para seleccionar días y horarios
        const [showSelectModal, setShowSelectModal] = useState(false);

        const filteredWeeks = getFilteredWeeks(selectedMonth, selectedYear);
        const weekData = filteredWeeks.find(week => week.weekNumber === currentWeek);
        const weekDates = weekData ? weekData.dates || weekData.weekDates : [];
    ;

        const { user, logout } = useAuth();
        const navigate = useNavigate();
        const toast = useToast();

        // Logout del usuario
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

        // Obtener selecciones y cambios
        useEffect(() => {
            if (!user) return;

            getUserSelections()
                .then((data) => {
                    const { selections, changesThisMonth } = data;
                    setUserSelectionsState(selections || []);
                    setCambiosRestantes(2 - (changesThisMonth || 0));

                    if (!selections || selections.length === 0) {
                        if (user.rol === 'admin') {
                            setShowSelectModal(false);
                            return
                        }
                        setShowSelectModal(true);
                    }

                })
                .catch(() => {
                    // En caso de error, también mostramos modal para que pueda elegir
                    setShowSelectModal(true);
                });
        }, [user]);

        useEffect(() => {
            getTurnosPorHorario()
                .then(setTurnos)
                .catch(() => console.error('No se pudieron obtener los turnos.'));
        }, []);

        const estaBloqueadoPorPago = (user) => {
            const hoy = new Date();
            const diaDelMes = hoy.getDate();

            return !user.pago && diaDelMes > 10;
        };

        const handleNombreClick = (dia, hora, clickedUser) => {
            console.log(clickedUser)
            if (user.rol === 'admin') {
                setSelectedUsuario(clickedUser);
                setHorarioActual({ day: dia, hour: hora });
                setShowAdminModal(true);
            } else if (`${user.nombre} ${user.apellido}` === clickedUser?.nombre) {
                setHorarioActual({ day: dia, hour: hora });
                setShowEditModal(true);
            }
        };

        if (isLoading) {
        return (
            <Box
            p={10}
            textAlign="center"
            minH="80vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            >
                <Spinner size="xl" thickness="4px" speed="0.65s" color="teal.500" mb={4} />
                <Heading size="md" mb={2}>Cargando calendario...</Heading>
                <Text>Por favor espera unos segundos...</Text>
            </Box>
        );    
    }

        return (
            <Box    
                w="100vw"
                maxW="100%"
                overflowX="hidden"
                p={{ base: 4, md: 6 }}
                bg="brand.primary"
                color="brand.secondary"
                minH="100vh"
                >
                <Box
                    bg='brand.primary'
                    display='flex'
                    justifyContent='center'
                    >
                    <Image src={logo} borderRadius='100%' w='150px'/>
                </Box>
                <Heading
                    textAlign="center"
                    fontFamily="'Playfair Display', serif"
                    fontWeight="700"
                    letterSpacing="wide"
                    textTransform="capitalize"
                    color="brand.secondary"
                    textShadow="0 0 5px #6A8677, 0 0 10px #8fa99b, 0 0 20px #a7c3b3"
                    mb={4}
                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                    display={user.rol === 'usuario' ? 'block' : 'none'}
                    >
                    Calendario - {monthNames[selectedMonth]} {selectedYear} <br/> Usuario: {user?.nombre}, {user?.apellido}
                </Heading>
                <Heading
                    textAlign="center"
                    fontFamily="'Playfair Display', serif"
                    fontWeight="700"
                    letterSpacing="wide"
                    textTransform="capitalize"
                    color="brand.secondary"
                    textShadow="0 0 5px #6A8677, 0 0 10px #8fa99b, 0 0 20px #a7c3b3"
                    mb={4}
                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                    display={user.rol === 'admin' ? 'block' : 'none'}
                    >
                    Calendario - {monthNames[selectedMonth]} {selectedYear} <br/> Admin: {user?.nombre}, {user?.apellido}
                </Heading>

                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ base: 'center', md: 'center' }}
                    gap={4}
                    mb={4}
                    >
                    <Flex
                        flexDir={{ base: 'column', md: 'row' }}
                        justifyContent='space-between'
                        alignItems='center'
                        w='100%'
                        gap={4}
                        >
                        <Button w={{ base: '80%', md: 'auto' }} fontSize={{ base: 'sm', md: 'md' }} colorScheme="red" onClick={handleLogout} border='solid 2px' borderColor='brand.secondary' bg='brand.primary' color='brand.secondary' fontWeight='bold'>
                            Cerrar sesión
                        </Button>
                        
                        <Button display={user.rol === 'usuario' ? 'block' : 'none'} w={{ base: '80%', md: 'auto' }} fontSize={{ base: 'sm', md: 'md' }} colorScheme="red" onClick={() => navigate('/perfil')} border='solid 2px' borderColor='brand.secondary' bg='brand.primary' color='brand.secondary' fontWeight='bold'>
                            Mi perfil
                        </Button>
                        
                        <Button display={user.rol === 'admin' ? 'block' : 'none'} w={{ base: '80%', md: 'auto' }} fontSize={{ base: 'sm', md: 'md' }} colorScheme="red" onClick={() => navigate('/registro')} border='solid 2px' borderColor='brand.secondary' bg='brand.primary' color='brand.secondary' fontWeight='bold'>
                            Registro de clientes
                        </Button>

                    </Flex>
                </Flex>

                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    alignItems={{ base: 'center', sm: 'center' }}
                    gap={4}
                    m={{ base: '20px 0', md: '30px 0 30px 10px' }}
                    display={user.rol === 'admin' ? 'none' : 'flex'}
                    >
                    {}
                    <Text fontWeight="bold">
                        Cambios Mensuales Restantes: {cambiosRestantes} / 2
                    </Text>

                    <Text
                        display={cambiosRestantes > 0 ? 'none' : 'block'}
                        fontWeight="bold"
                        color='red.500'
                        >
                        No tienes mas cambios disponibles este mes.
                    </Text>

                    {estaBloqueadoPorPago(user) && (
                        <Text
                            color='red.500'
                            fontWeight='bold'
                            fontSize='sm'
                            >
                            Cambios bloqueados por falta de pago.
                        </Text>
                    )}

                </Flex>

                {isLoading ? (
                    <Flex
                        flexDir='column'
                        alignItems='center'
                        justifyContent='center'
                        minH="30vh"
                    >
                        <Spinner size="xl" thickness="4px" speed="0.65s" color="teal.500" mb={4} />
                        <Text textAlign="center" color="brand.secondary" fontWeight="bold">
                            Cargando turnos...
                        </Text>
                    </Flex>
                ) : (
                    <CalendarGrid weekDates={weekDates} turnos={turnos} onNombreClick={handleNombreClick}/>
                )}


                {/* Modal para elegir días y horarios */}
                <SelectDaysModal
                    isOpen={showSelectModal}
                    onClose={() => setShowSelectModal(false)}
                    diasSemanales={user?.diasSemanales || 1}
                    existingSelections={userSelections}
                    cambiosRestantes={cambiosRestantes}
                    turnosOcupados={turnos}
                    onUpdate={() => {
                        // Cuando el usuario guarda cambios, recargamos las selecciones
                        getUserSelections()
                            .then((data) => {
                                setUserSelectionsState(data.selections || []);
                                setCambiosRestantes(2 - (data.changesThisMonth || 0));
                            })
                    }}
                />

                <EditSingleTurnModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    userSelections={userSelections}
                    turnosOcupados={turnos}
                    cambiosRestantes={cambiosRestantes}
                    horarioActual={horarioActual}
                    onUpdate={() => {
                        getUserSelections().then(data => {
                            setUserSelectionsState(data.selections || []);
                            setCambiosRestantes(2 - (data.changesThisMonth || 0));
                        });
                        getTurnosPorHorario().then(setTurnos);
                    }}
                />

                <AdminEditTurnModal
                    isOpen={showAdminModal}
                    onClose={() => setShowAdminModal(false)}
                    selectedUser={selectedUsuario}
                    horarioActual={horarioActual}
                    turnosOcupados={turnos}
                    onUpdate={() => {
                        getTurnosPorHorario().then(setTurnos);
                        getUserSelections().then(data => {
                        setUserSelectionsState(data.selections || []);
                        setCambiosRestantes(2 - (data.changesThisMonth || 0));
                        });
                    }}
                />

                {user?.rol === 'usuario' && userSelections.length === 0 && (
                    <Box
                        position="fixed"
                        bottom="0"
                        left="0"
                        w="100%"
                        bg="rgba(0, 0, 0, 0.85)"
                        color="white"
                        py={4}
                        px={6}
                        zIndex={1000}
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        gap={3}
                        boxShadow="0 -2px 8px rgba(0,0,0,0.3)"
                    >
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold">
                            Todavía no elegiste ningún turno
                        </Text>
                        <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => setShowSelectModal(true)}
                        >
                            Asignar turno
                        </Button>
                    </Box>
                )}

            </Box>
        );
};

export default CalendarioPage;



