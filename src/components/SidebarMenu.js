import {
    Box,
    Button,
    VStack,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    IconButton,
    useDisclosure,
    useBreakpointValue,
    Flex,
    Image
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logos/faviconE.png';

const SidebarMenu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const MenuContent = () => (
        <Flex
            flexDir='column'
            justifyContent='space-between'
            h='full'
            >
            <VStack spacing={4} align="stretch">
                <Button 
                    onClick={() => { navigate('/login'); onClose(); }}
                    >
                    Iniciar sesión
                </Button>
                <Button 
                    onClick={() => { navigate('/register'); onClose(); }}
                    >
                    Registrarse
                </Button>
            </VStack>
            <Image
                alignSelf='center'
                src={logo}
                objectFit='cover'
                alt="Logo Eudonia"
                borderRadius='full'
                onClick={() => navigate('/')}
                cursor='pointer'
                w={['180px', '150px','120px']}
                mb={[3,3,0]}
                />
        </Flex>
    );

    if (isMobile) {
      // Mobile (Drawer con botón de cerrar)
        return (
            <Box bg='brand.primary'>
                <IconButton
                    icon={<HamburgerIcon boxSize='60px' />}
                    aria-label="Abrir menú"
                    m={6}
                    onClick={onOpen}
                />
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bg='brand.secondary'>
                    <DrawerHeader>
                        <Flex justify="space-between" align="center">
                        Menú
                        <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            onClick={onClose}
                            aria-label="Cerrar menú"
                        />
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody>
                        <MenuContent />
                    </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Box>
        );
    }

    // Desktop
    return (
        <Box p={4} bg="brand.secondary" minH="100vh" width="200px">
            <MenuContent />
        </Box>
    );
};

export default SidebarMenu;
