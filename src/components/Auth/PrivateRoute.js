// src/components/Auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center minH="100vh">
                <Spinner size="xl" />
            </Center>
        );  
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
