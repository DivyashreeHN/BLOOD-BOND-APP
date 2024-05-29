import { useState } from "react";
import ShowProfiles from "./showProfile";
import ShowBloodRequests from "./showBloodRequests";
import ShowBloodBankRequest from "./showBloodBanksRequest";

export default function AdminDashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [showBloodRequest, setShowBloodRequest] = useState(false);
  const [showBloodbanks, setShowBloodbanks] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(true);
    setShowBloodRequest(false);
  };

  const handleRequestClick = () => {
    setShowBloodRequest(true);
    setShowProfile(false);
  };

  const handleBloodbankClick = () => {
    setShowBloodRequest(false);
    setShowProfile(false);
    setShowBloodbanks(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h3>AdminDashboard</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={handleProfileClick}>View Profiles</button>
        <button className="btn btn-primary" onClick={handleRequestClick}>View Requests</button>
        <button className="btn btn-primary" onClick={handleBloodbankClick}>View BloodBanksToApprove</button>
      </div>
      {showProfile && <ShowProfiles />}
      {showBloodRequest && <ShowBloodRequests />}
      {showBloodbanks && <ShowBloodBankRequest />}
    </div>
  )
}