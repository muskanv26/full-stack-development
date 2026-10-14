import React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import AdminDashboard from './Components/AdminDashboard'
import UserDashboard from './Components/UserDashboard'

const App = () => {
  return (
    <div><BrowserRouter>
    <Routes>
      <Route path="/"element={<Login/>}/>
      <Route path="/"element={<AdminDashboard/>}/>
      <Route path="/"element={<UserDashboard/>}/>
    </Routes>
    </BrowserRouter></div>
  )
}

export default App