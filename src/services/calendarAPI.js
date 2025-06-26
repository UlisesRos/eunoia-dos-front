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

export const setUserSelections = async (selections, forzarReset = false) => {
    const res = await axios.post(`${API_URL}/asignar-turnos`, { selections, forzarReset }, getAuthHeaders());
    return res.data;
};

export const resetUserSelections = async () => {
    const res = await axios.post(`${API_URL}/reset-temporales`, {}, getAuthHeaders());
    return res.data;
};

export const cancelarTurnoTemporalmente = async (day, hour) => {
    const res = await axios.post(`${API_URL}/cancelar-temporalmente`, { day, hour }, getAuthHeaders());
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

export const quitarFeriado = async (date) => {
    const res = await axios.post(`${API_URL}/quitar-feriado`, { date }, getAuthHeaders());
    return res.data;
};

export const guardarTurnoParaRecuperar = async (day, hour) => {
    const res = await axios.post(`${API_URL}/guardar-para-recuperar`, { day, hour }, getAuthHeaders());
    setTimeout(() => {
        window.location.reload();
    }, 1000); 
    return res.data;
};

export const listarTurnosRecuperables = async () => {
    const res = await axios.get(`${API_URL}/turnos-recuperables`, getAuthHeaders());
    return res.data;
};

export const usarTurnoRecuperado = async (turnId, day, hour) => {
    const res = await axios.post(`${API_URL}/usar-turno-recuperado`, { turnId, day, hour }, getAuthHeaders());
    return res.data;
};

