import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center minH="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.rol !== 'admin') {
        return <Navigate to="/acceso-denegado" />; // o muestra un mensaje de "acceso denegado"
    }

    return children;
};

export default AdminRoute;