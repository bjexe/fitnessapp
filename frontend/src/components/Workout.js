import React from 'react'
import './Workout.css'

export default function Workout({workoutData, active, editing}){

  const [data, setData] = React.useState(workoutData)

  const exerciseDisplays = data.map((entry, exerciseIndex) => {
      //return <Exercise data={entry} key={uuidv4()} setData={setData} handleClick={handleClick} active={active} exerciseIndex={index} handleChange={handleChange}/>
      
      const sets = entry.sets.map((set, setIndex) => {
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
                
                {!entry.finished && active && <button onClick={e => handleClick(e, exerciseIndex, setIndex)} name="deleteSet">Delete set</button>}
                {!entry.finished && active && <button onClick={e => handleClick(e, exerciseIndex, setIndex)} name="finishSet">Finish set</button>}
            </div>
        )
    })
      
      return (
        <div className='exercise-container' style={{backgroundColor: entry.finished ? 'lime' : 'white'}} key={exerciseIndex /*<- this is bad*/}>
            <div className='exercise-body'>
                <span>
                    <input type="text" name="exerciseTitle" className='exercise-title' value={entry.name} onChange={handleChange}></input>
                    {!entry.finished && active && <button onClick={e => handleClick(e, exerciseIndex)} name="addSet">Add a new set</button>}
                </span>
                {sets}
                {active && <button onClick={e => handleClick(e, exerciseIndex)} name={"finish"}>{!entry.finished ? "Finish" : "Edit exercise"}</button>}
            </div>
        </div>
      )
  })

  function submitWorkout() {
    // todo: save workout to database and close the workout screen
  }

  function handleClick(event, exerciseIndex, setIndex) {

    const {name} = event.target
    
    if(name === "deleteSet"){
      setData((oldData) => {
        let newData = [...oldData] // state arrays result in React not re-rendering when a value of the state array changes, this fixes it
        newData[exerciseIndex].sets.splice(setIndex, 1) // delete the set
        return newData
      })
    } else if (name === "addExercise"){

      setData((oldData) => {
        return [...oldData, {
          name: "New Exercise",
          finished: false,
          sets: []
        }]
      })

    } else if (name === "addSet") {

      setData((oldData) => {
        
        let newData = [...oldData]

        newData[exerciseIndex].sets.push({
          weight: 0,
          reps: 0,
          comment: ""
        })

        return newData

      })
    } else if (name === "finish") {
      setData((oldData) => {
        let newData = [...oldData]
        newData[exerciseIndex].finished = !newData[exerciseIndex].finished
        return newData
      })
    }
    
  }

  function handleChange(event, exerciseIndex, setIndex) {
    console.log('handling change')
    event.preventDefault()
    const {name, value} = event.target
    const newData = [...data]
    if (name === "weight") {
      newData[exerciseIndex].sets[setIndex].weight = value
      setData(newData)
    } else if (name === "reps") {
      newData[exerciseIndex].sets[setIndex].reps = value
      setData(newData)
    } else if (name === "exerciseTitle") {
      newData[exerciseIndex].name = value
      setData(newData)
    }
  }

  return(
      <div className='home'>
          <div className='exercises-container'>
              {exerciseDisplays}
          </div>
          {active && <button onClick={submitWorkout}>{editing ? "Submit changes" : "Submit workout"}</button>}
          {active && <button onClick={handleClick} name={"addExercise"}>Add an exercise</button>}
      </div>
  )

}