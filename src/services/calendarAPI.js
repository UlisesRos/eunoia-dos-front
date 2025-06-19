import axios from 'axios';
import backendUrl from '../config';

const API_URL = `${backendUrl}/api/calendar`;

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

export const getFeriados = async () => {
    const res = await axios.get(`${API_URL}/feriados`, getAuthHeaders());
    return res.data;
};

export const marcarFeriado = async (date) => {
    const res = await axios.post(`${API_URL}/feriado`, { date }, getAuthHeaders());
    return res.data;
};


