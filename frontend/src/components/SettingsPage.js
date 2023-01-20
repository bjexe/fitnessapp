import React from 'react'
import comms from '../services/comms'
import {useAuth} from '../context/AuthContext'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'

export default function SettingsPage(){

    const auth = useAuth()
    const navigate = useNavigate()
    const [verify, setVerify] = React.useState(false)

    function deleteAccount(){
        comms.deleteUser()
        auth.signout()
        navigate('/')
    }

    return (
        <div className='settings-page'>
            <div style={{"display":"flex", "justifyContent":"center", "gap" : "25px", "flexDirection":"column", "alignItems":"center", "marginTop":"50px"}}>
                {/* <button className="btn">Change username</button>
                <button className="btn">Change password</button> */}
                {!verify && <button onClick={e => setVerify(true)} className="btn">Delete account</button>}
                {verify && <p style={{"color": "red", "textAlign":"center", "fontSize":"32px", "fontWeight":"bold"}}>Are you sure?</p>}
                <span style={{"display":"flex", "flexDirection":"column", "gap" : "25px"}}>
                    {verify && <button onClick = {deleteAccount} className="btn">Confirm deletion</button>}
                    {verify && <button onClick={e => setVerify(false)} className="btn">Cancel</button>}
                </span>
                <Link to='/home' style={{"color": "#e8e9f3", "fontSize":"32px"}}>Back to home</Link>
            </div>
        </div>
    )
}