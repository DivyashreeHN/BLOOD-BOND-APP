    import React, { useState, useEffect, useContext } from 'react'
    import axios from 'axios'
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

        const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext)
        const {bloodResponses,bloodResponseDispatch}=useContext(BloodResponseContext)

        const dispatch = useDispatch()
        const singlePro = useSelector((state) => state.profiles.singleProfile)

        useEffect(() => {
            dispatch(startFetchingUserProfile());
        }, [dispatch]);

        const handleProfileClick = () => {
            setShowProfileForm(true)
            setShowBloodRequestForm(false)
            setShowBloodRequests(false)
            setShowRequestToUser(false)
            setFormTitle('Add Profile')
            setEditProfileData(null)
        }

        const handleBloodRequestClick = () => {
            setShowBloodRequestForm(true)
            setShowProfileForm(false)
            setShowRequestToUser(false)
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
                setShowRequestToUser(false)
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
            setShowRequestToUser(false)
            setFormTitle('Edit Profile')
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
                        Authorization: localStorage.getItem('token')
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
                <h3>Profile Dashboard</h3>
                {singlePro?.length === 0 ? (
                    <div>
                        <button className='btn btn-primary' onClick={handleProfileClick}>Add Profile</button>
                    </div>
                ) : (
                    <>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                        <button className='btn btn-primary' onClick={handleUserBloodRequests}>User Requests</button>
                        <button className='btn btn-primary' onClick={handleRequestToUser}>Request To User</button>
                        <button className='btn btn-primary' onClick={handleOtherRequest}>Other Requests</button>
                        </div>
                        {!showBloodRequestForm && !editProfileData && !showBloodRequests && !showOtherRequests && !showRequestToUser && singlePro?.map((ele, index) => (
                            <div key={index}>
                                <p>Profile Id: {ele._id}</p>
                                <p>User Id: {ele.user}</p>
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
                        ))}
                    </>
                )}
                {showProfileForm && <ProfileForm formTitle={formTitle} profileData={editProfileData} />}
                {showBloodRequestForm && <BloodRequestForm formTitle={formTitle} bloodRequestData={editUserBloodRequest} />}

                {showBloodRequests  && (
                    <div>
                        <h3>User Blood Requests</h3>
                        {bloodRequests.userBloodRequests.length > 0 ? (
                            bloodRequests.userBloodRequests.map((request, index) => (
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
                                    <button className='btn btn-primary' onClick={() => handleBloodRequestDelete(request._id)}>Delete request</button> |
                                    <button className='btn btn-primary' onClick={() => handleBloodRequestEdit(request._id)}>Edit request</button>
                                </div>
                            ))
                        ) : (
                            <p>No blood requests found.</p>
                        )}
                    </div>
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
