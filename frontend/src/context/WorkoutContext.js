import React from 'react'

let WorkoutContext = React.createContext(null)

function WorkoutProvider({children}) {

    const [workout, setWorkout] = React.useState(null)
    
    
    function clearWorkout() {
        setWorkout(null)
    }

    function update(data) {
        console.log(`updating workoutContext to: `, JSON.stringify(data, null, 2))
        setWorkout(data)
    }

    let value = {workout, clearWorkout, update}
    return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>

}

function useWorkout() {
    return React.useContext(WorkoutContext)
}

export {WorkoutContext, WorkoutProvider, useWorkout}