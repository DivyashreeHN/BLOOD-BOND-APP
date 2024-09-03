import { useEffect, useContext } from "react";
import axios from "axios";
import UserHistoryContext from "../../contexts/userHistoryContext";
import { Alert } from "react-bootstrap";
import Swal from "sweetalert2";
export default function ViewAllResponses() {
  const { userHistories, userHistoryDispatch } = useContext(UserHistoryContext);
  console.log("history", userHistories.bloodBankResponsesHistory);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3080/api/bloodbank/histories`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log(response.data);
        userHistoryDispatch({ type: "BLOODBANK_RESPONSES", payload: response.data });
        userHistoryDispatch({ type: "SET_SERVER_ERRORS", payload: [] });
      } catch (err) {
        console.log(err);
        userHistoryDispatch({ type: "SET_SERVER_ERRORS", payload: err.response.data.errors });
      }
    })();
  }, [userHistoryDispatch]);
  const handleDelete=async(responseId,requestId)=>{
    try{
        const response=await axios.delete(`http://localhost:3080/api/bloodbank/response/delete/${responseId}`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        console.log(response.data)
        userHistoryDispatch({type:"DELETE_RESPONSE",payload:response.data})
       const response2= await axios.delete (`http://localhost:3080/api/invoice/${requestId}`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        console.log(response2.data)
        Swal.fire({
            title: 'Success!',
            text: 'Response and its invoice deleted succesfully',
            icon: 'success',
            confirmButtonText: 'OK'
        })
        userHistoryDispatch({ type: "SET_SERVER_ERRORS", payload: [] });
    }catch(err){
        console.log(err);
        userHistoryDispatch({ type: "SET_SERVER_ERRORS", payload: err.response.data.errors });
    }
  }
  return (
    <div>
        <div className='d-flex justify-content-center align-items-center'><h1>My Responses</h1></div>
      {userHistories?.bloodBankResponsesHistory?.length > 0 ? (
        <div>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>RequestId</th>
                <th>PatientName</th>
                <th>BloodGroup</th>
                <th>BloodType</th>
                <th>Units</th>
                <th>Donation Date</th>
                <th>Date Of Response</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userHistories.bloodBankResponsesHistory.map((history) => (
                <tr key={history._id}>
                  <td>{history.bloodRequestId._id}</td>
                  <td>{history.bloodRequestId.patientName}</td>
                  <td>{history.bloodRequestId.blood.bloodGroup}</td>
                  <td>{history.bloodRequestId.blood.bloodType}</td>
                  <td>{history.bloodRequestId.units}</td>
                  <td>{new Date(history.bloodRequestId.date).toLocaleDateString()}</td>
                  <td>{new Date(history.createdAt).toLocaleDateString()}</td>
                  <td><button className="btn btn-danger" onClick={()=>{handleDelete(history._id,history.bloodRequestId)}}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : 
      (<div className='d-flex justify-content-center align-items-center btn btn-danger' style={{marginTop:'50px',width:'275px',marginLeft:'550px'}}>You have no response history</div>)
      }
    </div>
  );
}
