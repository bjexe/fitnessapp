import React from 'react'
import './WorkoutSummary.css'

//icons
import {GiWeightLiftingUp} from 'react-icons/gi'
import {FiClock, FiCalendar} from 'react-icons/fi'
import {IconContext, iconContext} from 'react-icons'

function getTimeDifference(start, end) {
    let seconds = (end.getTime() - start.getTime()) / 1000
    let hours = Math.round(seconds / 3600)
    seconds = seconds/3600
    let minutes = Math.round(seconds / 60)
    return hours > 0 ? `${hours} hr(s) ${minutes} min` : `${minutes} min`
}

export default function WorkoutSummary({data}) {

    const endDate = new Date(data.endDate)
    const startDate = new Date(data.startDate)

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
                <p>{exercise.sets.length} x {exercise.name}</p>
                <p>{exercise.sets[bestSetIndex].weight} lb x {exercise.sets[bestSetIndex].reps} reps</p>
            </span>
        )
    })

    return(
        <IconContext.Provider value={{style: {verticalAlign: '-6%'}}}>
            <div className='card-container'>
                <div className='header'>
                    <h1>{data.name ? data.name : "Custom Exercise"}</h1>
                    <p><FiCalendar/> {endDate.toDateString()}</p>
                    <span className='stats'>
                        <p><FiClock/> {getTimeDifference(startDate, endDate)}</p>
                        <p><GiWeightLiftingUp/> {totalWeightLifted} lbs</p>
                    </span>
                </div>
                
                <div className='summary'>
                    <span className='summary-header'>
                        <h2>exercise</h2>
                        <h2>best set</h2>
                    </span>
                    {exercises}
                </div>
            </div>
        </IconContext.Provider>
    )
}