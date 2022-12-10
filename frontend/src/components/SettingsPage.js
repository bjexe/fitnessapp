import React from 'react'
import comms from '../services/comms'
import {useAuth} from '../context/AuthContext'
import Switch from "react-switch"
import {Link} from 'react-router-dom'

export default function SettingsPage(){

    const auth = useAuth()
    
    const [viewStateIsDark, setViewStateIsDark] = React.useState(() => {
        if(auth.user.settings.view === "dark") {
            return true
        } else {
            return false
        }
    })
    const [unitsIsKilos, setUnitsIsKilos] = React.useState(() => {
        if(auth.user.settings.units === "kilos") {
            return true
        } else {
            return false
        }
    })

    function handleUnitsChange() {
        setUnitsIsKilos(old => !old)
    }

    function handleViewChange() {
        setViewStateIsDark(old => !old)
    }

    async function saveSettings() {
        const view = viewStateIsDark ? 'dark' : 'default'
        const units = unitsIsKilos ? 'kilos' : 'pounds'
        const settings = {
            view: view,
            units: units
        }
        const resData = await comms.updateSettings(settings)
        auth.updateSettings(resData)
    }

    return (
        <div className='settings-page'>
            <div className="optionsWrapper">
                <div className='units'>
                    <p>Default</p>
                    <Switch onChange={handleViewChange} checked={viewStateIsDark} />
                    <p>Dark</p>
                </div>
                <div className='view'>
                    <p>Pounds</p>
                    <Switch onChange={handleUnitsChange} checked={unitsIsKilos} />
                    <p>Kilograms</p>
                </div>
                <button>Change username</button>
                <button>Change password</button>
                <Link to='/home' onClick={saveSettings}>Back to home</Link>
            </div>
        </div>
    )
}