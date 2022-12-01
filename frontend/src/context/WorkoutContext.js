import React from 'react'

let WorkoutContext = React.createContext(null)

function WorkoutProvider({children}) {

    const [workout, setWorkout] = React.useState(null)

    function clearWorkout() {
        setWorkout(null)
    }

    let value = {workout, clearWorkout}
    return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>

}

function useWorkout() {
    return React.useContext(WorkoutContext)
}

export {WorkoutContext, WorkoutProvider, useWorkout}