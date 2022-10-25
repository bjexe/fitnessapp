import './Exercise.css'
import React from 'react'
import {v4 as uuidv4} from 'uuid'

export default function Exercise( {data, setData, handleClick, active, exerciseIndex} ){

    const sets = data.sets.map((set, index) => {
        return (
            <div className='set-container' key={uuidv4()}>
                <p>{`Set #${index+1}:`}</p>
                <p>{set.weight} lbs</p>
                <p>{set.reps} reps</p>
                {!data.finished && active && <button onClick={e => handleClick(e, exerciseIndex, index)} name="deleteSet">Delete set</button>}
            </div>
        )
    })

    return(
        <div className='exercise-container' style={{backgroundColor: data.finished ? 'lime' : 'white'}}>
            <div className='exercise-body'>
                <span>
                    <p className='exercise-title'>{`${data.name}`}</p>
                    {!data.finished && active && <button onClick={e => handleClick(e, exerciseIndex)} name="addSet">Add a new set</button>}
                </span>
                {sets}
                {active && <button onClick={e => handleClick(e, exerciseIndex)} name={"finish"}>{!data.finished ? "Finish" : "Edit exercise"}</button>}
            </div>
        </div>
    );

}