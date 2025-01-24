import { useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets'
import { useContext } from 'react';
import { AppContext } from '../context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';
//import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate=useNavigate();
    const {userData,backendUrl,setUserData,setIsLoggedin}=useContext(AppContext);
    const sendVerificationOtp=async()=>{
      try{
          axios.defaults.withCredentials=true;
          const {data}=await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
          if(data.success){
              navigate('/email-verify');
              toast.success(data.message);
          }
          else{
              toast.error(data.message);
          }
      }
      catch(error){
      toast.error(error.message)
      }
  }
    const logout=async()=>{
      try {
        axios.defaults.withCredentials=true;
        const {data}=await axios.post(`${backendUrl}/api/auth/logout`);
        data.success && setIsLoggedin(false);
        data.success && setUserData(false);
        navigate('/');
      } catch (error) {
        toast.error(error.message);
      }
    }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="" className='w-28 sm:w-32' />
            {userData ? (
                <div className='relative group'>
                    <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer'>
                        {userData.name[0].toUpperCase()}
                    </div>
                    <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300'>
                        <ul className='py-1'>
                            {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Verify Email</li>}
                            <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={logout}>Logout</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
                    Login <img src={assets.arrow_icon} alt="" />
                </button>
            )}
        </div>
  )
}

export default Navbar