'use strict';

import AuthService from './../../../service/AuthService';
import API from '../../../Api';

export default {
    state: {
        user: {
            id_user: '',
            logged: null,
            name: '',
            role: '',
            email: '',
            token: '',
            status: ''
        }
    },
    getters: {
        getStateLog: state => state.user.logged,
        getUserLogged: state => state.user
    },
    mutations: {
        setLoggedUser(state, payload) {
            state.user.id_user = payload.id_user;
            state.user.logged = payload.id_user ? true : false;
            state.user.name = payload.name;
            state.user.role = payload.role;
            state.user.email = payload.email;
            state.user.token = payload.token;
            state.user.status = payload.status;
        },
        loggoutUser(state) {
            state.user.id_user = '';
            state.user.logged = null;
            state.user.name = '';
            state.user.role = '';
            state.user.email = '';
            state.user.token = '';
            state.user.status = '';
        }
    },
    actions: {
        loadLoggedUser(context) {
            try {
                let loggedUser = AuthService.getLoggedUser();

                if (loggedUser && loggedUser.id_user) {
                    API.defaults.headers['x-access-token'] = loggedUser.token;
                    context.commit('setLoggedUser', loggedUser);
                }
            } catch (error) {
                console.log(error);
            }
        },
        logoffUser(context) {
            try {
                AuthService.removeUserFromLocalStorage();
                API.defaults.headers['x-access-token'] = '';
                context.commit('loggoutUser');
                location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }
};
