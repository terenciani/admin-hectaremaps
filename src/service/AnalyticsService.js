'use strict';
import API from '../Api';
import AuthService from './AuthService';

export default class AnalyticsService {
    static async getUserAnalytics() {
        try {
            let response = await API.get('analytics/users');
            return response.data;
        } catch (error) {
            console.log(error);
            throw error.response.data;
        }
    } // getUserAnalytics()
    static async getUserRequestsAnalytics() {
        try {
            let user = AuthService.getLoggedUser();
            let response = await API.get('analytics/users/' + user.id_user);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error.response.data;
        }
    } // getUserRequestsAnalytics()
    static async getPlanAnalytics() {
        try {
            let response = await API.get('analytics/plans');
            return response.data;
        } catch (error) {
            console.log(error);
            throw error.response.data;
        }
    } // getPlanAnalytics()
    static async getRequestAnalytics() {
        try {
            let response = await API.get('analytics/requests');
            return response.data;
        } catch (error) {
            console.log(error);
            throw error.response.data;
        }
    } // getRequestAnalytics()
} // class
