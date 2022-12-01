import React from 'react'
import {useWorkout} from '../context/WorkoutContext'

export default function WorkoutPage(props) {
    const [workout, setWorkout] = React.useState(null)

    React.useEffect(() => {
        const workoutContext = useWorkout()
        if(workoutContext.workout) {
            setWorkout(workoutContext.workout)
        }
    }, [])

    return (
        <div>
            <button>Add an exercise</button>
            <button>Finish workout</button>
        </div>
    )
}