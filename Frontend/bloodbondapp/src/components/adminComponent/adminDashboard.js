
import { useNavigate } from "react-router-dom";
import BloodBank from "./showBloodBanksRequest";
export default function AdminDashboard() {
  

  const navigate=useNavigate()

  

  const handleBloodbankClick = () => {
    
    navigate("/view/bloodbank-requests/admin")
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h3>AdminDashboard</h3>
      <BloodBank/>
      
    </div>
  )
}