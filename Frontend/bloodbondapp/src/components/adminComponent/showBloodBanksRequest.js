import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Container } from 'react-bootstrap';
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
      <h2 className="text-center my-4" style={{color:'rgba(255,0,0,0.7)'}}>{pendingBloodbanks.length} bloodbanks awaits for Approval</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>License</th>
            <th>Photos</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Opening Hours</th>
            <th>Services</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingBloodbanks.map((bloodbank, index) => (
            <tr key={index}>
              <td>{bloodbank.name}</td>
              <td>
                {bloodbank.license && (
                  <img className="img-fluid" src={formatUrl(bloodbank.license[0])} alt="License" style={{ width: '100px' }} />
                )}
              </td>
              <td>
                {bloodbank.photos && bloodbank.photos.map((photo, i) => (
                  <img className="img-fluid mb-2" key={i} src={formatUrl(photo)} alt={`Photo ${i}`} style={{ width: '100px' }} />
                ))}
              </td>
              <td>{bloodbank.phoneNumber}</td>
              <td>{`${bloodbank.address.building}, ${bloodbank.address.locality}, ${bloodbank.address.city}, ${bloodbank.address.pincode}, ${bloodbank.address.state}, ${bloodbank.address.country}`}</td>
              <td>{`${bloodbank.openingHours.opensAt.hour}:${bloodbank.openingHours.opensAt.minutes} ${bloodbank.openingHours.opensAt.period} - ${bloodbank.openingHours.closesAt.hour}:${bloodbank.openingHours.closesAt.minutes} ${bloodbank.openingHours.closesAt.period}`}</td>
              <td>
                {bloodbank.services.map((service, i) => (
                  <p key={i}>{service}</p>
                ))}
              </td>
              <td>
                <Button className="btn btn-dark" onClick={() => handleBloodbankRequest(bloodbank._id, 'approved')} variant="primary">Approve</Button>
                <Button className="btn btn-dark" onClick={() => handleBloodbankRequest(bloodbank._id, 'declined')} variant="primary" style={{marginTop:'15px'}}>Decline</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
