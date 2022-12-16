import axios from 'axios'
import { MD5 } from 'crypto-js'

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

export const getLocation = (cameraId) => {
    return get(`/main/camera/${cameraId}/gps/`)
}

export const getCameras = async (includeLocations) => {
    let { data: cameras } = await get('/main/camera/')
    if (!includeLocations) {
        return cameras
    }

    for (let i = 0; i < cameras.length; i++) {
        const response = await getLocation(cameras[i].id)
        const data = response.data[0]
        cameras[i] = {
            ...cameras[i],
            ...data
        }
    }
    return cameras
}

export const getAnalytic = (cameraId, analyticEndpoint) => {
    return get(`/main/camera/${cameraId}/analytic/${analyticEndpoint}/`)
}

export const getFrame = (cameraId) => {
    return get(`/main/camera/${cameraId}/get_live_data/`)
}

