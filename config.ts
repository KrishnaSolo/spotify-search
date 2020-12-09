import axios = require('axios');

const Axios: axios.AxiosInstance = axios.default;
export async function httpService(request: axios.AxiosRequestConfig): Promise<axios.AxiosResponse> {
    const response: axios.AxiosResponse = await Axios(request);
    return response;
};
