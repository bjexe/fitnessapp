import './App.css'
import LandingPage from './components/LandingPage'
import Workout from './components/Workout'
import exampleWorkoutData from './exampleWorkoutData'
import Home from './components/Home'
import React from 'react'
import {
  createBrowserRouter, RouterProvider, Route
} from "react-router-dom"

function App() {

  const router = createBrowserRouter([{
    path: "/",
    element: <LandingPage/>
  }])

  return (
    <RouterProvider router={router} />
  )
}

export default App
