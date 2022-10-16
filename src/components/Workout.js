import React from 'react'
import Exercise from './Exercise'
import {v4 as uuidv4} from 'uuid'

export default function Workout({workoutData, active}){

  const [data, setData] = React.useState(workoutData);

  const exerciseDisplays = data.map((entry) => {
      return <Exercise data={entry} key={entry.id} setData={setData} handleClick={handleClick} active={active}/>
  })

  function submitWorkout() {
    // todo: save workout to database and close the workout screen
  }

  function handleClick(event) {

    const {name, id} = event.target;
    
    if(name === "deleteSet"){

      setData((oldData) => {

        let newData = [...oldData]; // state arrays result in React not re-rendering when a value of the state array changes, this fixes it

        let indexOfExercise = newData.indexOf(newData.find(entry => entry.sets.find(set => set.id === id))); // find index of exercise containing the set

        let indexOfSet = newData[indexOfExercise].sets.indexOf(newData[indexOfExercise].sets.find(set => set.id === id)); // find index of set within found exercise

        newData[indexOfExercise].sets.splice(indexOfSet, 1); // delete the set
        return newData;
      });
    } else if (name === "addExercise"){

      setData((oldData) => {

        return [...oldData, {
          id: uuidv4(),
          name: "New Exercise",
          finished: false,
          sets: []
        }];

      });

    } else if (name === "addSet") {

      console.log("attempting to add a set...")

      setData((oldData) => {
        
        let newData = [...oldData];

        newData.find(entry => entry.id === id).sets.push({
          id: uuidv4(),
          weight: 0,
          reps: 0,
          comment: ""
        });

        return newData;

      });
    } else if (name === "finish") {
      setData((oldData) => {
        let newData = [...oldData];
        newData.find(entry => entry.id === id).finished = !newData.find(entry => entry.id === id).finished;
        return newData;
      });
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