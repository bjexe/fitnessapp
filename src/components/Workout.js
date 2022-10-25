import React from 'react'
import Exercise from './Exercise'
import {v4 as uuidv4} from 'uuid'

export default function Workout({workoutData, active}){

  const [data, setData] = React.useState(workoutData);

  const exerciseDisplays = data.map((entry, index) => {
      return <Exercise data={entry} key={uuidv4()} setData={setData} handleClick={handleClick} active={active} exerciseIndex={index}/>
  })

  function submitWorkout() {
    // todo: save workout to database and close the workout screen
  }

  function handleClick(event, exerciseIndex, setIndex) {

    const {name} = event.target;
    
    if(name === "deleteSet"){
      setData((oldData) => {
        let newData = [...oldData] // state arrays result in React not re-rendering when a value of the state array changes, this fixes it
        newData[exerciseIndex].sets.splice(setIndex, 1) // delete the set
        return newData
      });
    } else if (name === "addExercise"){

      setData((oldData) => {
        return [...oldData, {
          name: "New Exercise",
          finished: false,
          sets: []
        }];
      });

    } else if (name === "addSet") {

      setData((oldData) => {
        
        let newData = [...oldData]

        newData[exerciseIndex].sets.push({
          weight: 0,
          reps: 0,
          comment: ""
        });

        return newData

      });
    } else if (name === "finish") {
      setData((oldData) => {
        let newData = [...oldData]
        newData[exerciseIndex].finished = !newData[exerciseIndex].finished
        return newData
      })
    }
    
  }

  return(
      <div className='home'>
          <div className='exercises-container'>
              {exerciseDisplays}
          </div>
          {active && <button onClick={submitWorkout}>Finish workout</button>}
          {active && <button onClick={handleClick} name={"addExercise"}>Add an exercise</button>}
      </div>
  );

}