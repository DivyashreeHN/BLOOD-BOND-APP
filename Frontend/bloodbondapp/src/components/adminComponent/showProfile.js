import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { startFetchingProfile } from "../../actions/userprofileActions"

export default function ShowProfiles() {
  const dispatch =useDispatch()
  const profileDisplayData = useSelector(state => state.profiles.profileDisplayData)
  const serverErrors = useSelector(state => state.profiles.serverErrors)

  useEffect(() => {
    // Fetch profile data when the component mounts
    dispatch(startFetchingProfile())
  }, [dispatch])

  console.log("Profile Display Data:", profileDisplayData); // Log profile data for debugging

  return (
    <div>
      {serverErrors.length > 0 ? (
        <p>Error: {serverErrors.join(", ")}</p>
      ) : (
        <div>
          {profileDisplayData.length > 0 ? (
            <div>
              {profileDisplayData.map((profile, index) => (
                <div key={index}>
                  <h1>User Profile {index + 1}</h1>
                  <p>FirstName: {profile.firstName}</p>
                  <p>LastName: {profile.lastName}</p>
                  <p>DateOfBirth: {profile.dob}</p>
                  <p>Gender: {profile.gender}</p>
                  <p>PhoneNumber: {profile.phNo}</p>
                  <p>BloodType: {profile.blood.bloodType}</p>
                  <p>BloodGroup: {profile.blood.bloodGroup}</p>
                  <p>LastBloodDonationDate: {profile.lastBloodDonationDate}</p>
                  <p>Building: {profile.address.building}</p>
                  <p>Locality: {profile.address.locality}</p>
                  <p>City: {profile.address.city}</p>
                  <p>State: {profile.address.state}</p>
                  <p>Pincode: {profile.address.pincode}</p>
                  <p>Country: {profile.address.country}</p>
                  <p>GeoLocation: [{profile.geoLocation.coordinates[0]}, {profile.geoLocation.coordinates[1]}]</p>
                  <p>Weight: {profile.weight}</p>
                  <p>TestedPositiveForHiv: {profile.testedPositiveForHiv}</p>
                  <p>TattoBodyPiercing: {profile.tattoBodyPiercing}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No profiles to display</p>
          )}
        </div>
      )}
    </div>
  )

}



