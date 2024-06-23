
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShowProfiles from "./showProfile";
import ShowBloodRequests from "./showBloodRequests";
import ShowBloodBankRequest from "./showBloodBanksRequest";
import { useContext } from "react";

export default function AdminDashboard() {
  

  const navigate=useNavigate()

  const handleProfileClick = () => {
    
    navigate("/view/profiles/admin")

  };

  const handleRequestClick = () => {
    navigate("/view/requests/admin")
  };

  const handleBloodbankClick = () => {
    
    navigate("/view/bloodbank-requests/admin")
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h3>AdminDashboard</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={handleProfileClick}>View Profiles</button>
        <button className="btn btn-primary" onClick={handleRequestClick}>View Requests</button>
        <button className="btn btn-primary" onClick={handleBloodbankClick}>View BloodBanksToApprove</button>
      </div>
      
    </div>
  )
}