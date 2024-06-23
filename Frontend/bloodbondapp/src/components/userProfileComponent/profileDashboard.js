import React, { useState, useEffect, useContext } from 'react'
// import axios from 'axios'
import {Link,useNavigate} from 'react-router-dom'
// import ProfileForm from './profileForm'
// import BloodRequestForm from './blood-requestForm'
import { useDispatch, useSelector } from 'react-redux'
import { startFetchingUserProfile, startDeletingUserProfile, startEditingUserProfile } from '../../actions/userprofileActions'
// import BloodRequestContext from "../../contexts/bloodRequestContext"
// import BloodResponseContext from '../../contexts/bloodResponseContext'

export default function ProfileDashboard() {
    // const [showProfileForm, setShowProfileForm] = useState(false)
    // const [showBloodRequestForm, setShowBloodRequestForm] = useState(false)
    // const [showBloodRequests, setShowBloodRequests] = useState(false)
    // const [formTitle, setFormTitle] = useState('')
    // const [editProfileData, setEditProfileData] = useState(null)
    // const [editUserBloodRequest, setEditUserBloodRequest] = useState(null)
    // const [showRequestToUser, setShowRequestToUser] = useState(false)
    // const [showOtherRequests, setShowOtherRequests] = useState(false)
    // const [showProfileData,setShowProfileData]=useState(false)

    // const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext)
    // const {bloodResponses,bloodResponseDispatch}=useContext(BloodResponseContext)

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
        navigate(/profile/${profile._id}, { state: { profile } });
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
                </div>
                    
                </>
            )}           
          
        </div>
    )
}
