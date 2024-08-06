import {useEffect,useContext} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import ResponseContext from '../../contexts/responseContext';
import {Alert} from 'react-bootstrap'
export default function UserResponses(){
    const {responses,responseDispatch}=useContext(ResponseContext)
    const {requestId}=useParams()
    useEffect(()=>{
        (async()=>{
            responseDispatch({ type: 'CLEAR_BLOODBANK_RESPONSES' });
            try{
                const response=await axios.get(`http://localhost:3080/api/response/user/${requestId}`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                console.log(response.data)
                responseDispatch({type:'USER_RESPONSES',payload:response.data})
                responseDispatch({type:'SET_SERVER_ERRORS',payload:[]})
            }catch(err){
                console.log(err)
                responseDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
            }
        })();
    },[requestId,responseDispatch])
    console.log('responses',responses.responsesData)
    const handleMail=async(response)=>{
        
    }
    return (
        <div>
            <h1>Responses from Users</h1>
            {responses?.responsesData?.length>0 ? (<div>
               <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Donor Name</th>
                        <th>Mobile No</th>
                        <th>Blood Group</th>
                        <th>Address</th>
                        <th>Date Of Response</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {responses?.responsesData?.map((response)=>{
                        return <tr key={response._id}>
                            <td>{response.responderId.firstName} {response.responderId.lastName}</td>
                            <td>{response.responderId.phNo}</td>
                            <td>{response.responderId.blood?.bloodGroup}</td>
                            <td>{response.responderId.address.building}, {response.responderId.address.locality}, {response.responderId.address.city}, {response.responderId.address.state},{response.responderId.address.pincode}</td>
                            <td>{new Date(response.createdAt).toLocaleDateString()}</td>
                            <td><button onClick={()=>{handleMail(response)}}>Send Confirmation</button></td>
                        </tr>
                    })}
                </tbody>
               </table>
                
            </div>):(<div><Alert variant="danger">Zero response from donors for this request</Alert></div>)}       </div>
        
    )
}