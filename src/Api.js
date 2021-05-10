import axios from 'axios';
import config from '../config';
const instance = axios.create({
    baseURL: config.apiHost
});

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const { response } = error;

        if (response.status === 498) {
            window.location.href = '/expired';
        }
    }
);

export default instance;
