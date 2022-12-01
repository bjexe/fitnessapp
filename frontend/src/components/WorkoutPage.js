import React from 'react'
import {useWorkout} from '../context/WorkoutContext'

export default function WorkoutPage(props) {
    const workoutContext = useWorkout()
    return (
        <div>
            <pre>{ JSON.stringify(workoutContext.workout, null, 2) }</pre>
        </div>
    )
}