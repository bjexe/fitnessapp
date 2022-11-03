import axios from 'axios'

const baseUrl = '/api/register'

async function register(form) {
    const response = await axios.post(baseUrl, form)
    return response
}

export default register