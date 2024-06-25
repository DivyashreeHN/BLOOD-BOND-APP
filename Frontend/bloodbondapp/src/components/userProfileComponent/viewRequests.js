import { useEffect, useContext } from "react";
import BloodRequestContext from "../../contexts/bloodRequestContext";
import ResponseContext from "../../contexts/responseContext";
import axios from "axios";
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function ViewRequests() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);
    const { responses, responseDispatch } = useContext(ResponseContext);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log('bloodRequest which match profile', response.data);
                const data = response.data;
                bloodRequestDispatch({ type: "DISPLAY_BLOODREQUEST_TO_USER", payload: data });
            } catch (err) {
                console.error(err, 'error in fetching request to user');
            }
        }
        fetchRequests();
    }, [bloodRequestDispatch]);

    const handleResponseByUser = async (id, value) => {
        try {
            const response = await axios.post(`http://localhost:3080/api/response/${id}`, { status: value }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            responseDispatch({ type: 'RESPONSE_ADDED_BY_USER', payload: response.data });
            console.log('response by user', response.data);

            // Show SweetAlert2 based on the response
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
        } catch (error) {
            responseDispatch({ type: 'SET_SERVER_ERRORS', payload: [error.message] });
        }
    }

    return (
        <Container>
            <h2 className="text-center my-4">Blood Requests</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white mb-3">
                        <Card.Body>
                            <div>
                                <h4>Request to User</h4>
                                {bloodRequests.requestToUser.length > 0 ? (
                                    bloodRequests.requestToUser.map((request, index) => (
                                        <div key={index}>
                                            <h4>BloodRequest: {index + 1}</h4>
                                            <p>BloodRequest ID: {request._id}</p>
                                            <p>BloodRequest UserID: {request.user}</p>
                                            <p>Patient Name: {request.patientName}</p>
                                            <p>Attendee Phone Number: {request.atendeePhNumber}</p>
                                            <p>Blood Type: {request.blood.bloodType}</p>
                                            <p>Blood Group: {request.blood.bloodGroup}</p>
                                            <p>Units: {request.units}</p>
                                            <p>Date: {request.date}</p>
                                            <p>Critical: {request.critical}</p>
                                            <p>Donation Address: {request.donationAddress.building}, {request.donationAddress.locality}, {request.donationAddress.city}, {request.donationAddress.pincode}, {request.donationAddress.state}, {request.donationAddress.country}</p>
                                            <Button className='btn btn-light me-2' onClick={() => handleResponseByUser(request._id, 'accepted')}>Accept</Button>
                                            <Button className='btn btn-light me-2' onClick={() => handleResponseByUser(request._id, 'rejected')}>Reject</Button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No blood requests to user found.</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
