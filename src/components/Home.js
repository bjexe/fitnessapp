import React from 'react'
import Exercise from './Exercise'
import dataApiMimic from '../data'
import {v4 as uuidv4} from 'uuid'

export default function Home(){

  const [data, setData] = React.useState(dataApiMimic);

  const exerciseDisplays = data.map((entry) => {
      return <Exercise data={entry} key={entry.id} setData={setData} handleClick={handleClick}/>
  })

  function handleClick(event) {

    const {name, id} = event.target;
    
    if(name === "del"){

      setData((oldData) => {

        let newData = [...oldData]; // state arrays result in React not re-rendering when a value of the state array changes, this fixes it (pointers I suppose)
  
        for(let i = 0; i < newData.length; i++) { // loop through the old data until the right exercise containing the targeted set to delete is found
          
          let sets = newData[i].sets; 

          for(let j = 0; j < sets.length; j++) {

            if(sets[j].id === id){
              newData[i].sets.splice(j, 1); // delete the set from the array
            }

          }

        }

        return newData;
      });
    } else if (name === "add") {

      console.log("attempting to add a set...")

      setData((oldData) => {
        
        let newData = [...oldData];

        for(let i = 0; i < newData.length; i++) {
          if(newData[i].id === id) {
            newData[i].sets.push({
              id: uuidv4(),
              weight: 0,
              reps: 0,
              comment: ""
            });
          }
        }

        return newData;

      });

    }
    
  }

  return(
      <div className='home'>
          <div className='exercises-container'>
              {exerciseDisplays}
          </div>
      </div>
  );

}