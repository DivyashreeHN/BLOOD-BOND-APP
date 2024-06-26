import React, { useEffect, useContext, useState } from "react"
import axios from "axios"
import { Card, Button, Col, Row, Container } from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { startFetchingUserProfile } from '../../actions/userprofileActions'
import UserHistoryContext from "../../contexts/userHistoryContext"
import Swal from 'sweetalert2'

export default function UserResponseHistory() {
    const dispatch = useDispatch()
    const singlePro = useSelector((state) => state.profiles.singleProfile)
    const { userHistories, userHistoryDispatch } = useContext(UserHistoryContext)
    const [deletedResponseId, setDeletedResponseId] = useState(null)

    // console.log('singlePro from useSelector:', singlePro);
    // console.log('userHistories from context:', userHistories);

    useEffect(() => {
        dispatch(startFetchingUserProfile())
    }, [dispatch])

    useEffect(() => {
        const fetchResponseHistories = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('Token not found.')
                }

                if (singlePro && singlePro.length > 0) {
                    const profileId = singlePro[0]._id
                    // console.log('Fetching histories for profile ID:', profileId);

                    const response = await axios.get(`http://localhost:3080/api/user/histories/${profileId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    });

                    console.log('Response data:', response.data)

                    userHistoryDispatch({ type: "USER_RESPONSE_HISTORY", payload: response.data })
                }
            } catch (err) {
                console.error('Error in fetching response history to user:', err)
            }
        };

        fetchResponseHistories()
    }, [singlePro, userHistoryDispatch])

    const handleDelete = async (responderId, bloodRequestId) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token not found.')
            }

            const response = await axios.delete(`http://localhost:3080/api/user/history/delete/${responderId}/${bloodRequestId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            console.log('Delete response:', response.data)

            // Show sweet alert upon successful deletion
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'You deleted a response.',
                showConfirmButton: true,
                confirmButtonText: 'OK'
            }).then(() => {
                // Update the state with the updated list of responses
                userHistoryDispatch({ type: "USER_RESPONSE_HISTORY", payload: response.data.updatedResponses })
                setDeletedResponseId(bloodRequestId) // Store deleted response ID for UI update
            });
        } catch (err) {
            console.error('Error in deleting response:', err)
        }
    };

    return (
        <Container>
            <h2 className="text-center my-4">My History</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="bg-danger text-white mb-3">
                        <Card.Body>
                            <div>
                                {/* <h4> My Responses</h4> */}
                                {Array.isArray(userHistories.userResponsesHistory) && userHistories.userResponsesHistory.length > 0 ? (
                                    userHistories.userResponsesHistory.map((response, index) => (
                                        response && response.bloodRequest && response.bloodRequest._id !== deletedResponseId ? (
                                            <div key={index}>
                                                <p>Patient Name:  {response.bloodRequest ? response.bloodRequest.patientName : ''}</p>
                                                <p>BloodType:  {response.bloodRequest ? response.bloodRequest.blood.bloodType : ''}</p>
                                                <p>BloodGroup:  {response.bloodRequest ? response.bloodRequest.blood.bloodGroup : ''}</p>
                                                <p>Critical:  {response.bloodRequest ? response.bloodRequest.critical : ''}</p>
                                                <p>Units:  {response.bloodRequest ? response.bloodRequest.units: ''}</p>
                                                
                                                <Button className="btn-btn-primary"
                                                    variant="primary"
                                                    onClick={() => handleDelete(singlePro && singlePro.length > 0 ? singlePro[0]._id : 'Unknown', response.bloodRequest ? response.bloodRequest._id : 'Unknown')}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ) : null
                                    ))
                                ) : (
                                    <p>No responses found.</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
