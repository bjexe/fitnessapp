import axios from 'axios'
const workoutBaseUrl = '/api/workouts'
const templateBaseUrl = '/api/templates'

let token = null

function setToken(newToken) {
    token = `bearer ${newToken}`
}  

function printToken() {
    console.log(token)
}

function getAllWorkouts() {
    const request = axios.get(workoutBaseUrl)
    return request.then(response => response.data)
}

async function getAllUserWorkouts() {
    const config = {
        headers: {Authorization: token}
    }
    const request = await axios.get(`${workoutBaseUrl}/user`, config)
    return request.data
}

async function createWorkout(workout) {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.post(workoutBaseUrl, workout, config)
    return response.data
}

function updateWorkout(id, workout) {
    const config = {
        headers: {Authorization: token}
    }
    const response = axios.put(`${workoutBaseUrl}/${id}`, workout, config)
    return response.data
}

async function deleteWorkout(id) {
    const config = {
        headers: {Authorization: token}
    }
    const request = await axios.delete(`${workoutBaseUrl}/${id}`, config)
    return request.data
}

async function getAllUserTemplates() {
    const config = {
        headers: {Authorization: token}
    }
    const request = axios.get(`${templateBaseUrl}/user`, config)
    return request.then(response => response.data)
}

async function createTemplate(template) {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.post(templateBaseUrl, template, config)
    return response.data
}

function updateTemplate(id, template) {
    const config = {
        headers: {Authorization: token}
    }
    const request = axios.put(`${templateBaseUrl}/${id}`, template, config)
}

export default {getAllWorkouts, getAllUserWorkouts, createWorkout, updateWorkout, deleteWorkout, setToken, printToken, getAllUserTemplates, createTemplate, updateTemplate}