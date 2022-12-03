import React from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { useNavigate } from 'react-router-dom'

export default function WorkoutPage(props) {

    const [workout, setWorkout] = React.useState(null)
    const workoutContext = useWorkout()
    const navigate = useNavigate()

    React.useEffect(() => {
        if(workoutContext.workout) {
            setWorkout(workoutContext.workout)
        }
    }, [])

    function cancelWorkout() {
        workoutContext.clearWorkout()
        navigate('/home')
    }

    const workoutBody = workoutContext.workout.exercises.map((exercise) => {
        return(
            <div>
                <h2>{exercise.name}</h2>
                <p>numSets: {exercise.sets.length}</p>
            </div>
        )
    })

    return (
        <div>
            <button>Add an exercise</button>
            <button>Finish workout</button>
            <button onClick={() => cancelWorkout()}>Cancel workout</button>
            <h1>{workout ? workout.name : 'Custom workout'}</h1>
            {workoutBody}
        </div>
    )
}