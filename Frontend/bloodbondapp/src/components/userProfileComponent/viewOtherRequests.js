import { useEffect, useContext,useState } from "react";
import axios from "axios";
import BloodRequestContext from "../../contexts/bloodRequestContext";
import { Container, Table, Button, Alert,Modal,Form } from 'react-bootstrap';
import Swal from "sweetalert2";
export default function ViewOtherRequests() {
    const [selectedRequest,setSelectedRequest]=useState(null)
    const [show,setShow]=useState(false)
    const [email,setEmail]=useState('')
    const [error, setError] = useState('');
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
                console.log('other blood requests for user type', response.data);
                const data = response.data;
                bloodRequestDispatch({ type: "DISPLAY_OTHER_BLOODREQUEST_TO_USER", payload: data });
            } catch (err) {
                console.error('Error in fetching other blood requests', err);
            }
        };
        fetchOtherBloodRequests();
    }, [bloodRequestDispatch]);
    const handleShow=(request)=>{
        setSelectedRequest(request)
        setShow(true)
    }
    const handleClose = () => {
        setShow(false);
        setEmail('');
        setError('');
    };
    const handleShare = async () => {
        if (!email) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3080/api/request/share', {
                requestId: selectedRequest._id,
                email
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            console.log('Email sent successfully:', response.data);
            handleClose();
            Swal.fire({
                title: 'Success!',
                text: 'BloodRequest Info shared successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } catch (err) {
            console.error('Error sending email:', err);
            setError('Failed to send email. Please try again.');
        }
    };
        return (
        <Container>
            <h2 className="text-center my-4">Other Blood Requests</h2>
            {bloodRequests.otherRequestToUser && bloodRequests.otherRequestToUser.length > 0 ? (
                <Table striped bordered hover>
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bloodRequests.otherRequestToUser.map((request, index) => (
                            <tr key={request._id} className={request.critical === 'yes' ? 'table-danger' : ''}>
                                <td>{request.patientName}</td>
                                <td>{request.atendeePhNumber}</td>
                                <td>{request.blood.bloodType}</td>
                                <td>{request.blood.bloodGroup}</td>
                                <td>{request.units}</td>
                                <td>{new Date(request.date).toLocaleDateString()}</td>
                                <td>{request.critical}</td>
                                <td>{`${request.donationAddress.building}, ${request.donationAddress.locality}, ${request.donationAddress.city}, ${request.donationAddress.pincode}, ${request.donationAddress.state}, ${request.donationAddress.country}`}</td>
                                <td ><button className="btn btn-danger" onClick={()=>handleShow(request)}>Share</button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div className="d-flex justify-content-center btn btn-danger" style={{height:'50px',width:'300px',marginLeft:'400px'}}> No other blood requests found</div>
                   
                        )}
                        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Share Blood Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        {error && <p className="text-danger">{error}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleShare}>
                        Share
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
