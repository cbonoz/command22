import axios from 'axios'

const baseURL = `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_SERVER_URL}`
// const baseURL = process.env.REACT_APP_SERVER_URL;
console.log('baseUrl', baseURL)

const nistAxios = axios.create({
    baseURL,
    timeout: 6000,
    headers: {
        'X-Custom-Header': 'foobar',
        "Access-Control-Allow-Origin": "*"
    }
});


export const getCameras = () => {
    return nistAxios.get('/main/camera/', {
    })
}

export const getAnalytic = (cameraId, analyticEndpoint) => {
    const url = `/main/camera/${cameraId}/analytic/${analyticEndpoint}`
    return nistAxios.get(url, {
    })
}