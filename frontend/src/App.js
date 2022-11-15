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

function App() {
  // const [user, setUser] = React.useState(null)
  // const userInfo = React.useMemo(() => {user, setUser}, [user, setUser])
  // //in other files: const user = useContext(UserContext)
  // return (
  //   <>
  //     <Routes>
  //       <UserContext.Provider value={userInfo}>
  //         <Route path="/" element={<LandingPage/>}/>
  //         <Route path="/home" element={<Home/>}/>
  //         <Route path="/workout" element={<Workout/>}/>
  //       </UserContext.Provider>
  //     </Routes>
  //   </>
  // )
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
