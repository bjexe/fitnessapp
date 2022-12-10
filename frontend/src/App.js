import './App.css'
import LandingPage from './components/LandingPage'
import WorkoutPage from './components/WorkoutPage'
import SettingsPage from './components/SettingsPage'
import Home from './components/Home'
import React from 'react'
import {
  Routes, Route
} from "react-router-dom"
import {AuthProvider, RequireAuth} from './context/AuthContext'
import {WorkoutProvider} from './context/WorkoutContext'

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
      <Routes>
        <Route index element={<LandingPage/>}/>
          <Route path="/home" element={<RequireAuth><Home/></RequireAuth>}/>
          <Route path="/workout" element={<RequireAuth><WorkoutPage/></RequireAuth>}/>
          <Route path="/settings" element={<RequireAuth><SettingsPage/></RequireAuth>}/>
        <Route path="*" element={<h1>404</h1>}/>
      </Routes>
      </WorkoutProvider>
    </AuthProvider>
  )
}

export default App
