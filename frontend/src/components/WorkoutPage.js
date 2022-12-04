import React from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { useNavigate } from 'react-router-dom'
import comms from '../services/comms'

export default function WorkoutPage(props) {

    const workoutContext = useWorkout()
    const navigate = useNavigate()

    const [workout, setWorkout] = React.useState(workoutContext.workout)
    const [newExercise, setNewExercise] = React.useState(null)
    const [newExerciseActive, setNewExerciseActive] = React.useState(false)

    console.log(`Workout is ${workout}`)

    function cancelWorkout() {
        workoutContext.clearWorkout()
        navigate('/home')
    }

    async function finishWorkout() {
        const res = await comms.createWorkout(workout)
        workoutContext.clearWorkout()
        navigate('/home')
    }

    function addExercise() {
        setWorkout((oldWorkout) => {
            const newWorkout = {...oldWorkout}
            newWorkout.exercises.push({
                name: newExercise,
                sets: []
            })
            return newWorkout
        })
        setNewExercise(null)
        setNewExerciseActive(false)
    }

    function toggleNewExerciseActive() {
        setNewExerciseActive(old => !old)
    }

    function handleFormChange(event) {
        const {name, value} = event.target
        if(name === "newExercise") {
            setNewExercise(value)
        }
    }

    const workoutBody = workout.exercises.map((exercise) => {
        return(
            <div>
                <h2>{exercise.name}</h2>
                <p>numSets: {exercise.sets.length}</p>
            </div>
        )
    })

    return (
        <div>
            <button onClick={() => toggleNewExerciseActive()}>Add an exercise</button>
            <button onClick={() => finishWorkout()}>Finish workout</button>
            <button onClick={() => cancelWorkout()}>Cancel workout</button>
            {
                newExerciseActive && 
                <form onSubmit={addExercise}>
                    <input name="newExercise" value={newExercise} onChange={handleFormChange} placeholder={"Name of new exercise"}/>
                    <button>Submit exercise</button>
                    <button type="button" onClick={toggleNewExerciseActive}>Cancel</button>
                </form>
            }
            <h1>{workout ? workout.name : 'Custom workout'}</h1>
            {workoutBody}
        </div>
    )
}