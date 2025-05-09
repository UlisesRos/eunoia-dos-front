import { Flex, Box, Heading } from '@chakra-ui/react';
import SidebarMenu from '../components/SidebarMenu';

const Home = () => {
    return (
        <Flex direction={{ base: 'column', md: 'row' }} h='100vh' >
            <SidebarMenu />
            <Box w={['100%','100%','86%']} h='100vh' display='flex' flexDir='column' alignItems='center' justifyContent='center' bg='brand.primary' color='brand.secondary' textAlign='center'>
                <Heading
                    fontFamily="'Playfair Display', serif"
                    fontWeight="700"
                    fontSize={['65px', '70px', '100px']}
                    letterSpacing="wide"
                    color="brand.secondary"
                    >EUNONIA</Heading>
                <Heading
                    fontFamily="'Playfair Display', serif"
                    fontWeight="500"
                    fontSize={['50px', '55px', '60px']}
                    letterSpacing="widest"
                    textTransform="uppercase"
                    color="brand.secondary"
                    >Estudio</Heading>
            </Box>
        </Flex>
    );
};

export default Home;
