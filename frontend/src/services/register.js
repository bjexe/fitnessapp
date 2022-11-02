import axios from 'axios'

const baseUrl = '/api/register'

function register(form) {
    return axios.post(baseUrl, form).then(response => {
        //console.log(JSON.stringify(response, null, 2))
        return response
    }).catch(error => {
        console.log(JSON.stringify(error, null, 2))
        return error
    })
}

export default register