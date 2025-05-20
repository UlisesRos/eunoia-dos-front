import axios from 'axios';

const API_URL = 'http://localhost:5000/api/calendar';

// Esta función siempre obtiene el token actual
const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export const getUserSelections = async () => {
    const res = await axios.get(`${API_URL}/mis-turnos`, getAuthHeaders());
    return res.data;
};

export const setUserSelections = async (selections) => {
    const res = await axios.post(`${API_URL}/asignar-turnos`, { selections }, getAuthHeaders());
    window.location.reload(); 
    return res.data;
};

export const getTurnosPorHorario = async () => {
    const res = await axios.get(`${API_URL}/turnos`, getAuthHeaders());
    return res.data;
};


