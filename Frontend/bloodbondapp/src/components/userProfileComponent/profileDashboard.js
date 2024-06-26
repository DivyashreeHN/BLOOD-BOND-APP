import React, { useState, useEffect, useContext } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { startFetchingUserProfile } from '../../actions/userprofileActions'


export default function ProfileDashboard() {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const singlePro = useSelector((state) => state.profiles.singleProfile)

    useEffect(() => {
        dispatch(startFetchingUserProfile());
    }, [dispatch]);

    const handleAddProfile = () => {
        
        navigate("/add/profile")
    }

    const handleViewProfile=(profile)=>
    {
        navigate(`/profile/${profile._id}`, { state: { profile } });
    }

    const handleBloodRequestClick = () => {
    
    navigate("/add/request")
    }

    const handleUserBloodRequests = async () => {
        
        navigate('/my/requests')
    };

    
    const handleRequestToUser = async () => {
        navigate("/view/requests")
    }

    const handleOtherRequest = async () => {

navigate("/view/other/requests")
    }
    const handleMyResponseHistory=async()=>
        {
            navigate("/user/response/history")
        }

    

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h3>User Dashboard</h3>
            {singlePro?.length === 0 ? (
                <div>
                    <button className='btn btn-primary' onClick={handleAddProfile}>Add Profile</button>
                </div>
            ) : (
                <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                    <button className='btn btn-primary' onClick={()=>handleViewProfile(singlePro[0])} >View Profile</button>
                    <button className='btn btn-primary' onClick={handleUserBloodRequests}>My Requests</button>
                    <button className='btn btn-primary' onClick={handleRequestToUser}>View Requests</button>
                    <button className='btn btn-primary' onClick={handleOtherRequest}>View Other Requests</button>
                    <button className='btn btn-primary' onClick={handleBloodRequestClick}>Add Request</button> 
                    <button className='btn btn-primary' onClick={handleMyResponseHistory}>View MyResponse History</button>
                </div>
                    
                </>
            )}           
          
        </div>
    )
}
