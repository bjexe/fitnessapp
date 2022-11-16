import React from 'react'
import comms from '../services/comms'
import login from '../services/login'
import {useNavigate, Navigate} from 'react-router-dom'

let AuthContext = React.createContext(null)

// auth.user.token
function AuthProvider({children}) {
    const [user, setUser] = React.useState({
        token: null,
        user: null
    })
    const signout = () => {
        setUser(null)
    }
    async function signin(loginFormData) {
        const res = await login(loginFormData)
        setUser({
            token: res.token,
            username: res.username
        })
        console.log(`token: ${res.token}`)
        comms.setToken(res.token)
    }
    let value = {user, signin, signout}
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
    return React.useContext(AuthContext)
}

function AuthStatus() {
    let auth = useAuth()
    let navigate = useNavigate()
    if(!auth.user) { 
        return <p>You are not logged in.</p>
    }
    return <p>Welcome, {auth.user}</p>
}

function RequireAuth({children}) {
    let auth = useAuth()
    if (!auth.user.token) {
        return <Navigate to="/" replace/>
    }
    return children
}

export {AuthContext, AuthProvider, useAuth, AuthStatus, RequireAuth}