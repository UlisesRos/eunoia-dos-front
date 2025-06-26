import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Spinner,
  Flex,
  Image,
  useBreakpointValue,
  Button,
  useDisclosure,
  Tooltip,
  Input,
  Portal
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import logo from '../../img/logos/faviconE.png';
import { useNavigate } from 'react-router-dom';
import ModalEditarUsuario from './ModalEditarUsuario';
import axios from 'axios';
import pagado from '../../img/pagado.png';
import noPagado from '../../img/nopago.png';
import backendUrl from '../../config';


const TablaUsuariosPilates = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null); 
  const [busqueda, setBusqueda] = useState('');
  const [filtroPago, setFiltroPago] = useState('todos');

  const navigate = useNavigate();

  // Tamaños responsivos para fuente en tabla
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });

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
      const updatedPago = !currentPago;

      // Petición al backend que devuelve el usuario actualizado
      const res = await axios.patch(`${backendUrl}/api/usuarios/updatePago/${userId}`, {
        pago: updatedPago,
      });

      // Actualizar el estado local con los datos completos del usuario actualizado
      setUsuarios((prev) =>
        prev.map((u) => (u._id === userId ? res.data : u))
      );
    } catch (error) {
      console.error('Error al actualizar pago:', error);
      alert('No se pudo actualizar el estado de pago.');
    }
};

  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="brand.primary"
      color="brand.secondary"
      minH="100vh"
    >
      <Box
          bg='brand.primary'
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          mb={8}
          >
          <Image src={logo} borderRadius='100%' w={{ base: "180px", md: "150px" }}/>
          <Button onClick={() => navigate('/calendario')} border='solid 1px' borderColor='brand.secondary' bg='brand.primary' color='brand.secondary' fontWeight='bold'>
            Volver al Calendario
          </Button>
      </Box>
      <Heading
        size={headingSize}
        mb={{ base: 4, md: 4 }}
        textAlign="center"
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        letterSpacing="wide"
        textTransform="capitalize"
        color="brand.secondary"
        textShadow="0 0 5px #6A8677, 0 0 10px #8fa99b, 0 0 20px #a7c3b3"
      >
        Registro de Clientes
      </Heading>

      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : (
        // Habilitamos scroll horizontal en pantallas pequeñas
        <Box overflowX="auto" maxW="100%">
          <Flex mb={4} flexDir={{ base: 'column', md: 'row' }} gap={4} align="center" justify="center">
            <Input
              placeholder="Buscar por nombre o apellido"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              _placeholder={{ color: 'white' }}
              bg="brand.primary"
              color="white"
              border="2px solid #ccc"
              borderRadius="8px"
              w="250px"
              px="8px"
              />
            <select
              value={filtroPago}
              onChange={(e) => setFiltroPago(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '2px solid #ccc',
                width: '250px',
                backgroundColor: '#6A8677',
              }}
            >
              <option value="todos">Todos</option>
              <option value="pagado">Pagaron</option>
              <option value="noPagado">No Pagaron</option>
            </select>
          </Flex>

            <Heading
              textAlign='center'
              fontSize='lg'
              color='green'
              mb={3}
              >
              {usuarios.filter((user) => user.rol !== 'admin').length} Usuarios Registrados
            </Heading>

          <TableContainer>
            <Table
              variant="simple"
              color="brand.secondary"
              textTransform="capitalize"
              size={fontSize === 'sm' ? 'sm' : 'md'}
              minW="600px" // evita que la tabla quede demasiado estrecha
            >
              <Thead>
                <Tr>
                  <Th color="brand.secondary" fontSize={fontSize}>
                    N°
                  </Th>
                  <Th color="brand.secondary" fontSize={fontSize}>
                    Nombre
                  </Th>
                  <Th color="brand.secondary" fontSize={fontSize}>
                    Apellido
                  </Th>
                  <Th color="brand.secondary" fontSize={fontSize}>
                    Email
                  </Th>
                  <Th color="brand.secondary" fontSize={fontSize}>
                    Pago
                  </Th>
                  <Th color='brand.secondary' fontSize={fontSize}>
                    Fecha de Pago
                  </Th>
                  <Th color="brand.secondary" fontSize={fontSize}>
                    Acciones
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {usuarios
                  .filter((user) => {
                    const nombreCompleto = `${user.nombre} ${user.apellido}`.toLowerCase();
                    return nombreCompleto.includes(busqueda.toLowerCase());
                  })
                  .filter((user) => {
                    if (filtroPago === 'pagado') return user.pago === true;
                    if (filtroPago === 'noPagado') return user.pago === false;
                    return true;
                  })
                  .filter((user) => user.rol !== 'admin')
                  .map((user, index) => (
                  <Tr key={user._id} fontSize={fontSize}>
                    <Td>{index + 1}</Td>
                    <Td>
                      <Popover trigger="click" placement="bottom">
                        <PopoverTrigger>
                          <Box as="span" cursor="pointer" fontWeight="bold">
                            {user.nombre}
                          </Box>
                        </PopoverTrigger>
                        <Portal>
                          <PopoverContent
                            bg="gray.700"
                            color="white"
                            whiteSpace="pre-line"
                            width="auto"
                            minW="200px"
                            maxW="95vw"
                            px={4}
                            py={2}
                            overflowWrap="break-word"
                            wordBreak="break-word"
                            >
                              <PopoverArrow />
                              <PopoverBody whiteSpace="pre-line" >
                                Celular: {user.celular}{"\n"}
                                Días x Semana: {user.diasSemanales} días{"\n"}
                                Registrado: {new Date(user.fechaRegistro).toLocaleDateString()}
                              </PopoverBody>
                          </PopoverContent>
                        </Portal>
                      </Popover>
                    </Td>
                    <Td>{user.apellido}</Td>
                    <Td textTransform="lowercase">{user.email}</Td>
                    <Td w='50px'>
                      <Tooltip
                        label={user.pago ? 'Cambiar a no pagado' : 'Cambiar a pagado'}
                        aria-label="Tooltip pago"
                        hasArrow
                        placement='left'
                        bg="gray.700"
                        color="white"
                      >
                        <Box
                          as="span"
                          cursor="pointer"
                          textDecoration="underline"
                          onClick={() => handleTogglePago(user._id, user.pago)}
                          userSelect="none"
                        >
                          <Image w='40px' display={user.pago === true ? 'block' : 'none'} src={pagado} />
                          <Image w='40px' display={user.pago === false ? 'block' : 'none'} src={noPagado}/>
                        </Box>
                      </Tooltip>
                    </Td>
                    <Td>
                      {user.fechaPago ? new Date(user.fechaPago).toLocaleDateString() : '-'}
                    </Td>

                    <Td>
                      <Flex
                        gap={2}
                        >
                        <Button
                          _hover={{
                            bg: 'red.500'
                          }}
                          onClick={() => handleDelete(user._id)}
                          >
                          Eliminar
                        </Button>
                        <Button
                          onClick={() => handleEdit(user)}
                          >
                          Editar
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <ModalEditarUsuario
            isOpen={isOpen}
            onClose={onClose}
            user={selectedUser}
            onUsuarioActualizado={handleUsuarioActualizado}
          />
        </Box>
      )}
    </Box>
  );
};

export default TablaUsuariosPilates;

