import { Box, Text, Heading, Flex, Button, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from '../../config';

const API_URL = `${backendUrl}/api/info`;

const InfoModal = () => {
    const [visible, setVisible] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        description: '',
        link: ''
    });

    useEffect(() => {
        const fetchModalData = async () => {
            try {
                const res = await axios.get(`${API_URL}/info-modal`);
                const { title, description, link } = res.data || {};

                if (title || description || link) {
                    setModalData({ title, description, link });
                    setVisible(true);
                }
            } catch (err) {
                console.error("Error cargando info del modal:", err);
            }
        };

        fetchModalData();
    }, []);

    if (!visible) return null;

    return (
        <Box
            w={['90%', '80%', '40%']}
            bg="white"
            color="black"
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            position="fixed"
            top={['40%','40%',"30%"]}
            left="50%"
            transform="translate(-50%, -20%)"
            zIndex="999"
            border='2px solid black'
        >
            <Flex direction="column" align="center" gap={4}>
                <Heading size="lg" textAlign="center" color='brand.primary'>{modalData.title}</Heading>
                <Text fontSize="md" textAlign="center" fontWeight='bold' color='brand.primary'>{modalData.description}</Text>
                {modalData.link && (
                    <Link href={modalData.link} target="_blank" color="teal.500" fontWeight="bold">
                        Más información
                    </Link>
                )}
                <Button colorScheme="teal" variant="solid" onClick={() => setVisible(false)}>
                    OK
                </Button>
            </Flex>
        </Box>
    );
};

export default InfoModal;
