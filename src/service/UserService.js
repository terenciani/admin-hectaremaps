'use strict';
import API from '../Api';

export default class UserService {
    static async getAll() {
        try {
            let response = await API.get('users');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()
    static async remove(user) {
        try {
            let response = await API.delete('users', { data: user });
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // getAll()
} // class
