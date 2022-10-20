import axios from 'axios'
import {MD5} from 'crypto-js'
import { IS_LOCAL } from '../util/constants';

const baseURL = IS_LOCAL ? 'http://localhost:3001' : process.env.REACT_APP_SERVER_URL;
const PROXY_URL = 'https://http-proxy.fly.dev/proxy'
console.log('baseUrl', baseURL)

function get(path) {
    const url = `${baseURL}${path}`
    if (IS_LOCAL) {
        return axios.get(url)
    }
    return axios.post(PROXY_URL, {
        url,
        type: 'GET',
        hash: MD5(window.location.origin).toString()
    })
}


export const getCameras = () => {
    return get('/main/camera/')
}

export const getAnalytic = (cameraId, analyticEndpoint) => {
    return get(`/main/camera/${cameraId}/analytic/${analyticEndpoint}/`)
}

export const getFrame = (cameraId) => {
    return get(`/main/camera/${cameraId}/get_live_data/`)
}