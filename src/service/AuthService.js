'use strict';

import Axios from 'axios';
import config from '../../config';
const url = config.apiHost;
//import API from '../Api';

export default class AuthService {
    //--------------------------local-storage--------------------------//
    static getLoggedUser() {
        return JSON.parse(localStorage.getItem('loggedUser'));
    } // getLoggedUser()
    static getEntites() {
        return JSON.parse(localStorage.getItem('entities'));
    }

    static async getTokenUser() {
        let user = await AuthService.getLoggedUser();
        if (user != null) {
            return user.token;
        } else return null;
    } //getTokenUser()

    static setUserInLocalStorage(user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        return true;
    } //setUserInLocalStorage

    static removeUserFromLocalStorage() {
        localStorage.removeItem('loggedUser');
        return true;
    } //removeUserFromLocalStorage

    static getOneComapanyOfUser(company) {
        let index = -1;
        let loop = true;
        let entities = new Array();
        let user = AuthService.getLoggedUser();
        for (let i = 0; i < user.access.length && loop; i++) {
            //encontra a empresa
            if (user.access[i].company._id == company) {
                index = i;
                loop = false;
            }
        }
        const entitiesAccess = user.access[index].entities;
        for (let i = 0; i < entitiesAccess.length; i++) {
            //devolve acessos
            entities.push(entitiesAccess[i]);
        }
        return entities;
    }

    //--------------------------AUTH--------------------------//
    static async authenticate(user) {
        try {
            let authUser = await Axios.post(`${url}auth`, user);
            return authUser.data;
        } catch (error) {
            throw error.response.data;
        }
    } // authenticate()

    //--------------------------CRUD--------------------------//
    static async getAll() {
        try {
            let users = await Axios.get(url + 'users');
            return users.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()

    static async save(user) {
        try {
            let userSaved = await Axios.post(url + 'users', user);
            return userSaved.data;
        } catch (error) {
            throw error.response.data;
        }
    } // save()

    static async update(user) {
        try {
            let userUpdated = await Axios.put(url + 'users', user);
            return userUpdated.data;
        } catch (error) {
            throw error.response.data;
        }
    } // update()

    static async remove(user) {
        try {
            await Axios.delete(url + 'users', {
                data: user
            });
        } catch (error) {
            throw error.response.data;
        }
    } // remove()

    static async getUserByUsername(user) {
        try {
            let u = await Axios.post(url + 'username', user);
            console.log(JSON.stringify(u));
            return u.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getUserByUsername()

    static async firstAccess(user) {
        try {
            return await Axios.post(url + 'first_access', user);
        } catch (error) {
            console.log(JSON.stringify(error));
            throw error.response.data;
        }
    }
} // class
