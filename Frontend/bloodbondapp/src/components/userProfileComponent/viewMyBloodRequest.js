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
    }

    return (
        <Container>
            <h2 className="text-center my-4">My Blood Requests</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    {bloodRequests.userBloodRequests.length > 0 ? (
                        bloodRequests.userBloodRequests.map((request, index) => (
                            <Card className="mb-4 bg-danger text-white" key={index}>
                                <Card.Body>
                                    <Card.Title>Blood Request {index + 1}</Card.Title>
                                    <Card.Text>
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
                                    </Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button className="btn btn-light" onClick={() => handleEditRequest(request._id)} style={{ marginRight: '10px' }} variant="primary">Edit Request</Button>
                                        <Button className="btn btn-light" onClick={() => handleDeleteRequest(request._id)} style={{ marginLeft: '10px' }} variant="primary">Delete Request</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No blood requests found.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}