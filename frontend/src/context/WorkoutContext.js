import React from 'react'
import comms from '../services/comms'

let WorkoutContext = React.createContext(null)

function WorkoutProvider({children}) {

    const [workout, setWorkout] = React.useState({
        name: "",
        startDate: null,
        exercises: []
    })

    const update = (data) => {
        setWorkout(data)
    }

    const submit = () => {
        comms.createWorkout(workout)
    }

    let value = {workout, update, submit}
    return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>

}

function useWorkout() {
    return React.useContext(WorkoutContext)
}

export {WorkoutContext, WorkoutProvider, useWorkout}