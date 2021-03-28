'use strict';
import API from '../Api';

export default class PlanService {
    static async getAll() {
        try {
            let response = await API.get('plan');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getAll()
    static async remove(user) {
        try {
            let response = await API.delete('plan', { data: user });
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // getAll()
    static async update(plan) {
        try {
            let response = await API.put('plan', plan);
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // update()
    static async save(plan) {
        try {
            let message = await API.post('plan', plan);
            return message.data;
        } catch (error) {
            throw 'Não foi possível efetuar o cadastro. Tente mais tarde!';
        }
    } // save()
    static async savePlanItem(planItem) {
        try {
            let message = await API.post('planitems', planItem);
            return message.data;
        } catch (error) {
            throw 'Não foi possível efetuar o cadastro. Tente mais tarde!';
        }
    } // savePlanItem()
    static async updatePlanItem(planItem) {
        try {
            let response = await API.put('planitems', planItem);
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // updatePlanItem()
    static async getItemsByPlan(plan) {
        try {
            let response = await API.get('planitems/' + plan);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getItemsByPlan()
    static async removePlanItem(planItem) {
        try {
            let response = await API.delete('planitems', { data: planItem });
            return response.data;
        } catch (error) {
            throw 'Ops! Aconteceu um erro interno, entre em contato conosco.';
        }
    } // removePlanItem()
} // class
