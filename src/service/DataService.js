'use strict';

import API from '../Api';

export default class DataService {
    static async getData() {
        try {
            let siteData = await API.get('sitedata');
            return siteData.data;
        } catch (error) {
            throw error.response.data;
        }
    } // getData()
    static async setData(homeData) {
        try {
            let response = await API.post('sitedata', homeData);
            return response.data.message;
        } catch (error) {
            throw error.response.data;
        }
    } // setData()
} // class
