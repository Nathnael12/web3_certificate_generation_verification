/*global AlgoSigner*/

import Login from './components/Login'
import Trainee from './pages/Trainee'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import React from 'react'

import './assets/css/app.css'
import Home from './pages/Home'

function App(){ 
        return(

            <BrowserRouter>
                <Routes>
                    <Route path={"/"} exact element={<Home />} />
                    <Route path={"/login"} exact element={<Login />} />

                    <Route exact path='/trainee' element={<ProtectedRoute />}>
                        <Route exact path='/trainee' element={<Trainee />} />
                    </Route>
                </Routes>
            </BrowserRouter>
         
            
        )
}

export default App
