import { useEffect, useContext } from "react";
import axios from "axios";
import BloodRequestContext from "../../contexts/bloodRequestContext";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function ViewOtherRequests() {
    const { bloodRequests, bloodRequestDispatch } = useContext(BloodRequestContext);

    useEffect(() => {
        const fetchOtherBloodRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3080/api/blood/request/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log('other blood request for user type', response.data);
                const data = response.data;
                bloodRequestDispatch({ type: "DISPLAY_OTHER_BLOODREQUEST_TO_USER", payload: data });
            } catch (err) {
                console.error(err, 'error in fetching request to user');
            }
        };
        fetchOtherBloodRequests();
    }, [bloodRequestDispatch]);

    return (
        <Container>
            <h2 className="text-center my-4">Other Blood Requests</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white mb-3">
                        <Card.Body>
                            <div>
                                <h4>Other Requests</h4>
                                {bloodRequests.otherRequestToUser.length > 0 ? (
                                    bloodRequests.otherRequestToUser.map((request, index) => (
                                        <div key={index}>
                                            <h4>Blood Request: {index + 1}</h4>
                                            <p>Blood Request ID: {request._id}</p>
                                            <p>User ID: {request.user}</p>
                                            <p>Patient Name: {request.patientName}</p>
                                            <p>Attendee Phone Number: {request.atendeePhNumber}</p>
                                            <p>Blood Type: {request.blood.bloodType}</p>
                                            <p>Blood Group: {request.blood.bloodGroup}</p>
                                            <p>Units: {request.units}</p>
                                            <p>Date: {request.date}</p>
                                            <p>Critical: {request.critical}</p>
                                            <p>Donation Address: {request.donationAddress.building}, {request.donationAddress.locality}, {request.donationAddress.city}, {request.donationAddress.pincode}, {request.donationAddress.state}, {request.donationAddress.country}</p>
                                            <Button className='btn btn-light' style={{ marginTop: '10px' }}>Share</Button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No other blood requests to user found.</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
