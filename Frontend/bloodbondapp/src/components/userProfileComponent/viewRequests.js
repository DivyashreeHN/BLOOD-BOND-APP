import { useEffect, useContext, useState } from "react"
import BloodRequestContext from "../../contexts/bloodRequestContext"
import ResponseContext from "../../contexts/responseContext"
import axios from "axios"
import { Button,Alert } from 'react-bootstrap'
import Swal from 'sweetalert2'

export default function ViewRequests() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext)
    const { responseDispatch } = useContext(ResponseContext)
    const [errors,setErrors]=useState([])
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log('bloodRequest which match profile', response.data)
                const data = response.data;
                bloodRequestDispatch({ type: "DISPLAY_BLOODREQUEST_TO_USER", payload: data })
                bloodRequestDispatch({ type: 'SET_SERVER_ERRORS', payload: [] })
                
            } catch (err) {
                bloodRequestDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response?.data?.errors })
                console.error(err)
            }
        }
        fetchRequests()
    }, [bloodRequestDispatch,responseDispatch])

    const handleResponseByUser = async (id, value) => {
        try {
            const response = await axios.post(`http://localhost:3080/api/response/${id}`, { status: value }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            responseDispatch({ type: 'RESPONSE_ADDED_BY_USER', payload: response.data })
            responseDispatch({type:'SET_SERVER_ERRORS',payload:[]})
           
            console.log('response by user', response.data)
            setErrors([])

            
            if (value === 'accepted') {
                Swal.fire({
                    icon: 'success',
                    title: 'Accepted',
                    text: 'Thank you for accepting the request!',
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Rejected',
                    text: 'Request has been rejected. Thank you for your response.',
                });
            }
        } catch (err) {
            responseDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
        setErrors([err.response.data.errors])
        }
    }

    return (
        <div className="container">
            <h1 className="d-flex justify-content-center">All Blood Requests</h1>
            {bloodRequests.requestToUser && bloodRequests.requestToUser.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            
                            <th>Patient Name</th>
                            <th>Attendee Phone Number</th>
                            <th>Blood Type</th>
                            <th>Blood Group</th>
                            <th>Units</th>
                            <th>Date</th>
                            <th>Critical</th>
                            <th>Donation Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-info">
                        {bloodRequests.requestToUser.map((request) => (
                            <tr key={request._id} className={request.critical === 'yes' ? 'table-danger' : ''}>
                               
                                <td>{request.patientName}</td>
                                <td>{request.atendeePhNumber}</td>
                                <td>{request.blood.bloodType}</td>
                                <td>{request.blood.bloodGroup}</td>
                                <td>{request.units}</td>
                                <td>{new Date(request.date).toLocaleDateString()}</td>
                                <td>{request.critical}</td>
                                <td>{`${request.donationAddress.building}, ${request.donationAddress.locality}, ${request.donationAddress.city}, ${request.donationAddress.pincode}, ${request.donationAddress.state}, ${request.donationAddress.country}`}</td>
                                <td>
                                    <Button  className="btn btn-danger" onClick={() => handleResponseByUser(request._id, 'accepted')}>Accept</Button>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="d-flex justify-content-center btn btn-danger" style={{height:'50px',width:'300px',marginLeft:'400px'}}>
                <p>No blood requests to user found</p>
                </div>
            )}
            
            {errors?.length>0 && <Alert variant="danger">{errors}</Alert>}
        </div>
    );
}
