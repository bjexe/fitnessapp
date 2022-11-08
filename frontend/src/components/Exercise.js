import './Exercise.css'
import React from 'react'

export default function Exercise( {data, setData, handleClick, active, exerciseIndex, handleChange} ){

    const sets = data.sets.map((set, setIndex) => {
        return (
            <div className='set-container' key={setIndex}>
                <p>{`Set #${setIndex+1}:`}</p>
                <span>
                    <input name="weight" type="text" value={set.weight} onChange={e => handleChange(e, exerciseIndex, setIndex)}/>
                    <p>lbs</p>
                </span>
                <span>
                    <input name="reps" type="text" value={set.reps} onChange={e => handleChange(e, exerciseIndex, setIndex)}/>
                    <p>reps</p>
                </span>
                
                {!data.finished && active && <button onClick={e => handleClick(e, exerciseIndex, setIndex)} name="deleteSet">Delete set</button>}
                {!data.finished && active && <button onClick={e => handleClick(e, exerciseIndex, setIndex)} name="finishSet">Finish set</button>}
            </div>
        )
    })

    return(
        <div className='exercise-container' style={{backgroundColor: data.finished ? 'lime' : 'white'}}>
            <div className='exercise-body'>
                <span>
                    <input type="text" name="exerciseTitle" className='exercise-title' value={data.name} onChange={handleChange}></input>
                    {!data.finished && active && <button onClick={e => handleClick(e, exerciseIndex)} name="addSet">Add a new set</button>}
                </span>
                {sets}
                {active && <button onClick={e => handleClick(e, exerciseIndex)} name={"finish"}>{!data.finished ? "Finish" : "Edit exercise"}</button>}
            </div>
        </div>
    );

}