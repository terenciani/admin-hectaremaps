import axios from 'axios';
import config from '../config';

export default axios.create({
    baseURL: config.apiHost
    /*headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },*/
});
