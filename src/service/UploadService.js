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
    } // upload()
    static async uploadReport(file, requestId, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        try {
            let response = await API.post(`upload/report/${requestId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // uploadReport()
    static async serviceRequest(file, requestId, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        try {
            let fileData = await API.post(`servicerequest/big/${requestId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            return fileData;
        } catch (error) {
            throw error.response.data;
        }
    } // serviceRequest()
    static async serviceLocalRequest(file, requestId, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        try {
            let fileData = await API.post(`servicerequest/local/${requestId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            return fileData;
        } catch (error) {
            throw error.response.data;
        }
    } // serviceRequestLocal()
    static async uploadVideo(file, onUploadProgress) {
        let formData = new FormData();
        formData.append('file', file);
        try {
            let siteData = await API.post(`uploadvideo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            return siteData.data;
        } catch (error) {
            throw error.response.data;
        }
    } // uploadVideo()
    static async setData(homeData) {
        try {
            let response = await API.post('sitedata', homeData);
            return response.data.message;
        } catch (error) {
            throw error.response.data;
        }
    } // setData()
} // class
