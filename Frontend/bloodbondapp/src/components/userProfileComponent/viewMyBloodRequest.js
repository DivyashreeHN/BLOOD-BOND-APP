import React, { useEffect, useContext } from 'react'
import axios from 'axios'
import BloodRequestContext from "../../contexts/bloodRequestContext"
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

export default function ViewMyRequests() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMyBloodRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                bloodRequestDispatch({ type: "DISPLAY_USER_BLOOD_REQUEST", payload: response.data })
            } catch (err) {
                console.error('Error in fetching user blood requests', err)
            }
        };
        fetchMyBloodRequests()
    }, [bloodRequestDispatch])

    const handleEditRequest = (id) => {
        const bloodRequestToEdit = bloodRequests.userBloodRequests.find((request) => request._id === id)
        if (bloodRequestToEdit) {
            navigate(`/edit-request/${id}`, { state: { bloodRequestData: bloodRequestToEdit } })
        } else {
            console.error(`Request with id ${id} not found.`)
        }
    }

    const handleDeleteRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:3080/api/blood/request/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            })
            bloodRequestDispatch({ type: 'DELETE_USER_BLOOD_REQUEST', payload: id })
        } catch (err) {
            console.error('Error in deleting user blood request', err)
        }
    };
    const handleUserResponses=async(id)=>{
        navigate(`/responses/${id}/user`)
    }
    const handleBloodBankResponses=async(id)=>{
        navigate(`/responses/${id}/bloodbank`)
    }

    return (
        <Container>
            <h2 className="text-center my-4">My Blood Requests</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white mb-3">
                        <Card.Body>
                            <div>
                                {bloodRequests.userBloodRequests.length > 0 ? (
                                    bloodRequests.userBloodRequests.map((request, index) => (
                                        <div key={index} className="mb-3">
                                            <Card className="bg-light text-dark">
                                                <Card.Body>
                                                    <h4>Blood Request: {index + 1}</h4>
                                                    <p>BloodRequest ID: {request._id}</p>
                                                    <p>User ID: {request.user}</p>
                                                    <p>Patient Name: {request.patientName}</p>
                                                    <p>Attendee Phone Number: {request.atendeePhNumber}</p>
                                                    <p>Blood Type: {request.blood.bloodType}</p>
                                                    <p>Blood Group: {request.blood.bloodGroup}</p>
                                                    <p>Units: {request.units}</p>
                                                    <p>Date: {request.date}</p>
                                                    <p>Critical: {request.critical}</p>
                                                    <p>Donation Address: {request.donationAddress.building}, {request.donationAddress.locality}, {request.donationAddress.city}, {request.donationAddress.pincode}, {request.donationAddress.state}, {request.donationAddress.country}</p>
                                                    <Button className="btn btn-primary mr-2" onClick={() => handleEditRequest(request._id)}>Edit Request</Button>
                                                    <Button className="btn btn-danger" onClick={() => handleDeleteRequest(request._id)}>Delete Request</Button>
                                                    <Button className='btn btn-primary' onClick={()=>{
                                                        handleUserResponses(request._id)
                                                    }}>User Responses</Button>
                                                    <Button className='btn btn-danger' onClick={()=>{
                                                        handleBloodBankResponses(request._id)
                                                    }}>BloodBank Responses</Button>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <p>No blood requests found.</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                    
                </Col>
            </Row>
        </Container>
    );
}