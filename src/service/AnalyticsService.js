'use strict';
// import API from '../Api';

export default class AnalyticsService {
    static async getUserAnalytics() {
        /*try {
            //let response = await API.get('analytics/users');
            return {};
        } catch (error) {
            console.log(error);
            //throw error.response.data;
        }*/
        return { new: 10, active: 5, blocked: 1, update: 4 };
    } // getAll()
} // class
