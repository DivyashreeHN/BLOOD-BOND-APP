import { startFetchingPendingBloodBank,startFetchingUpdatedBloodBank } from "../../actions/bloodbankActions"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
export default function BloodBank()
{
    const dispatch =useDispatch()
  const pendingBloodbanks = useSelector(state => state.bloodbanks.pendingBloodbanks)
  const serverErrors = useSelector(state => state.bloodbanks.serverErrors)

  useEffect(() => {
    
    dispatch(startFetchingPendingBloodBank())
  }, [dispatch])

  console.log("pending bloodbanks:", pendingBloodbanks); 
    console.log("Server Errors:", serverErrors); 

    if (serverErrors.length > 0) {
        return <p>Error: {serverErrors.join(", ")}</p>;
    }

    if (!pendingBloodbanks || pendingBloodbanks.length === 0) {
        return <p>No BloodBank to display</p>;
    }
//
const OpensAt = ({ opensAt }) => {
  if (!opensAt) return null;
  
  const { hour, minutes, period } = opensAt;
  return <p>OpensAt: {`${hour}:${minutes} ${period}`}</p>;
};

const ClosesAt = ({ closesAt }) => {
  if (!ClosesAt) return null;
  
  const { hour, minutes, period } = closesAt;
  return <p>ClosesAt: {`${hour}:${minutes} ${period}`}</p>;
};

//
const handleBloodbankRequest=(bloodbankId,value)=>{
    try {
      dispatch(startFetchingUpdatedBloodBank(bloodbankId,value))
      }
      
  catch (error) {
     dispatch({ type: 'SET_SERVER_ERRORS', payload: [error.message] });
  }
}
  
  return (
    <div>
      {serverErrors.length > 0 ? (
        <p>Error: {serverErrors.join(", ")}</p>
      ) : (
        <div>
          {pendingBloodbanks && pendingBloodbanks.length > 0 ?  (
            <div>
              {pendingBloodbanks.map((bloodbank, index) => (
                <div key={index}>
                  <h4>BloodBank {index + 1}</h4>
                  <p>BloodBank Name: {bloodbank.name}</p>
                  <p>PhoneNumber: {bloodbank.phoneNumber}</p>
                  <p>Building: {bloodbank.address.building}</p>
                  <p>Locality: {bloodbank.address.locality}</p>
                  <p>City: {bloodbank.address.city}</p>
                  <p>State: {bloodbank.address.state}</p>
                  <p>Pincode: {bloodbank.address.pincode}</p>
                  <p>Country: {bloodbank.address.country}</p>
                  <p>GeoLocation: [{bloodbank.geoLocation.coordinates[0]}, {bloodbank.geoLocation.coordinates[1]}]</p>
                  <p>AvailableBlood:{bloodbank.availableBlood}</p>
                  <p>ApprovalStatus : {bloodbank.isApproved}</p>
                  <p>License : {bloodbank.license}</p>
                  <OpensAt opensAt={bloodbank.openingHours && bloodbank.openingHours.opensAt} />
                  <ClosesAt closesAt={bloodbank.openingHours && bloodbank.openingHours.closesAt} />
                  <p>Photos : { bloodbank.photos}</p>
                  <p>Services : {bloodbank.services}</p>
                  <p>BloodBank User : { bloodbank.user}</p> 
                  {bloodbank.license && (
      <div>
        <p>License:</p>
        <img src={bloodbank.license} alt="Blood Bank License" style={{ width: '200px', height: 'auto' }} />
      </div>
    )}
                  <button className="btn btn-primary" onClick={()=>
                  handleBloodbankRequest(bloodbank._id,'approved')}>Approved</button> |  
                  <button className="btn btn-primary" onClick={()=>
                  handleBloodbankRequest(bloodbank._id,'declined')} >Declined</button>   
                </div>
               
              ))}
            </div>
          ) : (
            <p>No BloodBank to display</p>
          )}
        </div>
      )}
    </div>
  )

}



