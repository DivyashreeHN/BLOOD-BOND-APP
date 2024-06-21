    import React, { useState, useEffect, useContext } from 'react'
    import axios from 'axios'
    import {Link,useNavigate} from 'react-router-dom'
    import ProfileForm from './profileForm'
    import BloodRequestForm from './blood-requestForm'
    import { useDispatch, useSelector } from 'react-redux'
    import { startFetchingUserProfile, startDeletingUserProfile, startEditingUserProfile } from '../../actions/userprofileActions'
    import BloodRequestContext from "../../contexts/bloodRequestContext"
    import BloodResponseContext from '../../contexts/bloodResponseContext'

    export default function ProfileDashboard() {
        const [showProfileForm, setShowProfileForm] = useState(false)
        const [showBloodRequestForm, setShowBloodRequestForm] = useState(false)
        const [showBloodRequests, setShowBloodRequests] = useState(false)
        const [formTitle, setFormTitle] = useState('')
        const [editProfileData, setEditProfileData] = useState(null)
        const [editUserBloodRequest, setEditUserBloodRequest] = useState(null)
        const [showRequestToUser, setShowRequestToUser] = useState(false)
        const [showOtherRequests, setShowOtherRequests] = useState(false)
        const [showProfileData,setShowProfileData]=useState(false)

        const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext)
        const {bloodResponses,bloodResponseDispatch}=useContext(BloodResponseContext)

        const dispatch = useDispatch()
        const navigate=useNavigate()
        const singlePro = useSelector((state) => state.profiles.singleProfile)

        useEffect(() => {
            dispatch(startFetchingUserProfile());
        }, [dispatch]);

        const handleAddProfile = () => {
            setShowProfileForm(true)
            setShowBloodRequestForm(false)
            setShowBloodRequests(false)
            setShowRequestToUser(false)
            setFormTitle('Add Profile')
            setEditProfileData(null)
        }

        const handleViewProfile=(profile)=>
        {
            navigate(`/profile/${profile._id}`, { state: { profile } });
        }

        const handleBloodRequestClick = () => {
            setShowBloodRequestForm(true)
            setShowProfileForm(false)
            setShowRequestToUser(false)
            setShowBloodRequests(false)
            setShowOtherRequests(false)
            setFormTitle('Add Request')
           setEditUserBloodRequest(null)
        }

        const handleUserBloodRequests = async () => {
            
            navigate('/user/requests')
        };

        

       
        const handleBloodRequestDelete = async (id) => {
            try {
                await axios.delete(`http://localhost:3080/api/blood/request/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });

                bloodRequestDispatch({ type: 'DELETE_USER_BLOOD_REQUEST', payload: id });
            } catch (err) {
                console.error(err, 'error in deleting user blood request');
            }
        };

        const handleBloodRequestEdit = (id) => {
            const bloodRequestToEdit = bloodRequests.userBloodRequests.find((request) => {
                return request._id == id
            })
            setEditUserBloodRequest(bloodRequestToEdit)
            console.log('bloodREquest Edit', bloodRequestToEdit)
            setShowProfileForm(false)
            setShowBloodRequestForm(true)
            setShowBloodRequests(false)
            setShowRequestToUser(false)
            setFormTitle('Edit user BloodRequest')
        }

        const handleRequestToUser = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
    console.log('bloodREquest which match profile',response.data)
                const data = response.data
                bloodRequestDispatch({ type: "DISPLAY_BLOODREQUEST_TO_USER", payload: data })
                setShowBloodRequests(false)
                setShowProfileForm(false)
                setShowBloodRequestForm(false)
                setShowRequestToUser(true)
                setShowOtherRequests(false)
            } catch (err) {
                console.error(err, 'error in fetching request to user')
            }
        }

        const handleOtherRequest = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
    console.log('other blood request for user type',response.data)
                const data = response.data
                bloodRequestDispatch({ type: "DISPLAY_OTHER_BLOODREQUEST_TO_USER", payload: data })
                setShowBloodRequests(false)
                setShowProfileForm(false)
                setShowBloodRequestForm(false)
                setShowRequestToUser(false)
                setShowOtherRequests(true)
            } catch (err) {
                console.error(err, 'error in fetching request to user')
            }
        }

        const handleResponseByUser = async (id, value) => {
            try {
                const response = await axios.put(`http://localhost:3080/api/response/${id}`, { status:value }, {
                    headers: {
                        Authorization: localStorage.getItem('tokeen')
                    }
                });
                bloodResponseDispatch({ type: 'RESPONSE_ADDED_BY_USER', payload: response.data });
                console.log('response by user', response.data)
            } catch (error) {
                bloodResponseDispatch({ type: 'SET_SERVER_ERRORS', payload: [error.message] });
            }
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
            

                {showRequestToUser &&(
                    <div>
                        <h4>Request to User</h4>
                        {bloodRequests.requestToUser.length > 0 ? (
                            bloodRequests.requestToUser.map((request, index) => (
                                <div key={index}>
                                    <h4>BloodRequest:  {index + 1}</h4>
                                    <p>BloodRequest ID:  {request._id}</p>
                                    <p>BloodRequest UserID: {request.user}</p>
                                    <p>Patient Name: {request.patientName}</p>
                                    <p>Atendee Phone Number: {request.atendeePhNumber}</p>
                                    <p>Blood Type: {request.blood.bloodType}</p>
                                    <p>Blood Group: {request.blood.bloodGroup}</p>
                                    <p>Units: {request.units}</p>
                                    <p>Date: {request.date}</p>
                                    <p>Critical: {request.critical}</p>
                                    <p>Donation Address: {request.donationAddress.building}, {request.donationAddress.locality}, {request.donationAddress.city}, {request.donationAddress.pincode}, {request.donationAddress.state}, {request.donationAddress.country}</p>
                                    <button className='btn btn-primary' onClick={() => handleResponseByUser(request._id, 'accepted')}>Accept</button> |
                                    <button className='btn btn-primary' onClick={() => handleResponseByUser(request._id, 'rejected')}>Reject</button>
                                </div>
                            ))
                        ) : (
                            <p>No blood requests to user found.</p>
                        )}
                    </div>
                )}

                {showOtherRequests && !showBloodRequests && !showRequestToUser &&  (
                    <div>
                        <h4>Other Requests</h4>
                        {bloodRequests.otherRequestToUser.length > 0 ? (
                            bloodRequests.otherRequestToUser.map((request, index) => (
                                <div key={index}>
                                    <h4>BloodRequest:  {index + 1}</h4>
                                    <p>BloodRequest ID:  {request._id}</p>
                                    <p>BloodRequest UserID: {request.user}</p>
                                    <p>Patient Name: {request.patientName}</p>
                                    <p>Atendee Phone Number: {request.atendeePhNumber}</p>
                                    <p>Blood Type: {request.blood.bloodType}</p>
                                    <p>Blood Group: {request.blood.bloodGroup}</p>
                                    <p>Units: {request.units}</p>
                                    <p>Date: {request.date}</p>
                                    <p>Critical: {request.critical}</p>
                                    <p>Donation Address: {request.donationAddress.building}, {request.donationAddress.locality}, {request.donationAddress.city}, {request.donationAddress.pincode}, {request.donationAddress.state}, {request.donationAddress.country}</p>
                                    <button className='btn btn-primary'>Share</button>
                                </div>
                            ))
                        ) : (
                            <p>No other blood requests to user found.</p>
                        )}
                    </div>
                )}
            </div>
        )
    }
