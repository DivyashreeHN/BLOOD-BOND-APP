import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import ProfileForm from './profileForm'
import BloodRequestForm from './blood-requestForm'
import { useDispatch, useSelector } from 'react-redux'
import { startFetchingUserProfile, startDeletingUserProfile, startEditingUserProfile } from '../../actions/userprofileActions'
import BloodRequestContext from "../../contexts/bloodRequestContext"

export default function ProfileDashboard() {
    const [showProfileForm, setShowProfileForm] = useState(false)
    const [showBloodRequestForm, setShowBloodRequestForm] = useState(false)
    const [showBloodRequests, setShowBloodRequests] = useState(false)
    const [formTitle, setFormTitle] = useState('')
    const [editProfileData, setEditProfileData] = useState(null)
    const [editUserBloodRequest,setEditUserBloodRequest]=useState(null)

    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext)

    const dispatch = useDispatch()
    const singlePro = useSelector((state) => state.profiles.singleProfile)

    useEffect(() => {
        dispatch(startFetchingUserProfile());
    }, [dispatch]);

    const handleProfileClick = () => {
        setShowProfileForm(true)
        setShowBloodRequestForm(false)
        setShowBloodRequests(false)
        setFormTitle('Add Profile')
        setEditProfileData(null)
    }

    const handleBloodRequestClick = () => {
        setShowBloodRequestForm(true)
        setShowProfileForm(false)
        setShowBloodRequests(false)
        setFormTitle('Add Request')
        setEditProfileData(null)
    }

    const handleUserBloodRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3080/api/blood/request/user', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = response.data
            bloodRequestDispatch({ type: "DISPLAY_USER_BLOOD_REQUEST", payload: data })
            setShowBloodRequests(true)
            setShowProfileForm(false)
            setShowBloodRequestForm(false)
        } catch (err) {
            console.error(err, 'error in fetching user blood requests')
        }
    };

    const handleProfileDelete = (id) => {
        dispatch(startDeletingUserProfile(id))
    };

    const handleProfileEdit = (id) => {
        const profileToEdit = singlePro.find((profile) => profile._id === id)
        setEditProfileData(profileToEdit)
        setShowProfileForm(true)
        setShowBloodRequestForm(false)
        setShowBloodRequests(false)
        setFormTitle('Edit Profile')
    };

    const handleBloodRequestDelete = async(id) => {
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
        const bloodRequestToEdit=bloodRequests.userBloodRequests.find((request)=>
        {
            return request._id==id
        })
        setEditUserBloodRequest(bloodRequestToEdit)
        console.log('bloodREquest Edit',bloodRequestToEdit)
        setShowProfileForm(false)
        setShowBloodRequestForm(true)
        setShowBloodRequests(false)
        setFormTitle('Edit user BloodRequest')
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h3>Profile Dashboard</h3>
            <button className='btn btn-primary' onClick={handleUserBloodRequests}>User Requests</button>
            {singlePro?.length === 0 ? (
                <div>
                    <button className='btn btn-primary' onClick={handleProfileClick}>Add Profile</button> |
                </div>
            ) : (
                singlePro?.map((ele, index) => (
                    <div key={index}>
                        <p>FirstName: {ele.firstName}</p>
                        <p>LastName: {ele.lastName}</p>
                        <p>DOB: {ele.dob}</p>
                        <p>Gender: {ele.gender}</p>
                        <p>PhoneNumber: {ele.phNo}</p>
                        <p>BloodType: {ele.blood.bloodType}</p>
                        <p>BloodGroup: {ele.blood.bloodGroup}</p>
                        <p>LastBloodDonationDate: {ele.lastBloodDonationDate}</p>
                        <p>Address: {ele.address.building}, {ele.address.locality}, {ele.address.city}, {ele.address.pincode}, {ele.address.state}, {ele.address.country}</p>
                        <p>Weight: {ele.weight}</p>
                        <p>Tested +ve For Hiv: {ele.testedPositiveForHiv}</p>
                        <p>Tattoo and Body Piercing: {ele.tattoBodyPiercing}</p>
                        <button className='btn btn-primary' onClick={handleBloodRequestClick}>Add Request</button> |
                        <button className='btn btn-primary' onClick={() => handleProfileDelete(ele._id)}>Delete Profile</button> |
                        <button className='btn btn-primary' onClick={() => handleProfileEdit(ele._id)}>Edit Profile</button>
                    </div>
                ))
            )}
            {showProfileForm && <ProfileForm formTitle={formTitle} profileData={editProfileData} />}
          {showBloodRequestForm && <BloodRequestForm formTitle={formTitle} bloodRequestData={editUserBloodRequest} />}

            {showBloodRequests && (
                <div>
                    <h4>User Blood Requests</h4>
                    {bloodRequests.userBloodRequests.length > 0 ? (
                        bloodRequests.userBloodRequests.map((request, index) => (
                            <div key={index}>
                                <h1>BloodRequest: {index + 1}</h1>
                                <p>Request ID: {request._id}</p>
                                <p>Patient Name: {request.patientName}</p>
                                <p>Atendee Phone Number: {request.atendeePhNumber}</p>
                                <p>Blood Type: {request.blood.bloodType}</p>
                                <p>Blood Group: {request.blood.bloodGroup}</p>
                                <p>Date: {request.date}</p>
                                <p>Critical: {request.critical}</p>
                                <button className='btn btn-primary' onClick={() => handleBloodRequestDelete(request._id)}>Delete request</button> |
                                <button className='btn btn-primary' onClick={() => handleBloodRequestEdit(request._id)}>Edit request</button>
                            </div>
                        ))
                    ) : (
                        <p>No blood requests found.</p>
                    )}
                </div>
            )}
        </div>
    )
}
