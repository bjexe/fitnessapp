import axios from 'axios'

const baseUrl = '/api/login'

function login(form) {
    const request = axios.post(baseUrl, form)
    return request.then(response => response.data)
}

export default login