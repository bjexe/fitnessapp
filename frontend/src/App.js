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

const exData = {
    name: "Push Day",
    exercises: [
      {
        name: "bench press",
        sets: [
          {
            weight: 120,
            reps: 10
          },
          {
            weight: 120,
            reps: 10
          },
          {
            weight: 120,
            reps: 10
          },
          {
            weight: 120,
            reps: 10
          }
        ]
      },
      {
        name: "side raises",
        sets: [
          {
            weight: 10,
            reps: 10
          },
          {
            weight: 10,
            reps: 10
          },
          {
            weight: 10,
            reps: 10
          },
          {
            weight: 10,
            reps: 10
          }
        ]
      },
      {
        name: "pec deck",
        sets: [
          {
            weight: 140,
            reps: 10
          },
          {
            weight: 140,
            reps: 10
          },
          {
            weight: 140,
            reps: 10
          },
          {
            weight: 140,
            reps: 10
          }
        ]
      },
      {
        name: "dips",
        sets: [
          {
            weight: 150,
            reps: 10
          },
          {
            weight: 150,
            reps: 10
          },
          {
            weight: 150,
            reps: 10
          },
          {
            weight: 150,
            reps: 10
          }
        ]
      }
    ],
    startDate: new Date("2020-05-12T23:50:21.817Z"),
    endDate: new Date("2020-05-13T00:50:21.817Z")
}

function App() {
  // return (
  //   <AuthProvider>
  //     <Routes>
  //       <Route index element={<LandingPage/>}/>
  //       <Route path="/home" element={<RequireAuth><Home/></RequireAuth>}/>
  //       <Route path="/workout" element={<RequireAuth><Workout/></RequireAuth>}/>
  //       <Route path="/test" element={<RequireAuth><p>test</p></RequireAuth>}/>
  //       <Route path="*" element={<h1>404</h1>}/>
  //     </Routes>
  //   </AuthProvider>
  // )
  return <WorkoutSummary data={exData}/>
}

export default App
