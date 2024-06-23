import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { startFetchingPendingBloodBank, startFetchingUpdatedBloodBank } from "../../actions/bloodbankActions";

export default function BloodBank() {
  const dispatch = useDispatch();
  const pendingBloodbanks = useSelector(state => state.bloodbanks.pendingBloodbanks);
  const serverErrors = useSelector(state => state.bloodbanks.serverErrors);

  useEffect(() => {
    dispatch(startFetchingPendingBloodBank());
  }, [dispatch]);

  console.log("Pending Bloodbanks:", pendingBloodbanks);
  console.log("Server Errors:", serverErrors);

  if (serverErrors.length > 0) {
    return <p>Error: {serverErrors.join(", ")}</p>;
  }

  if (!pendingBloodbanks || pendingBloodbanks.length === 0) {
    return <p>No BloodBank to display</p>;
  }

  const formatUrl = (path) => {
    const formattedPath = path.replace(/\\/g, '/');
    return `http://localhost:3080/${formattedPath}`;
  };

  const handleBloodbankRequest = async (bloodbankId, value) => {
    try {
      await dispatch(startFetchingUpdatedBloodBank(bloodbankId, value));
      Swal.fire({
        icon: 'success',
        title: value === 'approved' ? 'Request Approved' : 'Request Declined',
        text: value === 'approved' ? 'You have accepted the request.' : 'You have declined the request.',
      });
    } catch (error) {
      dispatch({ type: 'SET_SERVER_ERRORS', payload: [error.message] });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <Container>
      <h2 className="text-center my-4">Pending BloodBanks</h2>
      <Row className="justify-content-center">
        {pendingBloodbanks.map((bloodbank, index) => (
          <Col md={6} key={index} className="mb-4">
            <Card className="bg-danger text-white">
              <Card.Body>
                <Card.Title>{bloodbank.name}</Card.Title>
                <Card.Text>
                  {bloodbank.license && (
                    <div>
                      <h6>License:</h6>
                      <img className="img-fluid" src={formatUrl(bloodbank.license[0])} alt="License" />
                    </div>
                  )}
                  {bloodbank.photos && (
                    <div>
                      <h6>Photos:</h6>
                      {bloodbank.photos.map((photo, i) => (
                        <img className="img-fluid mb-2" key={i} src={formatUrl(photo)} alt={`Photo ${i}`} />
                      ))}
                    </div>
                  )}
                  <h6>Contact Number:</h6>
                  <p>{bloodbank.phoneNumber}</p>
                  <h6>Address:</h6>
                  <p>{bloodbank.address.building}, {bloodbank.address.locality}, {bloodbank.address.city}, {bloodbank.address.pincode}, {bloodbank.address.state}, {bloodbank.address.country}</p>
                  <h6>Opening Hours:</h6>
                  <p>{bloodbank.openingHours.opensAt.hour}:{bloodbank.openingHours.opensAt.minutes} {bloodbank.openingHours.opensAt.period} - {bloodbank.openingHours.closesAt.hour}:{bloodbank.openingHours.closesAt.minutes} {bloodbank.openingHours.closesAt.period}</p>
                  <h6>Services:</h6>
                  {bloodbank.services.map((service, i) => (
                    <p key={i}>{service}</p>
                  ))}
                </Card.Text>
                
                <div className="mt-3 d-flex justify-content-between">
                  <Button className="btn btn-light" onClick={() => handleBloodbankRequest(bloodbank._id, 'approved')} variant="primary">Approve</Button>
                  <Button className="btn btn-light" onClick={() => handleBloodbankRequest(bloodbank._id, 'declined')} variant="primary">Decline</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
