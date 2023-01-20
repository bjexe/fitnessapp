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
    }, [workout.name])

    function cancelWorkout() {
        workoutContext.clearWorkout()
        navigate('/home')
    }

    async function finishWorkout(event) {
        event.preventDefault()
        await comms.createWorkout(workout)
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

    function deleteSet(event, index){
        event.preventDefault()
        setWorkout(oldWorkout => {
            let newWorkout = {...oldWorkout}
            newWorkout.exercises[index].sets.pop()
            return newWorkout
        })
    }

    function deleteExercise(event, index) {
        event.preventDefault()
        setWorkout(oldWorkout => {
            let newWorkout = {...oldWorkout}
            newWorkout.exercises.splice(index, 1)
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

    function cancelNewName() {
        setNewName(workout.name)
        setNewNameActive(false)
    }

    const workoutForms = workout.exercises.map((exercise, index) => {
        const inputs = exercise.sets.map((set, setIndex) => {
            return (
                <div>
                    <p style={{"color": "#e8e9f3"}}>Set #{setIndex+1}</p>
                    <span className="workout-values">
                        <input value={set.weight} name="weight" onChange={e => handleFormChange(e, index, setIndex)} placeholder="Weight"/>
                        <p style={{"color": "#e8e9f3", "marginLeft":"10px"}}>lbs</p>
                    </span>
                    <span className="workout-values">
                        <input value={set.reps} name="reps" onChange={e => handleFormChange(e, index, setIndex)} placeholder="Reps"/>
                        <p style={{"color": "#e8e9f3", "marginLeft":"10px"}}>reps</p>
                    </span>
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
                <hr style={{"color": "#e8e9f3", "width": "auto", "backgroundColor": "#e8e9f3"}}/>
                <h2 style={{"color": "#e8e9f3", "fontSize":"32px"}}>{exercise.name}</h2>
                <span style={{"display":"flex", "justifyContent":"center", "gap":"25px"}}>
                    <button onClick={e => addSet(e, index)} className="btn">Add set</button>
                    <button onClick={e => deleteSet(e, index)} className='btn'>Delete last set</button>
                    <button onClick={e => deleteExercise(e, index)} className='btn'>Remove Exercise</button>
                </span>
                {workoutForms[index]}
            </div>
        )
    })

    return (
        <div style={{"marginBottom":"25px"}}>
            <span>
                {
                    newNameActive && (
                        <div style={{"display":"flex", "justifyContent":"center", "flexDirection":"column", "alignItems":"center", "marginTop":"20px"}}>
                            <input type="text" value={newName} onChange={e => handleFormChange(e, 0)} name="newName"/>
                            <span style={{"display":"flex", "justifyContent":"center", "gap":"25px"}}>
                                <button onClick={cancelNewName} className='btn'>Cancel</button>
                                <button onClick={saveNewName} className="btn">Save new name</button>
                            </span>
                        </div>
                    )
                }
                {
                    !newNameActive && 
                        (
                            <div style={{"display": "flex", "flexDirection":"column", "gap":"25px", "justifyContent":"center", "alignItems":"center", "marginTop":"20px"}}>
                                <h1 style={{"color": "#e8e9f3", "fontSize":"50px", "textAlign":"center"}}>{workout.name}</h1>
                                <button onClick={() => setNewNameActive(true)} className="btn">Edit name of workout</button>
                            </div>
                        )
                }
                <hr style={{"color": "#e8e9f3", "width": "auto", "backgroundColor": "#e8e9f3"}}/>
            </span>
            
            <span style={{"display":"flex", "gap":"25px", "justifyContent":"center"}}>
                <button onClick={() => toggleNewExerciseActive()} className="btn">Add an exercise</button>
                <button onClick={() => cancelWorkout()} className="btn">Cancel workout</button>
            </span>
            
            {
                newExerciseActive && 
                <form onSubmit={addExercise}>
                    <input name="newExercise" value={newExercise} onChange={handleFormChange} placeholder={"Name of new exercise"}/>
                    <button className="btn">Add exercise to workout</button>
                    <button type="button" onClick={toggleNewExerciseActive} className="btn">Cancel</button>
                </form>
            }
            <form onSubmit={(e) => finishWorkout(e)} style={{"border":"none"}}>
                {workoutBody}
                <button className="btn">Finish workout</button>
            </form>
        </div>
    )
}