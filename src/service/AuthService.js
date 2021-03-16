'use strict';
var md5 = require('md5');
import API from '../Api';

export default class AuthService {
    //--------------------------AUTH--------------------------//
    static async signIn({ email, password }) {
        let passwordMd5 = md5(password);
        try {
            let response = await API.post('signin', {
                email: email.toLowerCase(),
                password: passwordMd5
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // signIn()

    static async recovery(email) {
        try {
            let response = await API.post('recovery', {
                email: email.toLowerCase()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // recovery()

    //--------------------------local-storage--------------------------//
    static getLoggedUser() {
        return JSON.parse(localStorage.getItem('loggedUser'));
    } // getLoggedUser()

    static async getTokenUser() {
        let user = await AuthService.getLoggedUser();
        if (user != null) return user.token;
        return null;
    } //getTokenUser()

    static async getRoleUser() {
        let user = await AuthService.getLoggedUser();
        if (user != null) return user.role;
        return null;
    } //getRoleUser()

    static setUserInLocalStorage(user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        return true;
    } //setUserInLocalStorage

    static removeUserFromLocalStorage() {
        localStorage.removeItem('loggedUser');
        return true;
    } //removeUserFromLocalStorage
} // class
