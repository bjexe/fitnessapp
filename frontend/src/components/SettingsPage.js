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
            <div className="optionsWrapper">
                <button>Change username</button>
                <button>Change password</button>
                {!verify && <button onClick={e => setVerify(true)}>Delete account</button>}
                {verify && <p style={{"color": "red"}}>Are you sure?</p>}
                {verify && <button onClick = {deleteAccount}>Confirm deletion</button>}
                {verify && <button onClick={e => setVerify(false)}>Cancel</button>}
                <Link to='/home'>Back to home</Link>
            </div>
        </div>
    )
}