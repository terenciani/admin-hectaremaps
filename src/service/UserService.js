'use strict';
import API from '../Api';

export default class UserService {
    static async getAll() {
        try {
            let users = await API.get('users');
            return users.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()
} // class
