'use strict';
import API from '../Api';
import AuthService from './AuthService';
export default class RequestService {
    static async getRequestData(requestId) {
        try {
            let response = await API.get('request/data/' + requestId);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getRequestData()
    static async getAllRequests() {
        try {
            let response = await API.get('request');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAllUserRequests()
    static async createRequest(selectedServices, plan, description) {
        try {
            let response = await API.post('request', {
                selectedServices,
                plan,
                description
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // createRequest()
    static async cancelRequest(requestId) {
        try {
            let response = await API.delete('request', {
                data: { request: requestId }
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // cancelRequest()
    static async cancelLocalRequest(requestId) {
        console.log('aqui');
        try {
            let response = await API.delete('request/local', {
                data: { request: requestId }
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // cancelRequest()

    static async getRequestActivesByUser() {
        try {
            let user = AuthService.getLoggedUser();
            let response = await API.get('request/' + user.id_user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // createRequest()
    static async getAllUserRequests() {
        try {
            let user = AuthService.getLoggedUser();
            let response = await API.get('request/all/' + user.id_user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAllUserRequests()
    static async getRequestImages(request) {
        try {
            let response = await API.get('request/images/' + request);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getRequestImages()
    static async update(request) {
        try {
            let response = await API.put('request', request);
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // update()
} // class
