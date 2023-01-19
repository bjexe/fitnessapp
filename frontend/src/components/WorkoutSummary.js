import React from 'react'
import './WorkoutSummary.css'
import {GiWeightLiftingUp} from 'react-icons/gi'
import {FiClock, FiCalendar} from 'react-icons/fi'
import {IconContext} from 'react-icons'
import {BsTrash} from 'react-icons/bs'
import comms from '../services/comms'

function getTimeDifference(start, end) {
    let seconds = (end.getTime() - start.getTime()) / 1000
    let hours = Math.round(seconds / 3600)
    seconds = seconds/3600
    let minutes = Math.round(seconds / 60)
    return hours > 0 ? `${hours} hr(s) ${minutes} min` : `${minutes} min`
}

export default function WorkoutSummary({data, setPastWorkouts}) {

    const endDate = new Date(data.endDate)
    const startDate = new Date(data.startDate)

    async function deleteSummary() {
        const deleted = await comms.deleteWorkout(data.id)
        setPastWorkouts((oldPastWorkouts) => {
            const newPastWorkouts = oldPastWorkouts.filter((workout) => {
                return workout.id !== deleted.id
            })
            return newPastWorkouts
        })
    }

    let totalWeightLifted = 0
    data.exercises.forEach((exercise, index) => {
        exercise.sets.forEach(set => {
            totalWeightLifted += set.weight * set.reps
        })
    })

    const exercises = data.exercises.map(exercise => {
        let bestSetIndex = 0
        let bestSetValue = 0
        exercise.sets.forEach((set, index) => {
            const setValue = set.weight * set.reps
            if(setValue > bestSetValue) {
                bestSetValue = setValue
                bestSetIndex = index
            }
        })

        return(
            <span className='exercises'>
                <p style={{"color": "#e8e9f3"}}>{exercise.sets.length} x {exercise.name}</p>
                <p style={{"color": "#e8e9f3"}}>{exercise.sets[bestSetIndex].weight} lb x {exercise.sets[bestSetIndex].reps} reps</p>
            </span>
        )
    })

    return(
        <IconContext.Provider value={{style: {verticalAlign: '-6%'}}}>
            <div className='card-container'>
                <div className='header'>
                    <span style={{"display" : "flex", "justifyContent": "space-between", "margin": "25px"}}>
                        <h1 style={{"color": "#e8e9f3"}}>{data.name ? data.name : "Custom Exercise"}</h1>
                        <BsTrash style={{"width": "25px", "height": "25px", "color": "#e8e9f3"}} onClick={deleteSummary}/>
                    </span>
                    
                    <p style={{"color": "#e8e9f3"}}><FiCalendar style={{"color": "#e8e9f3"}}/> {endDate.toDateString()}</p>
                    <span style={{"display": "flex", "marginTop":"10px", "justifyContent": "space-around"}}>
                        <p style={{"color": "#e8e9f3"}}><FiClock style={{"color": "#e8e9f3"}}/> {getTimeDifference(startDate, endDate)}</p>
                        <p style={{"color": "#e8e9f3"}}><GiWeightLiftingUp style={{"color": "#e8e9f3"}}/> {totalWeightLifted} lbs</p>
                    </span>
                </div>
                
                <div className='summary'>
                    <span className='summary-header'>
                        <h2 style={{"color": "#e8e9f3"}}>exercise</h2>
                        <h2 style={{"color": "#e8e9f3"}}>best set</h2>
                    </span>
                    {exercises}
                </div>
            </div>
        </IconContext.Provider>
    )
}