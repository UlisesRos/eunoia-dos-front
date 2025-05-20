import { Flex, Box, Heading } from '@chakra-ui/react';
import SidebarMenu from '../components/SidebarMenu';
import Footer from '../components/Footer';

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
                    textShadow="0 0 5px #6A8677, 0 0 10px #8fa99b, 0 0 20px #a7c3b3"
                    >EUNOIA</Heading>
                <Heading
                    mb='150px'
                    fontFamily="'Playfair Display', serif"
                    fontWeight="500"
                    fontSize={['50px', '55px', '60px']}
                    letterSpacing="widest"
                    textTransform="uppercase"
                    color="brand.secondary"
                    textShadow="0 0 5px #6A8677, 0 0 10px #8fa99b, 0 0 20px #a7c3b3"
                    >Estudio</Heading>
                <Box
                    display='flex'
                    position='absolute'
                    bottom='8'
                    >
                    <Footer />
                </Box>
            </Box>
        </Flex>
    );
};

export default Home;
