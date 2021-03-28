'use strict';
import API from '../Api';

export default class ServiceService {
    static async getAll() {
        try {
            let response = await API.get('service');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()
} // class
