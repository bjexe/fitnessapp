import './App.css';
import LandingPage from './components/LandingPage'
import Workout from './components/Workout';
import exampleWorkoutData from './exampleWorkoutData'
import Home from './components/Home'
import React from 'react';

function App() {
  //return <Workout active={true} workoutData={exampleWorkoutData}/>
  return <Home/>
  //return <LandingPage/>
}

export default App;
