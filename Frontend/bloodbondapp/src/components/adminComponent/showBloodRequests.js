import { useEffect, useContext } from 'react';
import axios from 'axios';
import BloodRequestContext from '../../contexts/bloodRequestContext';
import BloodResponseContext from '../../contexts/bloodResponseContext';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

export default function BloodRequest() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);
    const { bloodResponses, bloodResponseDispatch } = useContext(BloodResponseContext);

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

    const handleUpdateStatus = async () => {
        try {
            const response = await axios.post('http://localhost:3080/api/response', {}, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            bloodResponseDispatch({ type: 'ADD_RESPONSE_BY_ADMIN', payload: response.data });
            console.log('response by admin', response.data);
        } catch (error) {
            bloodResponseDispatch({ type: 'SET_SERVER_ERRORS', payload: [error.message] });
        }
    };

    return (
        <Container>
            <h2 className="text-center my-4">Blood Requests</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white mb-3">
                        <Card.Body>
                            {bloodRequests.serverErrors && bloodRequests.serverErrors.length > 0 ? (
                                <p>Error: {bloodRequests.serverErrors.join(", ")}</p>
                            ) : (
                                <div>
                                    {bloodRequests.bloodRequestToAdmin && bloodRequests.bloodRequestToAdmin.length > 0 ? (
                                        <div>
                                            {bloodRequests.bloodRequestToAdmin.map((request, index) => (
                                                <Card key={request._id} className="mb-3">
                                                    <Card.Body>
                                                        <Card.Title>Blood Request {index + 1}</Card.Title>
                                                        <Card.Text>
                                                            <p><strong>Request ID:</strong> {request._id}</p>
                                                            <p><strong>Patient Name:</strong> {request.patientName}</p>
                                                            <p><strong>Attendee Phone Number:</strong> {request.atendeePhNumber}</p>
                                                            <p><strong>Blood Type:</strong> {request.blood.bloodType}</p>
                                                            <p><strong>Blood Group:</strong> {request.blood.bloodGroup}</p>
                                                            <p><strong>Date:</strong> {request.date}</p>
                                                            <p><strong>Critical:</strong> {request.critical}</p>
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                            <div className="text-center">
                                                <Button className="btn btn-light" onClick={handleUpdateStatus}>Update Status</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No blood requests found.</p>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
