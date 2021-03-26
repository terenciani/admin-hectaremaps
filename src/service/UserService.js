'use strict';
import API from '../Api';
import UtilFormatter from '../utils/UtilFormatter';
import md5 from 'md5';

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
    static async update(userData) {
        let preparedUser = {
            email: userData.email.toLowerCase(),
            name: await UtilFormatter.capitalizeCase(userData.name),
            phone: await UtilFormatter.unMaskPhone(userData.phone),
            lastname: await UtilFormatter.capitalizeCase(userData.lastname),
            role: userData.role,
            status: userData.status
        };
        try {
            let response = await API.put('users', preparedUser);
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // update()
    static async save(userData) {
        let preparedUser = {
            email: userData.email.toLowerCase(),
            name: await UtilFormatter.capitalizeCase(userData.name),
            phone: await UtilFormatter.unMaskPhone(userData.phone),
            lastname: await UtilFormatter.capitalizeCase(userData.lastname),
            password: await md5(userData.password)
        };
        try {
            let message = await API.post('signup', preparedUser);
            return message.data;
        } catch (error) {
            throw 'Não foi possível efetuar o cadastro. Tente mais tarde!';
        }
    } // signUp()
} // class
