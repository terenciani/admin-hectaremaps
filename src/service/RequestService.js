'use strict';
import API from '../Api';
import AuthService from './AuthService';
export default class RequestService {
    static async createRequest(selectedServices, plan) {
        try {
            let response = await API.post('request', {
                selectedServices,
                plan
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

    static async getRequestActivesByUser() {
        try {
            let user = AuthService.getLoggedUser();
            let response = await API.get('request/' + user.id_user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // createRequest()
    static async getRequestImages(request) {
        try {
            let response = await API.get('request/images/' + request);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getRequestImages()
} // class
