import React from 'react'
import comms from '../services/comms'
import login from '../services/login'
import {Navigate} from 'react-router-dom'

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
        console.log(res)
        setUser({
            token: res.token,
            username: res.username,
            weight: res.weight
        })
        comms.setToken(res.token)
    }

    function updateWeight(newWeight) {
        setUser(oldUser => {
            const newUser = {
                ...oldUser,
                weight: newWeight
            }
            return newUser
        })
    }
    
    let value = {user, signin, signout, updateWeight}
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
    return React.useContext(AuthContext)
}

function AuthStatus() {
    let auth = useAuth()
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