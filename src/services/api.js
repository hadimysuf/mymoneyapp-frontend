import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const createdApi = typeof axios.create === 'function'
  ? axios.create({
      baseURL: API_BASE_URL
    })
  : null;

export const api = createdApi && typeof createdApi.get === 'function' ? createdApi : axios;

if (!api.defaults) {
  api.defaults = { headers: { common: {} } };
} else if (!api.defaults.headers) {
  api.defaults.headers = { common: {} };
} else if (!api.defaults.headers.common) {
  api.defaults.headers.common = {};
}
