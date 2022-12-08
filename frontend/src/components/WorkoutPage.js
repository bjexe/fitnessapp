import React from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { useNavigate } from 'react-router-dom'
import comms from '../services/comms'
import './WorkoutPage.css'

export default function WorkoutPage(props) {

    const workoutContext = useWorkout()
    const navigate = useNavigate()

    const [workout, setWorkout] = React.useState(workoutContext.workout)
    const [newExercise, setNewExercise] = React.useState(null)
    const [newExerciseActive, setNewExerciseActive] = React.useState(false)
    const [newName, setNewName] = React.useState(workout.name)
    const [newNameActive, setNewNameActive] = React.useState(false)
    
    React.useEffect(() => {
        if(!workout.name){ 
            setWorkout((oldWorkout) => {
                let newWorkout = {...oldWorkout, name: "Unnamed Workout"}
                return newWorkout
            })
        }
        setWorkout((oldWorkout) => {
            return {...oldWorkout, startDate: new Date()}
        })
    }, [])

    function cancelWorkout() {
        workoutContext.clearWorkout()
        navigate('/home')
    }

    async function finishWorkout(event) {
        event.preventDefault()
        const res = await comms.createWorkout(workout)
        workoutContext.clearWorkout()
        navigate('/home')
    }

    function addExercise() {
        setWorkout((oldWorkout) => {
            const newWorkout = {...oldWorkout}
            newWorkout.exercises.push({
                name: newExercise,
                sets: [{
                    weight: 0,
                    reps: 0
                }]
            })
            return newWorkout
        })
        setNewExercise(null)
        setNewExerciseActive(false)
    }

    function toggleNewExerciseActive() {
        setNewExerciseActive(old => !old)
    }

    function addSet(event, index) {
        event.preventDefault()
        setWorkout((oldWorkout) => {
            let newWorkout = {...oldWorkout}
            newWorkout.exercises[index].sets.push({reps: 0, weight: 0})
            return newWorkout
        })
    }

    function saveNewName() {
        setWorkout((oldWorkout) => {
            let newWorkout = {...oldWorkout}
            newName ? newWorkout.name = newName : newWorkout.name = "Unnamed Workout"
            return newWorkout
        })
        setNewNameActive(false)
    }

    function handleFormChange(event, index, setIndex = 0) {
        const regex = /^[0-9\b]+$/ // to allow only numbers in inputs for reps and weight
        const {name, value} = event.target
        if(name === "newExercise") {
            setNewExercise(value)
        } else if (name === "weight") {
            if(value === '' || regex.test(value)) {
                setWorkout((oldWorkout) => {
                    let newWorkout = {...oldWorkout}
                    newWorkout.exercises[index].sets[setIndex].weight = value
                    return newWorkout
                })
            }
        } else if (name === "reps") {
            if(value === '' || regex.test(value)) {
                setWorkout((oldWorkout) => {
                    let newWorkout = {...oldWorkout}
                    newWorkout.exercises[index].sets[setIndex].reps = value
                    return newWorkout
                })
            }
        } else if (name === "newName") {
            setNewName(value)
        }
    }

    const workoutForms = workout.exercises.map((exercise, index) => {
        const inputs = exercise.sets.map((set, setIndex) => {
            return (
                <div>
                    <p>Set #{setIndex+1}</p>
                    <input value={set.weight} name="weight" onChange={e => handleFormChange(e, index, setIndex)} placeholder="Weight"/>
                    <input value={set.reps} name="reps" onChange={e => handleFormChange(e, index, setIndex)} placeholder="Reps"/>
                </div>
            )
        })
        return (
            <div>
                {inputs}
            </div>
        )
    })

    const workoutBody = workout.exercises.map((exercise, index) => {
        return(
            <div>
                <h2>{exercise.name}</h2>
                <p>numSets: {exercise.sets.length}</p>
                <button onClick={e => addSet(e, index)} className="btn">Add set</button>
                {workoutForms[index]}
            </div>
        )
    })

    return (
        <div>
            <span>
                {
                    newNameActive && (
                        <>
                            <input type="text" value={newName} onChange={e => handleFormChange(e, 0)} name="newName"/>
                            <button onClick={saveNewName} className="btn">Save new name</button>
                        </>
                    )
                }
                {!newNameActive && 
                    (<><h1>{workout.name}</h1>
                    <button onClick={() => setNewNameActive(true)} className="btn">Edit name of workout</button></>)
                }
            </span>
            <button onClick={() => toggleNewExerciseActive()} className="btn">Add an exercise</button>
            <button onClick={() => cancelWorkout()} className="btn">Cancel workout</button>
            {
                newExerciseActive && 
                <form onSubmit={addExercise}>
                    <input name="newExercise" value={newExercise} onChange={handleFormChange} placeholder={"Name of new exercise"}/>
                    <button className="btn">Add exercise to workout</button>
                    <button type="button" onClick={toggleNewExerciseActive} className="btn">Cancel</button>
                </form>
            }
            <form onSubmit={(e) => finishWorkout(e)}>
                {workoutBody}
                <button className="btn">Finish workout</button>
            </form>
        </div>
    )
}