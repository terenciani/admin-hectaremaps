'use strict';
import API from '../Api';
import UtilFormatter from '../utils/UtilFormatter';
import AuthService from './AuthService';

import md5 from 'md5';
import axios from 'axios';

export default class UserService {
    static async searchCEP(cep) {
        try {
            const { data } = await axios.get(
                `https://viacep.com.br/ws/${cep}/json/`
            );
            return {
                address: data.logradouro,
                complement: data.complemento,
                district: data.bairro,
                city: data.localidade,
                uf: data.uf
            };
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async getAll() {
        try {
            let response = await API.get('users');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()
    static async getUserData() {
        try {
            let user = await AuthService.getLoggedUser();
            let response = await API.get('users/' + user.id_user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getUserData()

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

    static async registrationUpdate(userData) {
        let preparedUser = {
            email: userData.email,
            name: await UtilFormatter.capitalizeCase(userData.name),
            phone: await UtilFormatter.unMaskPhone(userData.phone),
            lastname: await UtilFormatter.capitalizeCase(userData.lastname),
            cpf: userData.cpf,
            cep: userData.cep,
            address: userData.address,
            number: userData.number,
            complement: userData.complement,
            district: userData.district,
            city: userData.city,
            uf: userData.uf
        };
        try {
            let response = await API.put('users/registration', preparedUser);
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
    static async updateEmail(newEmail) {
        try {
            let user = await AuthService.getLoggedUser();

            let message = await API.post(
                'emailupdate',
                Object.assign({}, user, { newEmail: newEmail })
            );
            return message.data;
        } catch (error) {
            throw 'Não foi possível efetuar o cadastro. Tente mais tarde!';
        }
    } // updateEmail()
    static async updatePassword(password) {
        try {
            let user = await AuthService.getLoggedUser();

            let message = await API.post(
                'passwordupdate',
                Object.assign({}, user, { newPassword: md5(password.new) })
            );
            return message.data.message;
        } catch (error) {
            throw 'Não foi possível atualizar a senha. Tente mais tarde!';
        }
    } // updateEmail()
} // class
