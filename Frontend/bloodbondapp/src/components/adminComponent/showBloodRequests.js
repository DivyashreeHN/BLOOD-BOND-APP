import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import BloodRequestContext from '../../contexts/bloodRequestContext';
import BloodResponseContext from '../../contexts/bloodResponseContext';
import { useDispatch } from 'react-redux';

export default function BloodRequest() {
    const dispatch = useDispatch();
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);
    const {bloodResponses,bloodResponseDispatch}=useContext(BloodResponseContext)

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/requests', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                bloodRequestDispatch({ type: 'LIST_BLOODREQUEST_TO_ADMIN', payload: response.data });
            } catch (error) {
                bloodRequestDispatch({ type: 'SET_SERVER_ERRORS', payload: error.message });
            }
        })();
    }, [bloodRequestDispatch]);

    const handleUpdateStatus=async()=>
        {
            try {
                const response = await axios.post('http://localhost:3080/api/response',{}, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                bloodResponseDispatch({ type: 'ADD_RESPONSE_BY_ADMIN', payload: response.data });
                console.log('response by admin',response.data)
            } catch (error) {
                bloodResponseDispatch({ type: 'SET_SERVER_ERRORS', payload: [error.message] });
            }
        }
    
        
    return (
        <div>
            {bloodRequests.serverErrors && bloodRequests.serverErrors.length > 0 ? (
                <p>Error: {bloodRequests.serverErrors.join(", ")}</p>
            ) : (
                <div>
                    {bloodRequests.bloodRequestToAdmin && bloodRequests.bloodRequestToAdmin.length > 0 ? (
                        <div>
                            {bloodRequests.bloodRequestToAdmin.map((request, index) => (
                                <div key={request._id}>
                                    <h1>BloodRequest: {index + 1}</h1>
                                    <p>Request ID: {request._id}</p>
                                    <p>Patient Name: {request.patientName}</p>
                                    <p>Attendee Phone Number: {request.atendeePhNumber}</p>
                                    <p>Blood Type: {request.blood.bloodType}</p>
                                    <p>Blood Group: {request.blood.bloodGroup}</p>
                                    <p>Date: {request.date}</p>
                                    <p>Critical: {request.critical}</p>
                                    
                                </div>
                            ))}
                            <button className='btn btn-primary' onClick={handleUpdateStatus} > updateStatus</button>
                        </div>
                    ) : (
                        <p>No blood requests found.</p>
                    )}
                    
                    
                </div>
            )}
        </div>
    );
}
