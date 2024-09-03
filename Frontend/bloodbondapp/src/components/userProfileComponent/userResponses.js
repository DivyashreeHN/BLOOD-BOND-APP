import {useEffect,useContext} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import ResponseContext from '../../contexts/responseContext';
import Swal from 'sweetalert2';
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
        try{
            const mailResponse=await axios.post('http://localhost:3080/api/conformation/mail',{
                donorEmail:response.responderId.email,
                donorName:`${response.responderId.firstName} ${response.responderId.lastName}`,
                bloodGroup: response.responderId.blood?.bloodGroup,
                requestId:response.bloodRequestId._id,
                donationAddress:response.bloodRequestId.donationAddress,
                donationDate:response.bloodRequestId.date
            })
            console.log('Email sent:', mailResponse.data)
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'conformation mail sent succesfully',
                showConfirmButton: true,
                confirmButtonText: 'OK'
            })
        }catch(err){

        }
    }
    return (
        <div>
            <h1 className='d-flex justify-content-center align-items-center'>Responses from Users</h1>
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
                            <td><button onClick={()=>{handleMail(response)}} className='btn btn-danger'>Send Confirmation</button></td>
                        </tr>
                    })}
                </tbody>
               </table>
                
            </div>):(<div className='d-flex justify-content-center align-items-center btn btn-danger' style={{width:'400px',marginLeft:'490px'}}>Zero response from donors for this request</div>)}       </div>
        
    )
}