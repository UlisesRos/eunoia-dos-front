import { Flex, Box, Heading } from '@chakra-ui/react';
import SidebarMenu from '../components/SidebarMenu';
import Footer from '../components/Footer';
import 'animate.css';

const Home = () => {
    return (
        <Flex direction={{ base: 'column', md: 'row' }} h='100vh' bg='brand.primary'>
            <SidebarMenu />
            <Box w={['100%','100%','86%']} h={['90vh', '100vh', '100vh']} mb={['100px', '0px', '0px']} display='flex' flexDir='column' alignItems='center' justifyContent='center' bg='brand.primary' color='brand.secondary' textAlign='center'>
                <Heading
                    fontFamily="'Playfair Display', serif"
                    fontWeight="700"
                    fontSize={['65px', '70px', '100px']}
                    letterSpacing="15px"
                    color="brand.secondary"
                    textShadow="0 0 5px #6A8677, 0 0 10px #8fa99b, 0 0 20px #a7c3b3"
                    className='animate__animated animate__backInDown'
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
                    className='animate__animated animate__backInUp'
                    >Estudio</Heading>
                <Box
                    display='flex'
                    position='absolute'
                    bottom={['20', '8', '8']}
                    className='animate__animated animate__fadeInUp'
                    >
                    <Footer />
                </Box>
            </Box>
        </Flex>
    );
};

export default Home;
