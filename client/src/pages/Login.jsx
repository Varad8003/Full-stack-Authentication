//import {React} from 'react'
import { useState } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from 'react-router-dom'
import { useContext } from "react"
import { AppContext } from "../context/appContext"
import axios from 'axios'
import { toast } from "react-toastify"


const Login = () => {
    const navigate = useNavigate();
    const {backendUrl,setIsLoggedin,getUserData}=useContext(AppContext)
    const [state,setState]=useState('Sign Up');
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            console.log('Form Data:', { name, email, password });
            axios.defaults.withCredentials = true;
            let response;
            if (state === 'Sign Up') {
                response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
            } else {
                response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
            }
            console.log('API Response:', response.data);
            if (response.data.success) {
                console.log('Success:', response.data.message);
                toast.success('Login Successful');
                getUserData();
                setIsLoggedin(true);
                navigate('/');
            } else {
                console.log('Error:', response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            toast.error('An error occurred. Please try again.');
        }
    };
  return (
    <div className="flex items-center justify-center px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 min-h-screen" >
        <img onClick={()=>{
            navigate('/')
        }} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" src={assets.logo} alt="" />
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm" >
            <h2 className="text-3xl font-semibold text-white text-center mb-3" >{state==='Sign Up' ? 'Create Account' :'Login'}</h2>
            <p className="text-center text-sm mb-6" >{state==='Sign Up' ? 'Create Your Account' :'Login to Your Account!'}</p>
            <form onSubmit={onSubmitHandler} >
                {state ==='Sign Up' && (
                      <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                      <img src={assets.person_icon} alt="" />
                      <input onChange={e=>setName(e.target.value)} value={name} className="bg-transparent outline-none" type="text" placeholder="Full Name" required />
                  </div>
                )}
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.mail_icon} alt="" />
                    <input onChange={e=>setEmail(e.target.value)} value={email} className="bg-transparent outline-none" type="email" placeholder="Email" required />
                </div>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={e=>setPassword(e.target.value)} value={password} className="bg-transparent outline-none" type="password" placeholder="Password" required />
                </div>
                <p onClick={()=>{
                    navigate('/reset-password')
                }} className="mb-4 text-indigo-500 cursor-pointer flex justify-center" >Fogot Password</p>
                <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium" > {state}</button>
            </form>
            {state  === 'Sign Up' ?(<p className="text-gray-400 text-center text-xs mt-4">Already have a account? {'  '}
                <span onClick={()=>setState('Login')} className="text-blue-400 cursor-pointer underline ">Login Here</span>
            </p>
            ):(<p className="text-gray-400 text-center text-xs mt-4">Dont have an account? {'  '}
                < span onClick={()=>setState('Sign Up')} className="text-blue-400 cursor-pointer underline ">Sign Up</span>
            </p>)}
        </div>
    </div>
  )
}

export default Login