import React from 'react'
import './LandingPage.css'
import register from '../services/register'
import login from '../services/login'

export default function LandingPage(){

    const [registerFormData, setRegisterFormData] = React.useState(
        {
            username: "",
            password: "",
            email: "",
            emailNotifs: false
        }
    )

    const [user, setUser] = React.useState({
        token: null,
        username: null,
        name: null
    })
    
    //change these to one state that manages errors and success notifiers (these dont need to be JSON anyway)
    const [registerError, setRegisterError] = React.useState({
        isError: false,
        message: ''
    })

    const [registerSuccess, setRegisterSuccess] = React.useState({
        isSuccess: false,
        message: ""
    })

    const [loginSuccess, setLoginSuccess] = React.useState({
        isSuccess: false,
        message: ""
    })

    const [loginError, setLoginError] = React.useState({
        isError: false,
        message: "Invalid credentials ❌"
    })

    const [loginFormData, setLoginFormData] = React.useState({
        username: "",
        password: ""
    })

    function handleRegisterChange(event){
        const {name, value, type, checked} = event.target;
        setRegisterFormData((prevData) => {
            return {
                ...prevData,
                [name]: type === "checkbox" ? checked : value 
            }
        })
    }

    function handleLoginChange(event) {
        const {name, value} = event.target
        setLoginFormData((prevData) => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    async function handleRegisterSubmit(event){
        setRegisterError({isError: false})
        event.preventDefault()
        try {
            const res = await register(registerFormData)
            setRegisterSuccess({
                isSuccess: true,
                message: "Successfully signed up 💪"
            })
        } catch(exception) {
            console.log(JSON.stringify(exception, null, 2))
            setRegisterError({
                isError: true,
                message: 'Something went wrong'
            })
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault()
        try {
            setLoginError({isError: false})
            const res = await login(loginFormData)
            console.log(res)
            setUser({
                token: res.token,
                username: res.username
            })
            setLoginSuccess({isSuccess: true})
        } catch(exception) {
            setLoginError({isError: true})
            console.log('exception occurred in login')
            console.log(JSON.stringify(exception, null, 2))
        }
        
    }

    return (
        <div className='landing-page'>
            <img src="../images/logo.jpg" className='landing-img' alt="logo"/>
            <div className="content">
                <h1 className='header'>
                    Welcome to Yacked!  Please create an account below.
                </h1>
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Sign up</h1>
                    <label>
                        Username:
                        <input type="text" value={registerFormData.username} onChange={handleRegisterChange} name="username"/>
                    </label>
                    <label>
                        Email: 
                        <input type="email" value={registerFormData.email} onChange={handleRegisterChange} name="email"/>
                    </label>
                    <label>
                        Password: 
                        <input type="password" value={registerFormData.password} onChange={handleRegisterChange} name="password"/>
                    </label>
                    <input type="checkbox" id="emailNotifs" checked={registerFormData.emailNotifs} onChange={handleRegisterChange} name="emailNotifs"/>
                    <label htmlFor='emailNotifs'>Sign up for email notifications</label>
                    <button className='submit-btn'>Sign up</button>
                    {registerError.isError && <p style={{color: 'red'}}>{String(registerError.message)}</p>}
                    {registerSuccess.isSuccess && <p style={{color: 'green'}}>{String(registerSuccess.message)}</p>}
                </form>
                <form onSubmit={handleLoginSubmit}>
                    <h1>Log in</h1>
                    <label>
                        Username:
                        <input type="text" value={loginFormData.username} onChange={handleLoginChange} name="username"/>
                    </label>
                    <label>
                        Password:
                        <input type="password" value={loginFormData.password} onChange={handleLoginChange} name="password"/>
                    </label>
                    <button className='submit-btn'>Log in</button>
                    {loginError.isError && <p style={{color: 'red'}}>Invalid credentials</p>}
                    {loginSuccess.isSuccess && <p style={{color: 'green'}}>Successfully logged in! Your jwt token is {user.token}</p>}
                </form>
            </div>
        </div>
    )
}