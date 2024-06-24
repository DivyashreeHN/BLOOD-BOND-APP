import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startFetchingProfile } from "../../actions/userprofileActions";
import { Card, Container, Row, Col } from 'react-bootstrap';

export default function ShowProfiles() {
  const dispatch = useDispatch();
  const profileDisplayData = useSelector(state => state.profiles.profileDisplayData);
  const serverErrors = useSelector(state => state.profiles.serverErrors);

  useEffect(() => {
    // Fetch profile data when the component mounts
    dispatch(startFetchingProfile());
  }, [dispatch]);

  console.log("Profile Display Data:", profileDisplayData); // Log profile data for debugging

  return (
    <Container>
      <div>
        {serverErrors.length > 0 ? (
          <p>Error: {serverErrors.join(", ")}</p>
        ) : (
          <div>
            <h2 className="text-center my-4">Profile Details</h2>
            <Row className="justify-content-center">
              <Col md={6}>
                {profileDisplayData.length > 0 ? (
                  profileDisplayData.map((profile, index) => (
                    <Card key={index} className="mb-3 bg-danger text-white">
                      <Card.Body>
                        <Card.Title>User Profile {index + 1}</Card.Title>
                        <Card.Text>
                          <p>First Name: {profile.firstName}</p>
                          <p>Last Name: {profile.lastName}</p>
                          <p>Date of Birth: {profile.dob}</p>
                          <p>Gender: {profile.gender}</p>
                          <p>Phone Number: {profile.phNo}</p>
                          <p>Blood Type: {profile.blood.bloodType}</p>
                          <p>Blood Group: {profile.blood.bloodGroup}</p>
                          <p>Last Blood Donation Date: {profile.lastBloodDonationDate}</p>
                          <p>Building: {profile.address.building}</p>
                          <p>Locality: {profile.address.locality}</p>
                          <p>City: {profile.address.city}</p>
                          <p>State: {profile.address.state}</p>
                          <p>Pincode: {profile.address.pincode}</p>
                          <p>Country: {profile.address.country}</p>
                          <p>GeoLocation: [{profile.geoLocation.coordinates[0]}, {profile.geoLocation.coordinates[1]}]</p>
                          <p>Weight: {profile.weight}</p>
                          <p>Tested Positive for HIV: {profile.testedPositiveForHiv ? "Yes" : "No"}</p>
                          <p>Tattoo/Body Piercing: {profile.tattoBodyPiercing ? "Yes" : "No"}</p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>No profiles to display</p>
                )}
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Container>
  );
}
