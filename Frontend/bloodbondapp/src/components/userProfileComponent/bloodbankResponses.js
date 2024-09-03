import {useEffect,useContext} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import {Link} from 'react-router-dom'
import axios from 'axios'
import ResponseContext from '../../contexts/responseContext';
import {Alert} from 'react-bootstrap'
import { BiMap } from 'react-icons/bi'
export default function BloodbankResponses(){
    const {responses,responseDispatch}=useContext(ResponseContext)
    const {requestId}=useParams()
    const navigate=useNavigate()
    useEffect(()=>{
        (async()=>{
            responseDispatch({ type: 'CLEAR_BLOODBANK_RESPONSES' });
            try{
                const response=await axios.get(`http://localhost:3080/api/response/bloodbank/${requestId}`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                console.log(response.data)
                responseDispatch({type:'ADD_BLOODBANK_RESPONSES',payload:response.data})
                responseDispatch({type:'SET_SERVER_ERRORS',payload:[]})
            }catch(err){
                console.log(err)
                responseDispatch({type:'SET_SERVER_ERRORS',payload:err.response?.data?.errors})
            }
        })();
    },[requestId,responseDispatch])
    console.log('responses',responses.responsesData)
    const handleViewInvoice=async(response)=>{
        console.log(response)
        console.log(response.bloodRequestId)
        navigate(`/view/invoice/${response.bloodRequestId}/${response.responderId._id}`)
    }
    const handleReview=(bloodbankId)=>{
        navigate(`/add/review/${bloodbankId}`)
    }
    return (
        <div>
            <h1 className='d-flex justify-content-center align-items-center'>Responses from Bloodbank</h1>
            {responses?.responsesData?.length>0 ? (<div>
               <table className="table table-striped table-bordered">
                <thead className="table-dark"> 
                    <tr>
                        <th>Donor Name</th>
                        <th>Mobile No</th>
                        <th>Address</th>
                        <th>Date Of Response</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {responses?.responsesData?.map((response)=>{
                        return <tr key={response._id}>
                            <td>{response.responderId.name}</td>
                            <td>{response.responderId.phoneNumber}</td>
                            <td>{response.responderId.address.building}, {response.responderId.address.locality}, {response.responderId.address.city}, {response.responderId.address.state},{response.responderId.address.pincode}</td>
                            <td>{new Date(response.createdAt).toLocaleDateString()}</td>
                            <td><Link to={`/map/${response.responderId.geoLocation.coordinates[1]}/${response.responderId.geoLocation.coordinates[0]}/${encodeURIComponent(`${response.responderId.address.building}, ${response.responderId.address.locality}, ${response.responderId.address.city}, ${response.responderId.address.state}, ${response.responderId.address.pincode}, ${response.responderId.address.country}`)}`}>
                                        <BiMap size={24} />
                                    </Link></td>
                            <td><button className='btn btn-danger' onClick={()=>{
                                handleViewInvoice(response)
                            }}>View Invoice</button>
                            <button style={{marginLeft:'10px'}} className="btn btn-danger" onClick={()=>{
                                handleReview(response.responderId._id)
                            }}>Rate Us</button></td>
                           
                        </tr>
                    })}
                </tbody>
               </table>
                
            </div>):(<div className='d-flex justify-content-center align-items-center btn btn-danger' style={{width:'400px',marginLeft:'490px'}}>Zero response from bloodbanks for this request</div>)}       </div>
        
    )
}