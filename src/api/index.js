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

export async function retrieveSensorData(accessToken) {
    const url = 'https://api.commandingtechchallenge.com/get_data'

    return axios.get(url, {headers:
        {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Authorization': 'bearer ' + accessToken,
        }
    })
}

export async function retrieveAccessToken() {
    const url = 'https://api.commandingtechchallenge.com/login'
    const params = new URLSearchParams()
    params.append('username', 'CloudResponder')
    params.append('password', 'Qh*v2@OK8rm7')
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: params // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
