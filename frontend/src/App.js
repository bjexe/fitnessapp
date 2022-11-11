import './App.css'
import LandingPage from './components/LandingPage'
import Workout from './components/Workout'
import exampleWorkoutData from './exampleWorkoutData'
import Home from './components/Home'
import React from 'react'
import {
  Routes, Route, Link, isRouteErrorResponse, UNSAFE_RouteContext
} from "react-router-dom"
import {UserContext} from "./UserContext"

function App() {
  const [user, setUser] = React.useState(null)
  const userInfo = React.useMemo(() => {user, setUser}, [user, setUser])
  return (
    <>
      <Routes>
        <UserContext.Provider value={userInfo}>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/workout" element={<Workout/>}/>
        </UserContext.Provider>
      </Routes>
    </>
  )
}

export default App
