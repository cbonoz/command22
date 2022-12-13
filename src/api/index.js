import axios from 'axios'
import {MD5} from 'crypto-js'

const baseURL = process.env.REACT_APP_VIDEO_API_URL || 'http://qil2.uh.edu';
const PROXY_URL = 'https://http-proxy.fly.dev/proxy'
console.log('baseUrl', baseURL)

function get(path) {
    const url = `${baseURL}${path}`

    // Hosted proxy (deployed by Chris).
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