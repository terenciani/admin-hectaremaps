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
    static async save(file, service, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('service', JSON.stringify(service));
        try {
            let serviceData = await API.post(`service`, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            return serviceData.data;
        } catch (error) {
            throw error.response.data;
        }
    } // save()
    static async remove(service) {
        try {
            let response = await API.delete('service', {
                data: service
            });
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // remove()
    static async update(file, service, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('service', JSON.stringify(service));
        try {
            let serviceData = await API.put(`service`, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            return serviceData.data;
        } catch (error) {
            throw error.response.data;
        }
    } // update()
} // class
