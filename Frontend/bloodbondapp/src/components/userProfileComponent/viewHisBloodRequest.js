import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import BloodRequestContext from "../../contexts/bloodRequestContext";
import { useNavigate } from 'react-router-dom';

export default function ViewHisRequest() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBloodRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                bloodRequestDispatch({ type: "DISPLAY_USER_BLOOD_REQUEST", payload: response.data });
            } catch (err) {
                console.error('Error in fetching user blood requests', err);
            }
        };
        fetchMyBloodRequests();
    }, [bloodRequestDispatch]);

    const handleEditRequest = (id) => {
        const bloodRequestToEdit = bloodRequests.userBloodRequests.find((request) => request._id === id)
        if (bloodRequestToEdit) {
            navigate(`/edit-request/${id}`, { state: { bloodRequestData: bloodRequestToEdit } })
        } else {
            console.error(`Request with id ${id} not found.`)
        }
    };

    const handleDeleteRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:3080/api/blood/request/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });
            bloodRequestDispatch({ type: 'DELETE_USER_BLOOD_REQUEST', payload: id })
        } catch (err) {
            console.error('Error in deleting user blood request', err)
        }
    };

    return (
        <div>
            <h1>My Requests</h1>
            <ul>
            {bloodRequests.userBloodRequests.map(request => (
                    <li key={request._id}>
                         
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
              <button className="btn btn-primary" onClick={() => handleEditRequest(request._id)}>Edit Request</button>
                        <button className="btn btn-primary" onClick={() => handleDeleteRequest(request._id)}>Delete Request</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
