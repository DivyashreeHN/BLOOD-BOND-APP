import React from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Button, Container, Row, Col } from 'react-bootstrap'
import { startDeletingUserProfile } from '../../actions/userprofileActions'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const ViewProfile = () => {
  const [editProfileData, setEditProfileData] = useState(null)
  const location = useLocation()
  const { profile } = location.state
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleProfileDelete = (id) => {
    dispatch(startDeletingUserProfile(id))
  };

  const handleProfileEdit = (profile) => {
   
         navigate(`/profile/${profile._id}/profileForm`, { state: { profileData: profile } });
  };

  return (
    <Container>
      <h2 className="text-center my-4">Profile Details</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="bg-danger text-white">
            <Card.Body>
              <Card.Title>{profile.firstName} {profile.lastName}</Card.Title>
        <Card.Text>
                <p>Profile Id: {profile._id}</p>
                <p>User Id: {profile.user}</p>
                <p>FirstName: {profile.firstName}</p>
                <p>LastName: {profile.lastName}</p>
                <p>DOB: (new Date{profile.dob}.toLocaleDateString)</p>
                <p>Gender: {profile.gender}</p>
                <p>Phone Number: {profile.phNo}</p>
                
                <p>Blood Group: {profile.blood.bloodGroup}</p>
                <p>Last Blood Donation Date: {profile.lastBloodDonationDate}</p>
                <p>Address: {profile.address.building}, {profile.address.locality}, {profile.address.city}, {profile.address.pincode}, {profile.address.state}, {profile.address.country}</p>
                <p>Weight: {profile.weight}</p>
                <p>Tested +ve For HIV: {profile.testedPositiveForHiv }</p>
                <p>Tattoo and Body Piercing: {profile.tattoBodyPiercing}</p>
              </Card.Text>
              <div className="d-flex justify-content-between">
                <Button className="btn btn-light" onClick={() => handleProfileEdit(profile)} style={{ marginRight: '10px' }} variant="primary">Edit Profile</Button>
                <Button className="btn btn-light" onClick={() => handleProfileDelete(profile._id)} style={{ marginLeft: '10px' }} variant="primary">Delete Profile</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
export default ViewProfile
