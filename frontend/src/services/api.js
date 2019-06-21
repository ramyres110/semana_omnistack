import axios from 'axios';
import server from '../config/server';

const api = axios.create({
    baseURL: server.host,
})

export default api;