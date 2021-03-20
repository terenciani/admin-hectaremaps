'use strict';

import API from '../Api';

export default class UploadService {
    static async upload(file, area, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        try {
            let siteData = await API.post(`upload/${area}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
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
