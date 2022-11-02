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
    );

    const [registerError, setRegisterError] = React.useState({
        isError: false,
        errorMessage: ''
    })

    const [registerSuccess, setRegisterSuccess] = React.useState({
        isSuccess: false,
        message: ""
    })

    const [loginFormData, setLoginFormData] = React.useState({
        username: "",
        password: ""
    })

    function handleChange(event){
        const {name, value, type, checked} = event.target;
        setRegisterFormData((prevData) => {
            return {
                ...prevData,
                [name]: type === "checkbox" ? checked : value 
            }
        })
    }

    async function handleRegisterSubmit(event){
        event.preventDefault()
        register(registerFormData)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
        //console.log(JSON.stringify(res.response, null, 2))
        // console.log(registerError)
        
    }

    return (
        <div className='landing-page'>
            <img src="../images/logo.jpg" className='landing-img' alt="logo"/>
            <div className="content">
                <h1 className='header'>
                    Welcome to Yacked! Please create an account below.
                </h1>
                <form onSubmit={handleRegisterSubmit}>
                    <label>
                        Username:
                        <input type="text" value={registerFormData.username} onChange={handleChange} name="username"/>
                    </label>
                    <label>
                        Email: 
                        <input type="email" value={registerFormData.email} onChange={handleChange} name="email"/>
                    </label>
                    <label>
                        Password: 
                        <input type="password" value={registerFormData.password} onChange={handleChange} name="password"/>
                    </label>
                    <input type="checkbox" id="emailNotifs" checked={registerFormData.emailNotifs} onChange={handleChange} name="emailNotifs"/>
                    <label htmlFor='emailNotifs'>Sign up for email notifications</label>
                    <button className='submit-btn'>Sign up</button>
                    {registerError.isError && <p style={{color: 'red'}}>{String(registerError.errorMessage)}</p>}
                    {registerSuccess.isSuccess && <p style={{color: 'green'}}>{registerSuccess.message}</p>}
                </form>
            </div>
        </div>
    )
}