import { lazy } from 'react'
import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const Post = lazy(() => import('../pages/Post'))
const Profile = lazy(() => import('../pages/Profile'))


const mainroutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Profile />} />
            <Route path='/post' element={<Post />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    )
}

export default mainroutes