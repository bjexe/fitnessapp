import './App.css'
import LandingPage from './components/LandingPage'
import Workout from './components/Workout'
import exampleWorkoutData from './exampleWorkoutData'
import Home from './components/Home'
import React from 'react'
import {
  Routes, Route, Link, useNavigate, useLocation, Outlet, Navigate
} from "react-router-dom"
import {AuthContext, AuthProvider, useAuth, AuthStatus, RequireAuth} from './context/AuthContext'
import WorkoutSummary from './components/WorkoutSummary'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<LandingPage/>}/>
        <Route path="/home" element={<RequireAuth><Home/></RequireAuth>}/>
        <Route path="/workout" element={<RequireAuth><Workout/></RequireAuth>}/>
        <Route path="/test" element={<RequireAuth><p>test</p></RequireAuth>}/>
        <Route path="*" element={<h1>404</h1>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App
