import React from 'react'
import './LandingPage.css'

export default function LandingPage(){

    const [formData, setFormData] = React.useState(
        {
            username: "",
            password: "",
            email: "",
            emailNotifs: false
        }
    );

    function handleChange(event){
        const {name, value, type, checked} = event.target;
        setFormData((prevData) => {
            return {
                ...prevData,
                [name]: type === "checkbox" ? checked : value 
            }
        })
    }

    function handleSubmit(event){
        console.log("Form submitted! Your form is ", formData);
        event.preventDefault();
    }

    return (
        <div className='landing-page'>
            <img src="../images/logo.jpg" className='landing-img' alt="logo"/>
            <div className="content">
                <h1 className='header'>
                    Welcome to Yacked! Please create an account below.
                </h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" value={formData.username} onChange={handleChange} name="username"/>
                    </label>
                    <label>
                        Email: 
                        <input type="email" value={formData.email} onChange={handleChange} name="email"/>
                    </label>
                    <label>
                        Password: 
                        <input type="password" value={formData.password} onChange={handleChange} name="password"/>
                    </label>
                    <input type="checkbox" id="emailNotifs" checked={formData.emailNotifs} onChange={handleChange} name="emailNotifs"/>
                    <label htmlFor='emailNotifs'>Sign up for email notifications</label>
                    <button className='submit-btn'>Sign up</button>
                </form>
            </div>
        </div>
    )
}