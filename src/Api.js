import axios from 'axios';
import config from '../config';
import Store from './store';
const instance = axios.create({
    baseURL: config.apiHost
});

instance
    .get('get-helpers')
    .then(res => {
        Store.commit('apiHelper/setHelpers', res.data);
    })
    .catch(console.log);

const isAuthenticationError = response => {
    const errorCode = response?.data?.code;
    return Store.getters['apiHelper/userHelpers'].errosWithRequiresLogin.includes(errorCode);
};

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const { response } = error;

        if (isAuthenticationError(response)) Store.dispatch('logoffUser');

        return Promise.reject(error);
    }
);

export default instance;
