'use strict';
import API from '../Api';
import AuthService from './AuthService';
export default class ContractService {
    static async getFullContracts() {
        try {
            let response = await API.get('contract');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()
    static async confirm(contract) {
        try {
            let response = await API.put('contract', contract);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()

    static async finish(contract) {
        try {
            let response = await API.delete('contract', { data: contract });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()

    static async contract(plan) {
        try {
            let user = AuthService.getLoggedUser();
            let response = await API.post('contract', { plan, user });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // contract()
    static async getContractCurrentByUser() {
        try {
            let user = AuthService.getLoggedUser();
            let response = await API.get('contract/current/' + user.id_user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getContractCurrentByUser()
} // class
