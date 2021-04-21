'use strict';

import API from '../Api';

export default class DataService {
    static async getData() {
        try {
            let siteData = await API.get('configdata');
            return siteData.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getData()
    static async setData(homeData) {
        try {
            let response = await API.post('configdata', homeData);
            return response.data.message;
        } catch (error) {
            throw error.response.data;
        }
    } // setData()
} // class
